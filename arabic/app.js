/* Harf — learn to read and write the Arabic you already speak. */
(function () {
  'use strict';
  const H = window.HARF;
  const LEVELS = H.levels.slice().sort((a, b) => a.n - b.n);
  const isAr = (s) => /[؀-ۿ]/.test(String(s));
  const strip = Speech.strip;
  const plain = (s) => String(s).replace(/[ً-ٰٟ]/g, '');
  const letterList = (word) => [...plain(word).replace(/\s+/g, '')];
  const ZWJ = '‍';
  const forms = (c) => {
    const j = H.letter[c] ? H.letter[c].joins : true;
    return { alone: c, start: j ? c + ZWJ : c, middle: j ? ZWJ + c + ZWJ : ZWJ + c, end: ZWJ + c };
  };
  const syl = (c) => c === 'ا' ? 'آ' : c + 'َ';

  /* ================= State and people ================= */
  const KEY = 'harf.v1', PKEY = 'harf.profiles';
  const today = () => { const d = new Date(); return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); };
  const addDays = (iso, n) => { const d = new Date(iso + 'T12:00:00'); d.setDate(d.getDate() + n); return d.toISOString().slice(0, 10); };
  const fresh = () => ({ name: '', created: today(), xp: 0, days: {}, streak: { count: 0, last: '' }, units: {}, cards: {}, miss: {}, notes: [], reviewed: '', toured: false,
    settings: { size: 'l', rate: 0.75, translit: true, theme: '', voice: '' } });
  let S;
  try { S = Object.assign(fresh(), JSON.parse(localStorage.getItem(KEY) || '{}')); } catch (e) { S = fresh(); }
  S.settings = Object.assign(fresh().settings, S.settings || {});
  const keyOf = (n) => String(n || '').trim().toLowerCase().replace(/\s+/g, ' ');
  let P = { current: '', list: [] };
  try { P = Object.assign(P, JSON.parse(localStorage.getItem(PKEY) || '{}')); } catch (e) {}
  if (!Array.isArray(P.list)) P.list = [];
  if (S.name && !P.list.some(x => x.k === keyOf(S.name))) P.list.push({ k: keyOf(S.name), name: S.name });
  if (S.name) P.current = keyOf(S.name);
  const savePeople = () => { try { localStorage.setItem(PKEY, JSON.stringify(P)); } catch (e) {} };
  savePeople();
  const save = () => {
    try {
      const raw = JSON.stringify(S);
      localStorage.setItem(KEY, raw);
      if (S.name) {
        const k = keyOf(S.name);
        localStorage.setItem('harf.p.' + k, raw);
        const e = P.list.find(x => x.k === k); if (e) e.name = S.name; else P.list.push({ k, name: S.name });
        P.current = k; savePeople();
      }
    } catch (e) {}
  };
  function loadPerson(k) {
    let o = null; try { o = JSON.parse(localStorage.getItem('harf.p.' + k) || 'null'); } catch (e) {}
    S = Object.assign(fresh(), o || {}); S.settings = Object.assign(fresh().settings, (o && o.settings) || {});
    P.current = o ? k : ''; savePeople();
    try { if (o) localStorage.setItem(KEY, JSON.stringify(S)); else localStorage.removeItem(KEY); } catch (e) {}
  }
  const picked = (v) => { try { if (v) sessionStorage.setItem('harf.picked', '1'); return !!sessionStorage.getItem('harf.picked'); } catch (e) { return true; } };
  function switchPerson(k) { save(); loadPerson(k); picked(1); applySettings(); location.hash = '#/'; route(); }
  function addPerson() { save(); S = fresh(); P.current = ''; savePeople(); try { localStorage.removeItem(KEY); } catch (e) {} picked(1); applySettings(); location.hash = '#/'; route(); }

  function addXP(n) {
    const d = today();
    S.xp += n; S.days[d] = (S.days[d] || 0) + n;
    if (S.streak.last !== d) { S.streak.count = S.streak.last === addDays(d, -1) ? S.streak.count + 1 : 1; S.streak.last = d; }
    save();
  }
  const streakNow = () => (S.streak.last === today() || S.streak.last === addDays(today(), -1)) ? S.streak.count : 0;
  const U = (id) => (S.units[id] = S.units[id] || { lesson: false, best: null, tries: 0, steps: {} });
  const PASS = 80;
  const unitDone = (id) => { const s = S.units[id]; return !!(s && s.best !== null && s.best >= PASS); };

  /* ================= Content index and generated questions ================= */
  const UNIT = {}, ITEM = {}, ORDER = [];
  const shuffle = (a) => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const sample = (a, n) => shuffle(a).slice(0, n);
  const pick = (a) => a[Math.floor(Math.random() * a.length)];
  function others(correct, pool, n, key) {
    key = key || (x => x);
    const seen = new Set([key(correct)]);
    return shuffle(pool).filter(x => { const k = key(x); if (seen.has(k)) return false; seen.add(k); return true; }).slice(0, n);
  }
  const learned = [];
  LEVELS.forEach(L => L.units.forEach((u, ui) => {
    u.level = L; u.index = ui; UNIT[u.id] = u; ORDER.push(u);
    const items = [];
    if (u.kind === 'letters') {
      learned.push(...u.letters);
      const pool = learned.length >= 4 ? learned.slice() : H.letters.map(x => x.c);
      u.letters.forEach(c => {
        const d = H.letter[c];
        items.push({ t: 'mc', big: c, q: 'Which sound does this letter make?', o: [d.tr].concat(others(c, pool, 3).map(x => H.letter[x].tr)), a: 0, why: `${c} is ${d.en}: ${d.sound}` });
        items.push({ t: 'listen', say: syl(c), q: 'Which letter do you hear?', o: [c].concat(others(c, pool, 3)), a: 0, why: `That was ${d.en} (${c}).` });
        const f = forms(c); const which = d.joins ? pick(['start', 'middle', 'end']) : 'end';
        items.push({ t: 'mc', big: f[which], q: `This is the ${which === 'start' ? 'start' : which === 'middle' ? 'middle' : 'end'} shape of which letter?`, o: [c].concat(others(c, pool, 3)), a: 0, why: `The core shape of ${c} stays the same when it joins.` });
        items.push({ t: 'mc', big: d.ex.ar, q: `This word is "${d.ex.tr}" (${d.ex.en}). Which letter does it start with?`, o: [plain(d.ex.ar)[0] === 'أ' ? 'ا' : plain(d.ex.ar)[0]].concat(others(plain(d.ex.ar)[0], pool, 3)), a: 0 });
      });
    }
    if (u.syllables) {
      u.syllables.forEach(sy => items.push({ t: 'listen', say: sy, q: 'Which do you hear?', o: [sy].concat(others(sy, u.syllables.filter(x => x[0] === sy[0]).concat(u.syllables), 2)), a: 0 }));
    }
    if (u.kind === 'numbers') {
      const ar = '٠١٢٣٤٥٦٧٨٩';
      for (let k = 0; k < 10; k++) items.push({ t: 'mc', big: ar[k], q: 'Which number is this?', o: [String(k)].concat(others(String(k), '0123456789'.split(''), 3)), a: 0 });
      [['٣٥', '35'], ['٧٢', '72'], ['١٠٠', '100'], ['٢٤٩', '249'], ['٥٠', '50']].forEach(([a, w]) => items.push({ t: 'mc', big: a, q: 'Which number is this?', o: [w, w.split('').reverse().join(''), String(+w + 10), String(Math.max(1, +w - 3))], a: 0, why: 'Numbers are read left to right, like English.' }));
    }
    if (u.words) {
      const pool = u.words;
      u.words.forEach(w => {
        w.plain = plain(w.ar);
        const show = u.plain ? w.plain : w.ar;
        items.push({ t: 'mc', big: show, q: 'What does this mean?', o: [w.en].concat(others(w, pool, 3, x => x.en).map(x => x.en)), a: 0, tr: w.tr });
        items.push({ t: 'listen', say: w.ar, q: 'Which word do you hear?', o: [show].concat(others(w, pool, 3, x => x.plain).map(x => u.plain ? x.plain : x.ar)), a: 0 });
        if (letterList(w.ar).length <= 7) items.push({ t: 'spell', a: w.plain, hint: w.en, tr: w.tr });
        items.push({ t: 'say', text: show, tr: w.tr, en: w.en });
      });
    }
    if (u.sentences) {
      const pool = u.sentences;
      u.sentences.forEach(s => {
        items.push({ t: 'mc', big: s.ar, q: 'What does this mean?', o: [s.en].concat(others(s, pool, 3, x => x.en).map(x => x.en)), a: 0, tr: s.tr });
        items.push({ t: 'listen', say: s.ar, q: 'Which sentence do you hear?', o: [s.ar].concat(others(s, pool, 3, x => x.ar).map(x => x.ar)), a: 0 });
        if (s.ar.split(/\s+/).length >= 3) items.push({ t: 'order', a: s.ar.replace(/[؟،.!]/g, ''), hint: s.en });
        items.push({ t: 'say', text: s.ar, tr: s.tr, en: s.en });
      });
    }
    if (u.spell) u.spell.forEach(w => items.push({ t: 'spell', a: w.ar, hint: w.en }));
    (u.items || []).forEach(x => items.push(x));
    items.forEach((it, k) => { it.id = u.id + '-' + k; it.unit = u; ITEM[it.id] = it; });
    u.qs = items;
  }));
  const CARD = {};
  ORDER.forEach(u => {
    (u.letters || []).forEach(c => { const d = H.letter[c]; CARD['L:' + c] = { front: c, back: `${d.en} · "${d.tr}"`, sub: d.sound, say: syl(c), unit: u.id }; });
    (u.words || []).forEach(w => { CARD['W:' + w.plain] = { front: u.plain ? w.plain : w.ar, back: w.en, sub: w.tr, say: w.ar, unit: u.id }; });
    (u.sentences || []).forEach(s => { CARD['S:' + s.ar] = { front: s.ar, back: s.en, sub: s.tr, say: s.ar, unit: u.id }; });
  });
  const cardKeys = (u) => [].concat((u.letters || []).map(c => 'L:' + c), (u.words || []).map(w => 'W:' + w.plain), (u.sentences || []).map(s => 'S:' + s.ar));

  /* ================= Helpers ================= */
  const app = document.getElementById('app');
  const esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const md = (s) => esc(s).replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br>');
  const arSpan = (s, cls) => isAr(s) ? `<span class="ar ${cls || ''}" lang="ar" dir="rtl">${esc(s)}</span>` : md(s);
  const mixed = (s) => esc(s).replace(/([\u0600-\u06FF](?:[\u0600-\u06FF\s\u060C\u061F.!\u200D]*[\u0600-\u06FF\u200D])?)/g, '<bdi class="ar" lang="ar" dir="rtl">$1</bdi>').replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  let toastT;
  function toast(m) { const t = document.getElementById('toast'); t.textContent = m; t.hidden = false; clearTimeout(toastT); toastT = setTimeout(() => t.hidden = true, 2600); }
  let warnedVoice = false;
  const say = (text) => {
    if (!Speech.canSpeak) return toast('This browser cannot read aloud.');
    if (!Speech.hasArabicVoice() && !warnedVoice) { warnedVoice = true; toast('No Arabic voice on this phone yet. See Me → Settings for how to add one.'); }
    Speech.say(text, { rate: S.settings.rate, voice: S.settings.voice });
  };
  const I = {
    speak: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9v6h4l5 4V5L8 9H4z" fill="currentColor"/><path d="M16 8.5a5 5 0 0 1 0 7M18.5 6a8.5 8.5 0 0 1 0 12" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
    mic: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="9" y="3" width="6" height="11" rx="3" fill="currentColor"/><path d="M5 11a7 7 0 0 0 14 0M12 18v3" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
    back: '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d="M15 5l-7 7 7 7" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>'
  };
  const speakBtn = (text, label) => `<button class="icon-btn" data-say="${esc(text)}" aria-label="${esc(label || 'Listen')}">${I.speak}</button>`;
  document.addEventListener('click', (e) => { const b = e.target.closest('[data-say]'); if (b) { e.preventDefault(); say(b.getAttribute('data-say')); } });
  const tr = (t) => S.settings.translit && t ? `<span class="tr">${esc(t)}</span>` : '';
  function applySettings() {
    const r = document.documentElement;
    r.setAttribute('data-size', S.settings.size);
    if (S.settings.theme) r.setAttribute('data-theme', S.settings.theme); else r.removeAttribute('data-theme');
  }
  function brand(chip) {
    return `<div class="spread"><div class="brand"><svg viewBox="0 0 48 48" aria-hidden="true"><rect width="48" height="48" rx="12" fill="var(--nile)"/><text x="24" y="33" text-anchor="middle" font-size="26" fill="var(--nile-ink)" font-family="Noto Naskh Arabic, serif">ح</text></svg>
      <div><b>Harf</b> <span class="ar" lang="ar">حرف</span></div></div>
      ${chip !== false && S.name ? `<span class="chip gold">${streakNow() ? streakNow() + ' day streak' : 'Start a streak today'}</span>` : ''}</div>`;
  }

  /* ================= Router ================= */
  let cleanups = [];
  const onLeave = (fn) => cleanups.push(fn);
  function route() {
    cleanups.forEach(f => { try { f(); } catch (e) {} }); cleanups = [];
    Speech.cancel(); Speech.stopListening();
    const [a, b, c] = (location.hash.replace(/^#\/?/, '') || '').split('/').filter(Boolean);
    let tab = 'home';
    if (P.list.length > 1 && !picked() && a !== 'me') { viewWho(); setTab('home'); return; }
    if (!S.name && a !== 'who') { viewWelcome(); setTab('home'); return; }
    if (a === 'who') { viewWho(); setTab('me'); return; }
    if (!a) viewHome();
    else if (a === 'unit' && UNIT[b]) viewUnit(UNIT[b], c || 'lesson');
    else if (a === 'review') viewReview();
    else if (a === 'test' && LEVELS.find(L => L.id === b)) viewTest(LEVELS.find(L => L.id === b));
    else if (a === 'notes') { tab = 'notes'; viewNotes(); }
    else if (a === 'note') { tab = 'notes'; viewNote(b || 'new'); }
    else if (a === 'me') { tab = 'me'; viewMe(); }
    else if (a === 'alphabet') { tab = 'me'; viewAlphabet(); }
    else viewHome();
    setTab(tab); window.scrollTo(0, 0);
  }
  function setTab(t) { document.querySelectorAll('.tabs a').forEach(x => x.classList.toggle('on', x.dataset.tab === t)); }
  window.addEventListener('hashchange', route);

  /* ================= Welcome and people ================= */
  function viewWelcome() {
    app.innerHTML = `${brand(false)}
      <div class="hero"><span class="eyebrow">Welcome · أهلاً</span>
        <h1>Read and write the Arabic you already speak.</h1>
        <p>You know the words. Now learn the letters: 28 letters, a few marks, and then you can read signs, messages, the Bible, and anything else.</p></div>
      <div class="card stack">
        <label class="field" for="nm">What is your name?<span class="small muted">Your progress is saved under your name. If you already started, type the same name.</span>
          <input id="nm" class="input" autocomplete="given-name" placeholder="Your name"></label>
        <button class="btn primary block" id="go">Start</button></div>`;
    const go = () => {
      const name = document.getElementById('nm').value.trim(); if (!name) { document.getElementById('nm').focus(); return; }
      const k = keyOf(name);
      if (P.list.some(x => x.k === k) && localStorage.getItem('harf.p.' + k)) { loadPerson(k); applySettings(); toast('Welcome back, ' + S.name + '!'); }
      else { S = fresh(); S.name = name; save(); }
      picked(1); location.hash = '#/'; route();
    };
    document.getElementById('go').onclick = go;
    document.getElementById('nm').onkeydown = (e) => { if (e.key === 'Enter') go(); };
  }
  function viewWho() {
    const people = P.list.filter(x => localStorage.getItem('harf.p.' + x.k));
    app.innerHTML = `${brand(false)}<h1>Who's learning?</h1>
      <div class="units">${people.map(x => `<button class="unit-link" data-who="${esc(x.k)}"><span class="k avatar">${esc((x.name || '?').charAt(0).toUpperCase())}</span><span class="t"><b>${esc(x.name)}</b><span>${x.k === P.current ? 'Last used on this phone' : 'Tap to continue'}</span></span><span class="chip">Open</span></button>`).join('')}</div>
      <button class="btn block" id="who-add">+ Add a person</button>`;
    app.querySelectorAll('[data-who]').forEach(b => b.onclick = () => switchPerson(b.dataset.who));
    document.getElementById('who-add').onclick = addPerson;
  }

  /* ================= Steps and next step ================= */
  const STEP = { lesson: 'Learn', write: 'Write', speak: 'Read aloud', quiz: 'Quiz' };
  function unitSteps(u) {
    const s = U(u.id), d = s.steps || {};
    const st = [{ k: 'lesson', done: !!s.lesson }];
    if ((u.trace && u.trace.length) || u.qs.some(q => q.t === 'spell')) st.push({ k: 'write', done: !!d.write });
    if (u.words || u.sentences) st.push({ k: 'speak', done: !!d.speak });
    st.push({ k: 'quiz', done: unitDone(u.id) });
    return st;
  }
  const nextUnitStep = (u) => { const n = unitSteps(u).find(x => !x.done); return n ? n.k : 'quiz'; };
  function markStep(u, k) { const s = U(u.id); s.steps = s.steps || {}; if (!s.steps[k]) { s.steps[k] = true; addXP(5); } save(); }
  function nextStep() {
    for (const L of LEVELS) {
      for (const u of L.units) if (!unitDone(u.id)) { const k = nextUnitStep(u); return { href: `#/unit/${u.id}/${k}`, title: u.title, sub: `Level ${L.n} · ${STEP[k]}`, u }; }
      const t = S.units['T:' + L.id];
      if (!(t && t.passed)) return { href: `#/test/${L.id}`, title: `Level ${L.n} test`, sub: L.title };
    }
    return null;
  }
  function nextButton(u, from) {
    const st = unitSteps(u); const i = st.findIndex(x => x.k === from);
    const nx = st.slice(i + 1).find(x => !x.done) || st[i + 1];
    if (nx) return `<a class="btn primary" href="#/unit/${u.id}/${nx.k}">Next: ${STEP[nx.k]}</a>`;
    const nu = u.level.units[u.index + 1];
    return nu ? `<a class="btn primary" href="#/unit/${nu.id}/lesson">Next: ${esc(nu.title)}</a>` : `<a class="btn primary" href="#/test/${u.level.id}">Level ${u.level.n} test</a>`;
  }

  /* ================= Review (spaced) ================= */
  const GAPS = [0, 1, 3, 7, 16, 35];
  const dueCards = () => Object.keys(S.cards).filter(k => CARD[k] && S.cards[k].due <= today());
  const dueMisses = () => Object.keys(S.miss).filter(id => ITEM[id] && S.miss[id].due <= today() && ITEM[id].t !== 'say');
  const reviewCount = () => Math.min(20, dueCards().length) + Math.min(10, dueMisses().length);
  function addCards(u) { cardKeys(u).forEach(k => { if (!S.cards[k]) S.cards[k] = { box: 0, due: addDays(today(), 1) }; }); save(); }
  function viewReview() {
    let queue = shuffle(dueCards()).slice(0, 20); let done = 0;
    app.innerHTML = `<a class="back" href="#/">${I.back} Home</a><div class="stack" style="gap:6px"><span class="eyebrow">Daily review</span><h1>Remember</h1></div><div id="rv" class="stack"></div>`;
    const box = document.getElementById('rv');
    const finish = () => {
      const ms = dueMisses().slice(0, 10).map(id => ITEM[id]);
      if (ms.length) {
        box.innerHTML = `<div class="card flat stack"><b>Now ${ms.length} question${ms.length === 1 ? '' : 's'} you missed before.</b></div><div id="rvq" class="stack"></div>`;
        runSet({ box: box.querySelector('#rvq'), items: ms, mode: 'review', onFinish: () => end() });
      } else end();
    };
    const end = () => { S.reviewed = today(); save(); box.innerHTML = `<div class="card stack" style="text-align:center;align-items:center"><h2>Review done!</h2><p>${done ? `You reviewed ${done} cards. ` : ''}They will come back right before you forget them.</p>${nextStep() ? `<a class="btn primary" href="${nextStep().href}">Continue: ${esc(nextStep().title)}</a>` : ''}</div>`; };
    const show = () => {
      if (!queue.length) return finish();
      const k = queue[0], c = CARD[k];
      box.innerHTML = `<div class="qhead"><span class="eyebrow">${queue.length} left</span></div>
        <div class="card flash" id="fl" role="button" tabindex="0"><div class="ar big-ar" lang="ar" dir="rtl">${esc(c.front)}</div><p class="muted">What is it? Say it in your head.</p><p class="small muted">Tap to check</p></div><div id="gr"></div>`;
      const reveal = () => {
        document.getElementById('fl').innerHTML = `<div class="ar big-ar" lang="ar" dir="rtl">${esc(c.front)}</div><h3>${esc(c.back)}</h3>${c.sub ? `<p class="muted">${esc(c.sub)}</p>` : ''}`;
        say(c.say);
        document.getElementById('gr').innerHTML = `<div class="grade3"><button class="btn" data-g="0">I forgot</button><button class="btn" data-g="1">Hard</button><button class="btn primary" data-g="2">I knew it</button></div>`;
        document.querySelectorAll('[data-g]').forEach(b => b.onclick = () => {
          const g = +b.dataset.g, card = S.cards[k];
          if (g === 0) { card.box = 0; card.due = today(); queue.push(queue.shift()); }
          else { card.box = g === 2 ? Math.min(GAPS.length - 1, card.box + 1) : Math.max(1, card.box); card.due = addDays(today(), GAPS[card.box] || 1); queue.shift(); done++; addXP(1); }
          save(); show();
        });
      };
      const fl = document.getElementById('fl'); fl.onclick = reveal; fl.onkeydown = (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); reveal(); } };
    };
    show();
  }

  /* ================= Home ================= */
  function viewHome() {
    const n = nextStep(), rc = S.reviewed === today() ? 0 : reviewCount();
    const hour = new Date().getHours();
    const greet = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';
    app.innerHTML = `${brand()}
      ${S.toured ? '' : `<div class="card stack" id="tour"><div class="spread"><b>How Harf works</b><button class="btn small ghost" id="tour-x">Got it</button></div>
        <p class="small">Tap <b>Continue</b> every day. Each lesson has a few steps: learn the letters or words, write them with your finger, read aloud, then a short quiz. Old letters and words come back in a quick daily review. Tap any Arabic with a speaker button to hear it.</p></div>`}
      <div class="hero"><span class="eyebrow">${greet}, ${esc(S.name)}</span>
        ${rc ? `<h2>Start with a quick review</h2><p>${rc} things to remember · about 3 minutes</p><div class="row"><a class="btn" href="#/review">Review</a>${n ? `<a class="small" href="${n.href}" style="color:inherit">Skip to the lesson</a>` : ''}</div>`
        : n ? `<h2>${esc(n.title)}</h2><p>${esc(n.sub)}</p><div class="row"><a class="btn" href="${n.href}">Continue</a></div>`
        : '<h2>You finished every level!</h2><p>Keep reading every day: signs, messages, the Bible.</p>'}</div>
      <div class="stack"><h2>Your path</h2><div>${LEVELS.map(levelBlock).join('')}</div></div>`;
    const tx = document.getElementById('tour-x'); if (tx) tx.onclick = () => { S.toured = true; save(); document.getElementById('tour').remove(); };
  }
  function levelBlock(L) {
    const n = nextStep(); const cur = n && ((n.u && n.u.level === L) || n.href === `#/test/${L.id}`);
    const done = L.units.filter(u => unitDone(u.id)).length;
    const t = S.units['T:' + L.id], passed = t && t.passed;
    return `<div class="level ${passed ? 'done' : cur ? 'on' : ''}"><div class="rail"><div class="node">${L.n}</div></div>
      <div class="body"><div class="spread"><div><h3>${esc(L.title)}</h3>${cur ? `<span class="small muted">${esc(L.desc)}</span>` : ''}</div>${cur ? '<span class="chip gold">You are here</span>' : passed ? '<span class="chip good">Done</span>' : ''}</div>
        <div class="bar"><i style="width:${Math.round(done / L.units.length * 100)}%"></i></div>
        <details class="units-wrap" ${cur ? 'open' : ''}><summary class="small muted">${cur ? 'Hide lessons' : `Show lessons · ${done} of ${L.units.length} done`}</summary>
        <div class="units">${L.units.map(u => { const s = S.units[u.id]; const chip = unitDone(u.id) ? `<span class="chip good">${s.best}%</span>` : s && s.lesson ? '<span class="chip">In progress</span>' : '<span class="chip plain">New</span>';
          return `<a class="unit-link" href="#/unit/${u.id}/${unitDone(u.id) ? 'lesson' : nextUnitStep(u)}"><span class="k ar" lang="ar">${esc((u.ar || '').split(' ')[0])}</span><span class="t"><b>${esc(u.title)}</b></span>${chip}</a>`; }).join('')}
          <a class="unit-link" href="#/test/${L.id}"><span class="k">✓</span><span class="t"><b>Level ${L.n} test</b><span>Pass with ${PASS}%</span></span>${passed ? `<span class="chip good">${t.best}%</span>` : '<span class="chip plain">Test</span>'}</a>
        </div></details></div></div>`;
  }

  /* ================= Unit ================= */
  function viewUnit(u, tab) {
    const steps = unitSteps(u);
    if (!steps.some(x => x.k === tab) && tab !== 'practice') tab = 'lesson';
    app.innerHTML = `<a class="back" href="#/">${I.back} Level ${u.level.n} · ${esc(u.level.title)}</a>
      <div class="stack" style="gap:4px"><h1>${mixed(u.title)}</h1></div>
      <nav class="stepbar">${steps.map((x, i) => `<a href="#/unit/${u.id}/${x.k}" class="${x.k === tab || (tab === 'practice' && x.k === 'quiz') ? 'on' : ''} ${x.done ? 'done' : ''}"><span class="n">${x.done ? '✓' : i + 1}</span>${STEP[x.k]}</a>`).join('')}</nav>
      <div id="ub" class="stack"></div>`;
    const box = document.getElementById('ub');
    if (tab === 'write') renderWrite(u, box);
    else if (tab === 'speak') renderSpeak(u, box);
    else if (tab === 'quiz') renderQuizIntro(u, box);
    else if (tab === 'practice') runSet({ box, items: shuffle(u.qs.filter(q => q.t !== 'say')), mode: 'practice', onFinish: () => location.hash = `#/unit/${u.id}/quiz` });
    else renderLesson(u, box);
  }
  function blockHTML(b) {
    if (b.p) return `<p class="lead">${mixed(b.p)}</p>`;
    if (b.tip) return `<p class="tip">${mixed(b.tip)}</p>`;
    if (b.table) return `<div class="tbl-wrap"><table><thead><tr>${b.table[0].map(c => `<th>${mixed(c)}</th>`).join('')}</tr></thead><tbody>${b.table.slice(1).map(r => `<tr>${r.map(c => `<td>${isAr(c) && !/[a-z]/i.test(c) ? `<span class="ar td-ar" lang="ar">${esc(c)}</span>` : mixed(c)}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
    if (b.ex) return `<div class="ex">${b.ex.map(x => `<div class="ex-line"><span class="ar ex-ar" lang="ar" dir="rtl">${esc(x.ar)}</span><span class="ex-en">${tr(x.tr)}<span class="muted small">${esc(x.en)}</span></span>${speakBtn(x.ar)}</div>`).join('')}</div>`;
    if (b.forms) return `<div class="tbl-wrap"><table class="forms"><thead><tr><th>Alone</th><th>Start</th><th>Middle</th><th>End</th></tr></thead><tbody>${b.forms.map(c => { const f = forms(c); return `<tr>${['alone', 'start', 'middle', 'end'].map(k => `<td><span class="ar td-ar" lang="ar">${esc(f[k])}</span></td>`).join('')}</tr>`; }).join('')}</tbody></table></div>`;
    if (b.numtable) return `<div class="nums">${'٠١٢٣٤٥٦٧٨٩'.split('').map((d, k) => `<button class="num" data-say="${d}"><span class="ar" lang="ar">${d}</span><span>${k}</span></button>`).join('')}</div>`;
    return '';
  }
  function letterCard(c) {
    const d = H.letter[c], f = forms(c);
    return `<div class="card stack letter-card">
      <div class="spread"><div class="row" style="gap:14px"><span class="ar letter-big" lang="ar">${esc(c)}</span><div><b>${esc(d.en)}</b> <span class="ar" lang="ar">${esc(d.name)}</span><div class="small muted">Sound: "${esc(d.tr)}"</div></div></div>${speakBtn(syl(c), 'Hear the sound')}</div>
      <p>${esc(d.sound)}</p>${d.egy ? `<p class="tip small">${mixed(d.egy)}</p>` : ''}
      <div class="forms-row">${['alone', 'start', 'middle', 'end'].map(k => `<div><span class="ar" lang="ar">${esc(f[k])}</span><small>${k}</small></div>`).join('')}</div>
      ${!d.joins ? '<p class="small"><b>Does not join</b> to the letter after it.</p>' : ''}
      <div class="ex-line"><span class="ar ex-ar" lang="ar">${esc(d.ex.ar)}</span><span class="ex-en">${tr(d.ex.tr)}<span class="muted small">${esc(d.ex.en)}</span></span>${speakBtn(d.ex.ar)}</div>
    </div>`;
  }
  function renderLesson(u, box) {
    const s = U(u.id);
    let html = (u.intro || []).map(blockHTML).join('');
    if (u.letters) html += u.letters.map(letterCard).join('');
    if (u.words) html += `<h3>${u.plain ? 'Read each word, then tap to check' : 'Words'}</h3><div class="ex">${u.words.map(w => u.plain
      ? `<details class="ex-line reveal"><summary><span class="ar ex-ar" lang="ar">${esc(w.plain)}</span><span class="small muted">Tap to check</span></summary><span class="ex-en">${tr(w.tr)}<span class="muted small">${esc(w.en)}</span></span>${speakBtn(w.ar)}</details>`
      : `<div class="ex-line"><span class="ar ex-ar" lang="ar">${esc(w.ar)}</span><span class="ex-en">${tr(w.tr)}<span class="muted small">${esc(w.en)}</span></span>${speakBtn(w.ar)}</div>`).join('')}</div>`;
    if (u.sentences) html += `<h3>Read each line</h3><div class="ex">${u.sentences.map(x => `<div class="ex-line"><span class="ar ex-ar" lang="ar">${esc(x.ar)}</span><span class="ex-en">${tr(x.tr)}<span class="muted small">${esc(x.en)}</span></span>${speakBtn(x.ar)}</div>`).join('')}</div>`;
    const myNotes = (S.notes || []).filter(n => n.unit === u.id && (n.title || n.body));
    box.innerHTML = `<div class="lesson stack">${html}</div>
      ${myNotes.length ? `<h3>My notes</h3><div class="units">${myNotes.map(n => `<a class="unit-link" href="#/note/${n.id}"><span class="t"><b>${esc(n.title || 'Untitled')}</b><span>${esc(new Date(n.updated).toLocaleDateString())}</span></span></a>`).join('')}</div>` : ''}
      <div class="card flat stack"><div class="row">${s.lesson ? nextButton(u, 'lesson') : '<button class="btn primary" id="ld">I finished the lesson</button>'}<button class="btn ghost" id="nt">Write a note</button></div></div>`;
    const ld = document.getElementById('ld');
    if (ld) ld.onclick = () => { s.lesson = true; addXP(10); addCards(u); toast('Added to your daily review.'); const st = unitSteps(u); location.hash = `#/unit/${u.id}/${st[1] ? st[1].k : 'quiz'}`; };
    document.getElementById('nt').onclick = () => { S.noteFrom = u.id; location.hash = '#/note/new'; };
  }

  /* ================= Write: tracing letters and spelling words ================= */
  function renderWrite(u, box) {
    const targets = u.trace || [];
    const spells = u.qs.filter(q => q.t === 'spell');
    box.innerHTML = `${targets.length ? `<div class="card flat stack"><b>Write with your finger</b><p class="small muted">Trace over the gray shape. Arabic is written from <b>right to left</b>, and dots are added at the end. Then tap Check.</p></div><div id="tr"></div>` : ''}
      ${spells.length ? `<div class="card flat stack"><b>Spell words</b><p class="small muted">Tap the letters in order to build the word. Watch how they join by themselves.</p><button class="btn" id="sp-go">Spell ${Math.min(6, spells.length)} words</button></div><div id="spb" class="stack"></div>` : ''}
      <div class="card flat"><div class="row" id="wr-next"><button class="btn primary" id="wr-done">I practiced writing</button></div></div>`;
    if (targets.length) traceSeries(targets, box.querySelector('#tr'));
    const go = box.querySelector('#sp-go');
    if (go) go.onclick = () => { go.remove(); runSet({ box: box.querySelector('#spb'), items: sample(spells, 6), mode: 'practice-set', track: false, onFinish: (r) => { box.querySelector('#spb').innerHTML = `<div class="feedback info"><b class="v">${r.right} of ${r.counted} spelled right.</b></div>`; } }); };
    box.querySelector('#wr-done').onclick = () => { markStep(u, 'write'); box.querySelector('#wr-next').innerHTML = `<span class="chip good">Writing done</span>${nextButton(u, 'write')}`; };
  }
  function traceSeries(targets, mount) {
    let k = 0;
    const draw = () => {
      const t = targets[k];
      mount.innerHTML = `<div class="card stack" style="align-items:center">
        <div class="spread" style="width:100%"><span class="eyebrow">${k + 1} of ${targets.length}</span>${speakBtn(H.letter[t] ? syl(t) : t)}</div>
        <canvas class="trace" width="300" height="300" aria-label="Writing area"></canvas>
        <div class="row"><button class="btn small" id="tc-clear">Clear</button><button class="btn primary small" id="tc-check">Check</button><button class="btn small" id="tc-next" ${k === targets.length - 1 ? 'disabled' : ''}>Next</button></div>
        <div class="small" id="tc-res" aria-live="polite"></div></div>`;
      setupTrace(mount.querySelector('canvas'), t, mount.querySelector('#tc-res'), mount.querySelector('#tc-clear'), mount.querySelector('#tc-check'));
      mount.querySelector('#tc-next').onclick = () => { k++; draw(); };
    };
    draw();
  }
  function setupTrace(cv, text, res, clearB, checkB) {
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    const W = 300, Hh = 300;
    cv.width = W * dpr; cv.height = Hh * dpr; cv.style.width = '100%'; cv.style.maxWidth = W + 'px'; cv.style.aspectRatio = '1';
    const ctx = cv.getContext('2d'); ctx.scale(dpr, dpr);
    const size = text.length > 2 ? 110 : 190;
    const font = `${size}px "Noto Naskh Arabic", serif`;
    const css = getComputedStyle(document.documentElement);
    const guide = css.getPropertyValue('--line').trim() || '#ccc', ink = css.getPropertyValue('--nile').trim() || '#0e6e6a';
    const user = document.createElement('canvas'); user.width = W; user.height = Hh; const uctx = user.getContext('2d');
    const paintGuide = () => {
      ctx.clearRect(0, 0, W, Hh);
      ctx.font = font; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.direction = 'rtl';
      ctx.fillStyle = guide; ctx.fillText(text, W / 2, Hh / 2 + size * 0.08);
      ctx.drawImage(user, 0, 0, W, Hh);
    };
    const ready = document.fonts && document.fonts.load ? document.fonts.load(font, text) : Promise.resolve();
    ready.then(paintGuide, paintGuide);
    let drawing = false, last = null, strokes = 0;
    const pos = (e) => { const r = cv.getBoundingClientRect(); return [(e.clientX - r.left) * W / r.width, (e.clientY - r.top) * Hh / r.height]; };
    cv.style.touchAction = 'none';
    cv.onpointerdown = (e) => { drawing = true; last = pos(e); strokes++; cv.setPointerCapture(e.pointerId); dot(last); };
    cv.onpointermove = (e) => { if (!drawing) return; const p = pos(e); line(last, p); last = p; };
    cv.onpointerup = cv.onpointercancel = () => { drawing = false; };
    const line = (a, b) => { uctx.strokeStyle = ink; uctx.lineWidth = 16; uctx.lineCap = 'round'; uctx.lineJoin = 'round'; uctx.beginPath(); uctx.moveTo(a[0], a[1]); uctx.lineTo(b[0], b[1]); uctx.stroke(); paintGuide(); };
    const dot = (a) => { uctx.fillStyle = ink; uctx.beginPath(); uctx.arc(a[0], a[1], 8, 0, Math.PI * 2); uctx.fill(); paintGuide(); };
    clearB.onclick = () => { uctx.clearRect(0, 0, W, Hh); strokes = 0; res.textContent = ''; paintGuide(); };
    checkB.onclick = () => {
      if (!strokes) { res.textContent = 'Draw over the gray shape first.'; return; }
      const sc = traceScore(text, font, size, user, W, Hh);
      const ok = sc.coverage >= 0.55 && sc.precision >= 0.6;
      res.innerHTML = ok ? '<b style="color:var(--good)">Well written!</b> Try it once more without looking too closely.' : sc.coverage < 0.55 ? '<b style="color:var(--bad)">Almost.</b> Cover more of the letter, including the dots.' : '<b style="color:var(--bad)">Almost.</b> Stay closer to the gray shape.';
      if (ok) addXP(2);
    };
  }
  function traceScore(text, font, size, user, W, Hh) {
    const m = document.createElement('canvas'); m.width = W; m.height = Hh; const mc = m.getContext('2d');
    mc.font = font; mc.textAlign = 'center'; mc.textBaseline = 'middle'; mc.direction = 'rtl';
    mc.fillStyle = '#000'; mc.fillText(text, W / 2, Hh / 2 + size * 0.08);
    const d = document.createElement('canvas'); d.width = W; d.height = Hh; const dc = d.getContext('2d');
    dc.font = font; dc.textAlign = 'center'; dc.textBaseline = 'middle'; dc.direction = 'rtl';
    dc.lineWidth = 26; dc.lineJoin = 'round'; dc.strokeStyle = '#000'; dc.fillStyle = '#000';
    dc.fillText(text, W / 2, Hh / 2 + size * 0.08); dc.strokeText(text, W / 2, Hh / 2 + size * 0.08);
    const um = user.getContext('2d').getImageData(0, 0, W, Hh).data, mm = mc.getImageData(0, 0, W, Hh).data, dm = dc.getImageData(0, 0, W, Hh).data;
    let mask = 0, cov = 0, ink = 0, inside = 0;
    // a mask pixel counts as covered if user ink is within a small neighborhood
    const R = 6, inkAt = (x, y) => um[(y * W + x) * 4 + 3] > 40;
    for (let y = 0; y < Hh; y += 2) for (let x = 0; x < W; x += 2) {
      const i = (y * W + x) * 4;
      if (mm[i + 3] > 100) {
        mask++;
        let hit = false;
        for (let dy = -R; dy <= R && !hit; dy += 3) for (let dx = -R; dx <= R && !hit; dx += 3) { const xx = x + dx, yy = y + dy; if (xx >= 0 && yy >= 0 && xx < W && yy < Hh && inkAt(xx, yy)) hit = true; }
        if (hit) cov++;
      }
      if (um[i + 3] > 40) { ink++; if (dm[i + 3] > 40) inside++; }
    }
    return { coverage: mask ? cov / mask : 0, precision: ink ? inside / ink : 0 };
  }

  /* ================= Read aloud ================= */
  function renderSpeak(u, box) {
    const lines = (u.sentences || []).map(s => ({ ar: s.ar, tr: s.tr, en: s.en })).concat((u.words || []).map(w => ({ ar: u.plain ? w.plain : w.ar, tr: w.tr, en: w.en }))).slice(0, 8);
    let k = 0;
    box.innerHTML = `<div class="card flat stack"><b>Read it out loud</b><p class="small muted">Read the Arabic first, then tap <b>Check my reading</b> and say it. ${Speech.canHear ? '' : 'Checking works in Chrome on Android. Here, read aloud and tap Listen to compare.'}</p></div>
      <div id="sk"></div><div class="row" id="sk-nav"></div>
      <div class="card flat"><div class="row" id="sk-next"><button class="btn primary" id="sk-done">I read them all</button></div></div>`;
    const draw = () => {
      const L = lines[k];
      box.querySelector('#sk').innerHTML = `<div class="card stack">
        <div class="ar say-ar" lang="ar" dir="rtl">${esc(L.ar)}</div>
        <details class="small"><summary class="muted">Show meaning</summary>${tr(L.tr)} ${esc(L.en)}</details>
        <div class="heard" hidden></div>
        <div class="row">${Speech.canHear ? `<button class="btn primary" id="sk-mic">${I.mic} Check my reading</button>` : ''}<button class="btn" data-say="${esc(L.ar)}">${I.speak} Listen</button></div>
        <div class="small muted" id="sk-st" aria-live="polite"></div></div>`;
      box.querySelector('#sk-nav').innerHTML = `<button class="btn small" id="sk-prev" ${k === 0 ? 'disabled' : ''}>Previous</button><span class="small muted">${k + 1} of ${lines.length}</span><button class="btn small" id="sk-nx" ${k === lines.length - 1 ? 'disabled' : ''}>Next</button>`;
      box.querySelector('#sk-prev').onclick = () => { k--; draw(); };
      box.querySelector('#sk-nx').onclick = () => { k++; draw(); };
      const mic = box.querySelector('#sk-mic');
      if (mic) mic.onclick = async () => {
        const st = box.querySelector('#sk-st'), hd = box.querySelector('.heard');
        mic.disabled = true; st.textContent = 'Listening… read it now.';
        try {
          const r = Speech.best(L.ar, await Speech.listen());
          hd.hidden = false;
          hd.innerHTML = `<div class="ar heard-ar" lang="ar" dir="rtl">${r.words.map((w, i) => `<span class="${r.hit[i] ? 'ok' : 'miss'}">${esc(w)}</span>`).join(' ')}</div>`;
          st.textContent = r.heard ? (r.score >= 80 ? `Great reading! (${r.score}%)` : `Red words need another try. (${r.score}%)`) : 'I did not hear anything. Try again a bit louder.';
          if (r.heard) addXP(2);
        } catch (e) { st.textContent = e === 'not-allowed' ? 'Please allow the microphone, then try again.' : 'I could not hear you. Try again.'; }
        mic.disabled = false;
      };
    };
    draw();
    box.querySelector('#sk-done').onclick = () => { markStep(u, 'speak'); box.querySelector('#sk-next').innerHTML = `<span class="chip good">Reading done</span>${nextButton(u, 'speak')}`; };
  }

  /* ================= Questions ================= */
  function renderQuizIntro(u, box) {
    const s = U(u.id);
    const n = Math.min(10, u.qs.filter(q => q.t !== 'say').length);
    box.innerHTML = `<div class="card stack"><h2>Quiz</h2><p>${n} questions. Pass with ${PASS}% or more. You can take it again anytime.</p>${s.best !== null ? `<p>Your best: <b>${s.best}%</b></p>` : ''}
      <div class="row"><button class="btn primary" id="qs">Start quiz</button><a class="btn" href="#/unit/${u.id}/practice">Practice first</a></div></div>`;
    document.getElementById('qs').onclick = () => runSet({ box, items: sample(u.qs.filter(q => q.t !== 'say'), n), mode: 'quiz', onFinish: (r) => {
      s.tries++; if (s.best === null || r.pct > s.best) s.best = r.pct;
      if (r.pct >= PASS) { addXP(20); addCards(u); }
      save();
      results(box, r, { pass: PASS, again: () => viewUnit(u, 'quiz'), next: r.pct >= PASS ? nextButton(u, 'quiz') : '' });
    } });
  }
  function trackMiss(item, ok, mode) {
    if (!item.id || !ITEM[item.id]) return;
    const m = S.miss[item.id];
    if (!ok) S.miss[item.id] = { box: 0, due: addDays(today(), 1) };
    else if (m && mode === 'review') { m.box++; if (m.box >= 4) delete S.miss[item.id]; else m.due = addDays(today(), [1, 3, 7, 16][m.box]); }
    save();
  }
  function runSet({ box, items, mode, onFinish, track = true }) {
    let i = 0, right = 0, counted = 0; const wrongs = []; const order = items.slice(); const total = order.length;
    const endless = mode === 'practice';
    const show = () => {
      if (!endless && i >= total) return finish();
      if (endless && i >= order.length) order.push(...shuffle(items));
      const it = order[i];
      box.innerHTML = (endless ? `<div class="qhead"><span class="eyebrow">Practice · ${right} right</span><button class="btn small ghost" id="endp">Finish practice</button></div>`
        : `<div class="qhead"><span class="eyebrow">${i + 1} of ${total}</span><span class="chip plain">${right} right</span></div><div class="bar"><i style="width:${i / total * 100}%"></i></div>`) + '<div id="qb" class="stack"></div>';
      const ep = document.getElementById('endp'); if (ep) ep.onclick = finish;
      renderQ(it, box.querySelector('#qb'), (ok) => {
        if (ok === null) return;
        counted++; if (ok) { right++; addXP(2); } else { wrongs.push(it); if (endless) order.splice(Math.min(order.length, i + 3), 0, it); }
        if (track) trackMiss(it, ok, mode);
      }, () => { i++; show(); });
    };
    const finish = () => onFinish({ pct: counted ? Math.round(right / counted * 100) : 0, right, counted, wrongs });
    show();
  }
  function optHTML(o) { return isAr(o) ? `<span class="ar opt-ar" lang="ar" dir="rtl">${esc(o)}</span>` : esc(o); }
  function renderQ(it, box, onResult, onNext) {
    let answered = false;
    const big = it.big ? `<div class="ar q-big" lang="ar" dir="rtl">${esc(it.big)}</div>` : '';
    const fb = (ok, extra) => {
      if (answered) return; answered = true; onResult(ok);
      const d = document.createElement('div');
      d.className = 'feedback ' + (ok === null ? 'info' : ok ? 'right' : 'wrong');
      d.innerHTML = `${ok === null ? '' : `<b class="v">${ok ? pick(['Correct!', 'Yes!', 'Well done!']) : 'Not quite.'}</b>`}${extra || ''}${it.why ? `<div>${mixed(it.why)}</div>` : ''}${it.tr && S.settings.translit ? `<div class="small muted">Sounds like: ${esc(it.tr)}</div>` : ''}<div><button class="btn primary" id="nq">Next</button></div>`;
      box.appendChild(d); const nb = d.querySelector('#nq'); nb.onclick = onNext; nb.focus({ preventScroll: true });
    };
    if (it.t === 'mc' || it.t === 'listen') {
      const idx = shuffle(it.o.map((_, k) => k));
      box.innerHTML = (it.t === 'listen' ? `<div class="stack" style="align-items:center"><button class="play-big" data-say="${esc(it.say)}" aria-label="Play">${I.speak}</button><span class="small muted">Tap to listen again</span></div>` : '')
        + big + `<div class="qprompt">${mixed(it.q || '')}</div><div class="opts">${idx.map(k => `<button class="opt" data-k="${k}">${optHTML(it.o[k])}</button>`).join('')}</div>`;
      if (it.t === 'listen') setTimeout(() => say(it.say), 250);
      box.querySelectorAll('.opt').forEach(b => b.onclick = () => {
        if (answered) return; const ok = +b.dataset.k === it.a;
        box.querySelectorAll('.opt').forEach(x => { x.disabled = true; if (+x.dataset.k === it.a) x.classList.add('right'); });
        if (!ok) b.classList.add('wrong'); fb(ok);
      });
    } else if (it.t === 'spell' || it.t === 'order') {
      const isSpell = it.t === 'spell';
      const parts = isSpell ? letterList(it.a) : it.a.split(/\s+/);
      let pool = shuffle(parts.map((w, k) => ({ w, k })));
      if (isSpell) {
        const extra = others(parts[0], H.letters.map(x => x.c).filter(c => !parts.includes(c)), Math.min(3, Math.max(2, 7 - parts.length)));
        pool = shuffle(pool.concat(extra.map((w, k) => ({ w, k: 100 + k, extra: true }))));
      }
      let chosen = [];
      box.innerHTML = `<div class="qprompt">${isSpell ? `Spell the word for <b>${esc(it.hint)}</b>` : `Put the words in order: <b>${esc(it.hint)}</b>`}</div>
        ${isSpell ? `<div class="row" style="justify-content:center"><button class="btn small" data-say="${esc(it.a)}">${I.speak} Hear the word</button></div>` : ''}
        <div class="built ar" lang="ar" dir="rtl" id="bt">&nbsp;</div>
        <div class="tiles ar" dir="rtl" id="tp"></div>
        <div class="row"><button class="btn primary" id="sc">Check</button><button class="btn ghost" id="sb">Undo</button></div>`;
      const bt = box.querySelector('#bt'), tp = box.querySelector('#tp');
      const draw = () => {
        bt.textContent = chosen.map(x => x.w).join(isSpell ? '' : ' ') || ' ';
        tp.innerHTML = pool.map((x, k) => `<button class="tile" data-p="${k}">${esc(x.w)}</button>`).join('');
        tp.querySelectorAll('.tile').forEach(t => t.onclick = () => { if (answered) return; chosen.push(pool.splice(+t.dataset.p, 1)[0]); draw(); });
      };
      draw();
      box.querySelector('#sb').onclick = () => { if (answered || !chosen.length) return; pool.push(chosen.pop()); draw(); };
      box.querySelector('#sc').onclick = () => {
        if (answered || !chosen.length) return;
        const got = chosen.map(x => x.w).join(isSpell ? '' : ' ');
        const ok = strip(got) === strip(it.a);
        fb(ok, ok ? '' : `<div>Answer: <span class="ar opt-ar" lang="ar">${esc(it.a)}</span></div>`);
      };
    }
  }
  function results(box, r, { pass, again, next }) {
    const ok = r.pct >= pass;
    box.innerHTML = `<div class="card stack" style="text-align:center;align-items:center"><div class="score-ring" style="color:${ok ? 'var(--good)' : 'var(--bad)'}">${r.pct}%</div><p>${r.right} of ${r.counted} correct</p>
      <h2>${ok ? 'You passed! Very good.' : r.pct >= pass - 15 ? 'Almost there. Practice a little more and try again.' : 'Read the lesson again, practice, then try the quiz.'}</h2>
      <div class="row" style="justify-content:center">${next || ''}<button class="btn" id="ag">Try again</button></div></div>
      ${r.wrongs.length ? `<div class="stack"><h3>Review your mistakes</h3>${r.wrongs.map(w => `<div class="card flat stack" style="gap:6px">${w.big ? `<div class="ar opt-ar" lang="ar">${esc(w.big)}</div>` : ''}<div>${mixed(w.q || (w.t === 'spell' ? 'Spell: ' + (w.hint || '') : w.hint || ''))}</div><div>Answer: ${optHTML(w.o ? w.o[w.a] : w.a)}</div></div>`).join('')}</div>` : ''}`;
    document.getElementById('ag').onclick = again;
  }
  function viewTest(L) {
    const t = S.units['T:' + L.id] = S.units['T:' + L.id] || { best: 0, passed: false };
    app.innerHTML = `<a class="back" href="#/">${I.back} Your path</a><h1>Level ${L.n} test</h1><div id="tb" class="stack"></div>`;
    const box = document.getElementById('tb');
    box.innerHTML = `<div class="card stack"><p>20 questions from every lesson in ${esc(L.title)}. Pass with ${PASS}%.</p>${t.best ? `<p>Your best: <b>${t.best}%</b></p>` : ''}<button class="btn primary" id="ts">Start test</button></div>`;
    document.getElementById('ts').onclick = () => {
      const per = Math.ceil(20 / L.units.length);
      const items = sample([].concat(...L.units.map(u => sample(u.qs.filter(q => q.t !== 'say'), per))), 20);
      runSet({ box, items, mode: 'test', onFinish: (r) => {
        t.best = Math.max(t.best, r.pct); if (r.pct >= PASS && !t.passed) { t.passed = true; addXP(50); }
        save();
        const nl = LEVELS[LEVELS.indexOf(L) + 1];
        results(box, r, { pass: PASS, again: () => viewTest(L), next: r.pct >= PASS && nl ? `<a class="btn primary" href="#/unit/${nl.units[0].id}/lesson">Start Level ${nl.n}</a>` : '' });
      } });
    };
  }

  /* ================= Alphabet chart ================= */
  function viewAlphabet() {
    app.innerHTML = `<a class="back" href="#/me">${I.back} Me</a><h1>The alphabet</h1><p class="muted">Tap a letter to hear it. Read right to left, starting at the top right.</p>
      <div class="abc" dir="rtl">${H.letters.map(d => `<button class="abc-l" data-say="${esc(syl(d.c))}"><span class="ar" lang="ar">${esc(d.c)}</span><small>${esc(d.en)}</small></button>`).join('')}</div>`;
  }

  /* ================= Notes ================= */
  const noteList = () => Array.isArray(S.notes) ? S.notes : (S.notes = []);
  function viewNotes() {
    S.notes = noteList().filter(n => (n.title || '').trim() || (n.body || '').trim()); save();
    app.innerHTML = `${brand()}<div class="spread"><h1>My notes</h1><a class="btn primary" href="#/note/new">+ New note</a></div>
      <input class="input" id="nq" placeholder="Search my notes" autocomplete="off"><div id="nl" class="stack"></div>`;
    const draw = () => {
      const q = document.getElementById('nq').value.toLowerCase();
      const ns = noteList().filter(n => !q || (n.title + ' ' + n.body).toLowerCase().includes(q)).sort((a, b) => b.updated - a.updated);
      document.getElementById('nl').innerHTML = ns.length ? `<div class="units">${ns.map(n => `<a class="unit-link" href="#/note/${n.id}"><span class="t"><b>${mixed(n.title || 'Untitled note')}</b><span>${esc(new Date(n.updated).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }))}${n.unit && UNIT[n.unit] ? ' · ' + esc(UNIT[n.unit].title) : ''}</span></span></a>`).join('')}</div>`
        : `<div class="card flat"><p class="muted">${noteList().length ? 'No notes match.' : 'No notes yet. Write down letters that look alike, words you want to remember, or anything else.'}</p></div>`;
    };
    draw(); document.getElementById('nq').oninput = draw;
  }
  function viewNote(id) {
    let n;
    if (id === 'new') {
      const from = S.noteFrom && UNIT[S.noteFrom]; delete S.noteFrom;
      n = { id: 'n' + Date.now().toString(36), title: from ? from.title : '', body: '', created: Date.now(), updated: Date.now(), unit: from ? from.id : '' };
      noteList().unshift(n); save(); history.replaceState(null, '', '#/note/' + n.id);
    } else { n = noteList().find(x => x.id === id); if (!n) { location.hash = '#/notes'; return; } }
    app.innerHTML = `<a class="back" href="#/notes">${I.back} My notes</a>
      <input class="input note-title" id="tt" placeholder="Name this note" value="${esc(n.title)}">
      <span class="small muted">Written ${esc(new Date(n.created).toLocaleDateString())}</span>
      <textarea class="input" id="tb" dir="auto" placeholder="Write here (English or Arabic). It saves by itself." style="min-height:260px">${esc(n.body)}</textarea>
      <div class="row"><a class="btn primary" id="nd" href="#/notes">Done</a><button class="btn ghost" id="ndel" style="color:var(--bad)">Delete</button></div>`;
    const tt = document.getElementById('tt'), tb = document.getElementById('tb'); let tm;
    const later = () => { clearTimeout(tm); tm = setTimeout(() => { n.title = tt.value.trim(); n.body = tb.value; n.updated = Date.now(); save(); }, 400); };
    tt.oninput = later; tb.oninput = later;
    onLeave(() => { clearTimeout(tm); if (tt.isConnected) { n.title = tt.value.trim(); n.body = tb.value; } save(); });
    const del = document.getElementById('ndel');
    del.onclick = () => { if (del.dataset.sure) { S.notes = noteList().filter(x => x !== n); save(); location.hash = '#/notes'; return; } del.dataset.sure = 1; del.textContent = 'Tap again to delete'; };
    if (!n.title && !n.body) setTimeout(() => tt.focus(), 50);
  }

  /* ================= Me ================= */
  function viewMe() {
    const lettersKnown = Object.keys(S.cards).filter(k => k.startsWith('L:')).length;
    const wordsKnown = Object.keys(S.cards).filter(k => !k.startsWith('L:')).length;
    const voices = Speech.voices();
    app.innerHTML = `${brand()}
      <div class="spread"><h1>${esc(S.name)}</h1><a class="btn small" href="#/who">${P.list.length > 1 ? 'Switch person' : 'Add a person'}</a></div>
      <div class="stats"><div class="stat"><b>${lettersKnown}/28</b><span>Letters learned</span></div><div class="stat"><b>${wordsKnown}</b><span>Words and sentences</span></div><div class="stat"><b>${streakNow()}</b><span>Day streak</span></div></div>
      <a class="card flat spread" href="#/alphabet" style="text-decoration:none;color:inherit"><div><b>Alphabet chart</b><div class="small muted">All 28 letters with sounds</div></div><span class="chip">Open</span></a>
      <h2 style="margin-top:8px">Settings</h2>
      <details class="card flat more"><summary><b>Settings</b> <span class="small muted">text size, voice, transliteration</span></summary>
        <div class="stack" style="margin-top:12px">
        <div class="switch"><span>Show English sounds (transliteration)</span><input type="checkbox" id="s-tr" ${S.settings.translit ? 'checked' : ''} style="width:24px;height:24px;accent-color:var(--nile)"></div>
        <div class="switch"><span>Text size</span><select class="input" id="s-size" style="width:auto">${[['m', 'Normal'], ['l', 'Large'], ['xl', 'Extra large']].map(([v, l]) => `<option value="${v}" ${S.settings.size === v ? 'selected' : ''}>${l}</option>`).join('')}</select></div>
        <div class="switch"><span>Theme</span><select class="input" id="s-th" style="width:auto">${[['', 'Match phone'], ['light', 'Light'], ['dark', 'Dark']].map(([v, l]) => `<option value="${v}" ${S.settings.theme === v ? 'selected' : ''}>${l}</option>`).join('')}</select></div>
        <label class="field" for="s-rate">Voice speed: <span id="rv">${S.settings.rate}</span><input type="range" id="s-rate" min="0.5" max="1.1" step="0.05" value="${S.settings.rate}"></label>
        ${voices.length ? `<label class="field" for="s-voice">Arabic voice<select class="input" id="s-voice"><option value="">Automatic</option>${voices.map(v => `<option ${S.settings.voice === v.name ? 'selected' : ''}>${esc(v.name)}</option>`).join('')}</select></label>`
          : '<p class="small"><b>No Arabic voice found.</b> On Android: Settings → Accessibility (or System) → Text-to-speech → Google → Install voice data → Arabic. On iPhone: Settings → Accessibility → Spoken Content → Voices → Arabic.</p>'}
        <button class="btn small" data-say="أهلاً، أنا بتعلم القراية والكتابة.">${I.speak} Test the voice</button>
        <label class="field" for="s-name">Name<input class="input" id="s-name" value="${esc(S.name)}"></label>
        </div></details>
      <details class="card flat more"><summary><b>Backup</b> <span class="small muted">move progress to a new phone</span></summary>
        <div class="stack" style="margin-top:12px"><div class="row"><button class="btn small" id="bk-c">Copy backup code</button><button class="btn small ghost" id="bk-r">Restore from code</button></div><div id="bk-a"></div>
        <button class="btn small ghost" id="rs" style="color:var(--bad)">Erase my progress</button></div></details>`;
    const set = (k, v) => { S.settings[k] = v; save(); applySettings(); };
    document.getElementById('s-tr').onchange = (e) => set('translit', e.target.checked);
    document.getElementById('s-size').onchange = (e) => set('size', e.target.value);
    document.getElementById('s-th').onchange = (e) => set('theme', e.target.value);
    document.getElementById('s-rate').oninput = (e) => { set('rate', +e.target.value); document.getElementById('rv').textContent = e.target.value; };
    const sv = document.getElementById('s-voice'); if (sv) sv.onchange = (e) => set('voice', e.target.value);
    document.getElementById('s-name').onchange = (e) => {
      const nn = e.target.value.trim(); if (!nn || nn === S.name) return;
      if (P.list.some(x => x.k === keyOf(nn))) { toast('Someone named ' + nn + ' already has progress here.'); e.target.value = S.name; return; }
      try { localStorage.removeItem('harf.p.' + keyOf(S.name)); } catch (er) {}
      P.list = P.list.filter(x => x.k !== keyOf(S.name)); S.name = nn; save(); toast('Name changed.');
    };
    document.getElementById('bk-c').onclick = async () => {
      const code = 'HARF1:' + btoa(unescape(encodeURIComponent(JSON.stringify(S))));
      try { await navigator.clipboard.writeText(code); toast('Backup code copied. Send it to yourself.'); } catch (e) { document.getElementById('bk-a').innerHTML = `<textarea class="input" readonly style="min-height:80px">${esc(code)}</textarea>`; }
    };
    document.getElementById('bk-r').onclick = () => {
      const a = document.getElementById('bk-a');
      a.innerHTML = '<textarea class="input" id="bk-in" style="min-height:80px" placeholder="Paste the backup code"></textarea><button class="btn small primary" id="bk-go">Restore</button>';
      document.getElementById('bk-go').onclick = () => { try { const o = JSON.parse(decodeURIComponent(escape(atob(document.getElementById('bk-in').value.trim().replace(/^HARF1:/, ''))))); S = Object.assign(fresh(), o); S.settings = Object.assign(fresh().settings, o.settings || {}); save(); applySettings(); toast('Progress restored.'); location.hash = '#/'; } catch (e) { toast('That code did not work.'); } };
    };
    const rs = document.getElementById('rs');
    rs.onclick = () => {
      if (!rs.dataset.sure) { rs.dataset.sure = 1; rs.textContent = 'Tap again to erase everything'; return; }
      const k = keyOf(S.name); try { localStorage.removeItem(KEY); localStorage.removeItem('harf.p.' + k); } catch (e) {}
      P.list = P.list.filter(x => x.k !== k); P.current = ''; savePeople(); S = fresh(); location.hash = P.list.length ? '#/who' : '#/'; route();
    };
  }

  /* ================= Boot ================= */
  applySettings();
  route();
  if ('serviceWorker' in navigator && location.protocol.startsWith('http')) {
    const had = !!navigator.serviceWorker.controller;
    window.addEventListener('load', () => navigator.serviceWorker.register('sw.js').catch(() => {}));
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      if (!had || document.getElementById('upd')) return;
      const b = document.createElement('button'); b.id = 'upd'; b.className = 'update-bar'; b.innerHTML = '<b>A new version of Harf is ready.</b> Tap to refresh.'; b.onclick = () => location.reload(); document.body.appendChild(b);
    });
  }
})();
