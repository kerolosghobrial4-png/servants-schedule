/* Speech helpers for Arabic: text-to-speech, speech recognition (ar-EG), recording, and an IndexedDB store. */
(function () {
  'use strict';
  const Speech = {};
  const LANG = 'ar-EG';

  /* ---------- Text to speech ---------- */
  let voices = [];
  function loadVoices() { try { voices = window.speechSynthesis ? speechSynthesis.getVoices() : []; } catch (e) { voices = []; } }
  if (window.speechSynthesis) { loadVoices(); speechSynthesis.onvoiceschanged = loadVoices; }
  Speech.voices = () => voices.filter(v => /^ar([-_]|$)/i.test(v.lang));
  Speech.pickVoice = (name) => {
    const ar = Speech.voices();
    if (name) { const v = ar.find(x => x.name === name); if (v) return v; }
    return ar.find(v => /ar[-_]EG/i.test(v.lang)) || ar.find(v => /google/i.test(v.name)) || ar[0] || null;
  };
  Speech.canSpeak = !!window.speechSynthesis;
  Speech.hasArabicVoice = () => Speech.voices().length > 0;
  function utter(text, opts) {
    const u = new SpeechSynthesisUtterance(text);
    u.lang = LANG;
    u.rate = opts.rate || 0.8;
    const v = Speech.pickVoice(opts.voice);
    if (v) { u.voice = v; u.lang = v.lang; }
    return u;
  }
  Speech.say = (text, opts = {}) => {
    if (!window.speechSynthesis) return false;
    speechSynthesis.cancel();
    speechSynthesis.speak(utter(text, opts));
    return true;
  };
  Speech.sayP = (text, opts = {}) => new Promise((resolve) => {
    if (!window.speechSynthesis) return resolve(false);
    const u = utter(text, opts);
    let done = false;
    const finish = () => { if (!done) { done = true; clearTimeout(t); resolve(true); } };
    const t = setTimeout(finish, 1500 + String(text).split(/\s+/).length * 900 / u.rate);
    u.onend = finish; u.onerror = finish;
    speechSynthesis.speak(u);
  });
  Speech.cancel = () => { try { speechSynthesis.cancel(); } catch (e) {} };

  /* ---------- Arabic text normalization ---------- */
  Speech.strip = (s) => String(s || '')
    .replace(/[ً-ٰٟۖ-ۭ]/g, '')  // harakat and Quranic marks
    .replace(/ـ/g, '')                                // tatweel
    .replace(/[أإآٱ]/g, 'ا').replace(/ى/g, 'ي').replace(/ة/g, 'ه').replace(/ؤ/g, 'و').replace(/ئ/g, 'ي');
  const norm = (s) => Speech.strip(s).replace(/[^ء-ي0-9٠-٩\s]/g, ' ').split(/\s+/).filter(Boolean);

  /* ---------- Speech recognition ---------- */
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  Speech.canHear = !!SR;
  let active = null;
  Speech.listen = () => new Promise((resolve, reject) => {
    if (!SR) return reject('unsupported');
    if (active) { try { active.abort(); } catch (e) {} }
    const r = new SR(); active = r;
    r.lang = LANG; r.interimResults = false; r.continuous = false; r.maxAlternatives = 5;
    let got = null;
    r.onresult = (e) => { const alts = []; for (let i = 0; i < e.results.length; i++) for (let j = 0; j < e.results[i].length; j++) alts.push(e.results[i][j].transcript); got = alts; };
    r.onerror = (e) => { active = null; reject(e.error || 'error'); };
    r.onend = () => { active = null; resolve(got || []); };
    try { r.start(); } catch (e) { reject('start'); }
  });
  Speech.stopListening = () => { if (active) try { active.stop(); } catch (e) {} };
  Speech.compare = (target, heard) => {
    const t = norm(target), h = norm(heard);
    const n = t.length, m = h.length;
    const dp = Array.from({ length: n + 1 }, () => new Array(m + 1).fill(0));
    for (let i = n - 1; i >= 0; i--) for (let j = m - 1; j >= 0; j--) dp[i][j] = t[i] === h[j] ? dp[i + 1][j + 1] + 1 : Math.max(dp[i + 1][j], dp[i][j + 1]);
    const hit = new Array(n).fill(false);
    let i = 0, j = 0;
    while (i < n && j < m) { if (t[i] === h[j]) { hit[i] = true; i++; j++; } else if (dp[i + 1][j] >= dp[i][j + 1]) i++; else j++; }
    const words = String(target).split(/\s+/).filter(Boolean);
    return { words: words.length === n ? words : t, hit, score: n ? Math.round(hit.filter(Boolean).length / n * 100) : 0 };
  };
  Speech.best = (target, alts) => {
    let best = { score: -1 }, heard = '';
    (alts || []).forEach(a => { const c = Speech.compare(target, a); if (c.score > best.score) { best = c; heard = a; } });
    if (best.score < 0) best = Speech.compare(target, '');
    best.heard = heard; return best;
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
    const done = new Promise((resolve) => { rec.onstop = () => { stream.getTracks().forEach(t => t.stop()); resolve(new Blob(chunks, { type: rec.mimeType || 'audio/webm' })); }; });
    rec.start();
    return { stop: () => { if (rec.state !== 'inactive') rec.stop(); return done; } };
  };

  window.Speech = Speech;
})();
