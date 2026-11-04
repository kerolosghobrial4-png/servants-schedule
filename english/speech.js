/* Speech helpers: text-to-speech, speech recognition scoring, audio recording, and a small IndexedDB store. */
(function () {
  'use strict';
  const Speech = {};

  /* ---------- Text to speech ---------- */
  let voices = [];
  function loadVoices() {
    try { voices = window.speechSynthesis ? speechSynthesis.getVoices() : []; } catch (e) { voices = []; }
  }
  if (window.speechSynthesis) {
    loadVoices();
    speechSynthesis.onvoiceschanged = loadVoices;
  }
  Speech.voices = () => voices.filter(v => /^en[-_]/i.test(v.lang));
  Speech.pickVoice = (name) => {
    const en = Speech.voices();
    if (name) { const v = en.find(x => x.name === name); if (v) return v; }
    return en.find(v => /en[-_]US/i.test(v.lang) && /google|samantha|natural|aria|jenny/i.test(v.name))
      || en.find(v => /en[-_]US/i.test(v.lang)) || en[0] || null;
  };
  Speech.canSpeak = !!window.speechSynthesis;
  Speech.say = (text, opts = {}) => {
    if (!window.speechSynthesis) return false;
    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = 'en-US';
    u.rate = opts.rate || 0.9;
    const v = Speech.pickVoice(opts.voice);
    if (v) u.voice = v;
    speechSynthesis.speak(u);
    return true;
  };

  /* ---------- Speech recognition ---------- */
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  Speech.canHear = !!SR;
  let active = null;
  Speech.listen = () => new Promise((resolve, reject) => {
    if (!SR) return reject('unsupported');
    if (active) { try { active.abort(); } catch (e) {} }
    const r = new SR();
    active = r;
    r.lang = 'en-US';
    r.interimResults = false;
    r.continuous = false;
    r.maxAlternatives = 4;
    let got = null;
    r.onresult = (e) => {
      const alts = [];
      for (let i = 0; i < e.results.length; i++) {
        for (let j = 0; j < e.results[i].length; j++) alts.push(e.results[i][j].transcript);
      }
      got = alts;
    };
    r.onerror = (e) => { active = null; reject(e.error || 'error'); };
    r.onend = () => { active = null; resolve(got || []); };
    try { r.start(); } catch (e) { reject('start'); }
  });
  Speech.stopListening = () => { if (active) try { active.stop(); } catch (e) {} };

  const norm = (s) => s.toLowerCase()
    .replace(/[’‘]/g, "'")
    .replace(/[^a-z0-9'\s-]/g, ' ')
    .replace(/-/g, ' ')
    .split(/\s+/).filter(Boolean);

  const numWords = { '0': 'zero', '1': 'one', '2': 'two', '3': 'three', '4': 'four', '5': 'five', '6': 'six', '7': 'seven', '8': 'eight', '9': 'nine', '10': 'ten', '12': 'twelve', '20': 'twenty' };
  const canon = (w) => numWords[w] || w.replace(/'s$/, 's').replace(/'/g, '');

  /* Align target words with heard words (longest common subsequence). */
  Speech.compare = (target, heard) => {
    const t = norm(target), h = norm(heard).map(canon), tc = t.map(canon);
    const n = t.length, m = h.length;
    const dp = Array.from({ length: n + 1 }, () => new Array(m + 1).fill(0));
    for (let i = n - 1; i >= 0; i--) for (let j = m - 1; j >= 0; j--) {
      dp[i][j] = tc[i] === h[j] ? dp[i + 1][j + 1] + 1 : Math.max(dp[i + 1][j], dp[i][j + 1]);
    }
    const hit = new Array(n).fill(false);
    let i = 0, j = 0;
    while (i < n && j < m) {
      if (tc[i] === h[j]) { hit[i] = true; i++; j++; }
      else if (dp[i + 1][j] >= dp[i][j + 1]) i++; else j++;
    }
    const matched = hit.filter(Boolean).length;
    return { words: t, hit, score: n ? Math.round(matched / n * 100) : 0, missed: t.filter((w, k) => !hit[k]) };
  };
  Speech.best = (target, alts) => {
    let best = { score: -1 }, heard = '';
    (alts || []).forEach(a => { const c = Speech.compare(target, a); if (c.score > best.score) { best = c; heard = a; } });
    if (best.score < 0) { best = Speech.compare(target, ''); }
    best.heard = heard;
    return best;
  };

  /* ---------- Recording ---------- */
  Speech.canRecord = !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia && window.MediaRecorder);
  Speech.record = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const types = ['audio/webm;codecs=opus', 'audio/mp4', 'audio/webm', 'audio/ogg'];
    const mimeType = types.find(t => MediaRecorder.isTypeSupported && MediaRecorder.isTypeSupported(t));
    const rec = mimeType ? new MediaRecorder(stream, { mimeType }) : new MediaRecorder(stream);
    const chunks = [];
    rec.ondataavailable = (e) => { if (e.data && e.data.size) chunks.push(e.data); };
    const done = new Promise((resolve) => {
      rec.onstop = () => {
        stream.getTracks().forEach(t => t.stop());
        resolve(new Blob(chunks, { type: rec.mimeType || 'audio/webm' }));
      };
    });
    rec.start();
    return { stop: () => { if (rec.state !== 'inactive') rec.stop(); return done; } };
  };

  /* ---------- IndexedDB for recordings ---------- */
  let dbp = null;
  function db() {
    if (dbp) return dbp;
    dbp = new Promise((resolve, reject) => {
      if (!window.indexedDB) return reject('no-idb');
      const req = indexedDB.open('sekka', 1);
      req.onupgradeneeded = () => { req.result.createObjectStore('recs', { keyPath: 'id' }); };
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
    return dbp;
  }
  function tx(mode, fn) {
    return db().then(d => new Promise((resolve, reject) => {
      const t = d.transaction('recs', mode);
      const store = t.objectStore('recs');
      const out = fn(store);
      t.oncomplete = () => resolve(out && out.result !== undefined ? out.result : out);
      t.onerror = () => reject(t.error);
    }));
  }
  Speech.saveRec = (rec) => tx('readwrite', s => s.put(rec));
  Speech.allRecs = () => tx('readonly', s => s.getAll()).then(list => (list || []).sort((a, b) => b.at - a.at));
  Speech.deleteRec = (id) => tx('readwrite', s => s.delete(id));
  Speech.getRec = (id) => tx('readonly', s => s.get(id));

  window.Speech = Speech;
})();
