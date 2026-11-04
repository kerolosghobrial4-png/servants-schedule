/* Sekka English — app engine. Content lives in content/*.js as window.SEKKA_LEVELS. */
(function () {
  'use strict';

  /* ================= Content index ================= */
  const LEVELS = (window.SEKKA_LEVELS || []).slice().sort((a, b) => a.n - b.n);
  const UNIT = {};
  const LEVEL = {};
  LEVELS.forEach(L => {
    LEVEL[L.id] = L;
    L.units.forEach((u, ui) => {
      u.level = L; u.index = ui;
      UNIT[u.id] = u;
      (u.items || []).forEach((it, k) => {
        it.id = u.id + '-' + k;
        it.unit = u;
        if (it.p !== undefined && u.passages) it.passage = u.passages[it.p];
        if (it.t === 'tf') { it.t = 'mc'; it.o = ['True', 'False']; it.a = it.a ? 0 : 1; }
      });
    });
  });
  const ITEM = {};
  const UNIT_ORDER = [];
  LEVELS.forEach(L => {
    L.units.forEach(u => { UNIT_ORDER.push(u); (u.items || []).forEach(it => { ITEM[it.id] = it; }); });
    (L.test || []).forEach((x, k) => {
      x.id = L.id + 'T' + k;
      if (x.t === 'tf') { x.t = 'mc'; x.o = ['True', 'False']; x.a = x.a ? 0 : 1; }
      ITEM[x.id] = x;
    });
  });
  const STORIES = window.SEKKA_STORIES || [];
  const STORY = {};
  STORIES.forEach(st => { STORY[st.id] = st; st.qs.forEach((q, k) => { q.id = st.id + '-q' + k; if (q.t === 'tf') { q.t = 'mc'; q.o = ['True', 'False']; q.a = q.a ? 0 : 1; } }); });
  const PASS_UNIT = 80, PASS_TEST = 80;
  const MISS_GAPS = [1, 3, 7, 16];
  const ALL_WORDS = {};
  LEVELS.forEach(L => L.units.forEach(u => (u.words || []).forEach(w => { ALL_WORDS[w.w] = Object.assign({ unit: u.id, level: L.id }, w); })));

  /* ================= State ================= */
  const KEY = 'sekka.v1';
  const today = () => { const d = new Date(); return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); };
  const addDays = (iso, n) => { const d = new Date(iso + 'T12:00:00'); d.setDate(d.getDate() + n); return d.toISOString().slice(0, 10); };
  const fresh = () => ({
    name: '', created: today(), xp: 0, days: {}, streak: { count: 0, last: '' },
    units: {}, tests: {}, placement: null, cards: {}, writing: {}, drafts: {},
    miss: {}, session: {}, fluency: {}, read: {}, storyDay: {}, myWords: {},
    settings: { size: 'l', arabic: true, rate: 0.85, voice: '', theme: '', goal: 30, job: '' }
  });
  let S;
  try { S = Object.assign(fresh(), JSON.parse(localStorage.getItem(KEY) || '{}')); } catch (e) { S = fresh(); }
  S.settings = Object.assign(fresh().settings, S.settings || {});
  const save = () => { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) {} };

  function addXP(n) {
    const d = today();
    S.xp += n;
    S.days[d] = (S.days[d] || 0) + n;
    if (S.streak.last !== d) {
      S.streak.count = S.streak.last === addDays(d, -1) ? S.streak.count + 1 : 1;
      S.streak.last = d;
    }
    save();
  }
  const U = (id) => (S.units[id] = S.units[id] || { lesson: false, best: null, tries: 0, practiced: 0 });
  const unitDone = (id) => { const s = S.units[id]; return !!(s && s.best !== null && s.best >= PASS_UNIT); };
  const levelProgress = (L) => {
    const n = L.units.length + 1;
    let d = L.units.filter(u => unitDone(u.id)).length;
    if (S.tests[L.id] && S.tests[L.id].passed) d++;
    return d / n;
  };
  const streakNow = () => (S.streak.last === today() || S.streak.last === addDays(today(), -1)) ? S.streak.count : 0;

  /* ================= Helpers ================= */
  const app = document.getElementById('app');
  const esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const md = (s) => esc(s)
    .replace(/_{3,}/g, '<span class="blank" aria-label="blank"></span>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/\n/g, '<br>');
  const shuffle = (a) => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const sample = (a, n) => shuffle(a).slice(0, n);
  const normAns = (s) => String(s).toLowerCase().replace(/[’‘]/g, "'").replace(/[.!?,;:"]/g, '').replace(/\s+/g, ' ').trim();
  let toastT;
  function toast(msg) {
    const t = document.getElementById('toast');
    t.textContent = msg; t.hidden = false;
    clearTimeout(toastT); toastT = setTimeout(() => { t.hidden = true; }, 2600);
  }
  async function copy(text, msg) {
    msg = msg || 'Copied. Paste it into Claude.';
    try { await navigator.clipboard.writeText(text); toast(msg); return true; }
    catch (e) {
      const ta = document.createElement('textarea'); ta.value = text; document.body.appendChild(ta); ta.select();
      let ok = false; try { ok = document.execCommand('copy'); } catch (e2) {}
      ta.remove(); toast(ok ? msg : 'Select the text and copy it.'); return ok;
    }
  }
  const say = (text) => { if (!Speech.say(text, { rate: S.settings.rate, voice: S.settings.voice })) toast('This browser cannot read aloud.'); };

  const I = {
    speak: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9v6h4l5 4V5L8 9H4z" fill="currentColor"/><path d="M16 8.5a5 5 0 0 1 0 7M18.5 6a8.5 8.5 0 0 1 0 12" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
    slow: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9v6h4l5 4V5L8 9H4z" fill="currentColor"/><path d="M16 10.5a2.5 2.5 0 0 1 0 3" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
    mic: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="9" y="3" width="6" height="11" rx="3" fill="currentColor"/><path d="M5 11a7 7 0 0 0 14 0M12 18v3" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
    rec: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="7" fill="currentColor"/></svg>',
    stop: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="6" y="6" width="12" height="12" rx="2" fill="currentColor"/></svg>',
    copy: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="8" y="8" width="12" height="12" rx="2" fill="none" stroke="currentColor" stroke-width="2"/><path d="M4 16V6a2 2 0 0 1 2-2h10" fill="none" stroke="currentColor" stroke-width="2"/></svg>',
    back: '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d="M15 5l-7 7 7 7" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    grammar: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 6h16M4 12h10M4 18h13" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/></svg>',
    vocab: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 4h10a4 4 0 0 1 4 4v12H9a4 4 0 0 1-4-4V4z" fill="none" stroke="currentColor" stroke-width="2"/><path d="M9 9h6M9 13h4" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
    reading: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 5c3-1 6-1 9 1 3-2 6-2 9-1v14c-3-1-6-1-9 1-3-2-6-2-9-1V5z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><path d="M12 6v14" stroke="currentColor" stroke-width="2"/></svg>',
    speaking: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 5h16v10H9l-5 4V5z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><path d="M8 9h8M8 12h5" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
    conversation: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 5h12v8H8l-4 3V5z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><path d="M15 9h6v8l-3-2h-6v-2" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/></svg>',
    strategy: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="8" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="12" cy="12" r="3" fill="currentColor"/></svg>',
    test: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 3h9l4 4v14H6V3z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><path d="M9 13l2 2 4-4" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>'
  };
  const kindIcon = (k) => I[k] || I.grammar;
  const kindName = { conversation: 'Talk at Work', grammar: 'Grammar', vocab: 'Vocabulary', reading: 'Reading', speaking: 'Speaking & Writing', strategy: 'Strategy' };
  const speakBtn = (text, label) => `<button class="icon-btn" data-say="${esc(text)}" aria-label="${esc(label || 'Listen')}">${I.speak}</button>`;

  document.addEventListener('click', (e) => {
    const b = e.target.closest('[data-say]');
    if (b) { e.preventDefault(); say(b.getAttribute('data-say')); }
  });

  function applySettings() {
    const r = document.documentElement;
    r.setAttribute('data-size', S.settings.size);
    if (S.settings.theme) r.setAttribute('data-theme', S.settings.theme); else r.removeAttribute('data-theme');
  }

  /* ================= Router ================= */
  let cleanups = [];
  const onLeave = (fn) => cleanups.push(fn);
  function route() {
    cleanups.forEach(f => { try { f(); } catch (e) {} }); cleanups = [];
    if (window.speechSynthesis) speechSynthesis.cancel();
    const parts = (location.hash.replace(/^#\/?/, '') || '').split('/').filter(Boolean);
    const [a, b, c] = parts;
    let tab = 'home';
    if (!S.name && a !== 'me') { viewWelcome(); setTab('home'); return; }
    if (!a) viewHome();
    else if (a === 'level' && LEVEL[b]) viewLevel(LEVEL[b]);
    else if (a === 'unit' && UNIT[b]) viewUnit(UNIT[b], c || 'lesson');
    else if (a === 'test' && LEVEL[b]) viewTest(LEVEL[b]);
    else if (a === 'placement') viewPlacement();
    else if (a === 'placement-intro') viewPlacementIntro();
    else if (a === 'today') viewToday(b);
    else if (a === 'stories') viewStories();
    else if (a === 'phrases') { tab = 'voice'; viewPhrases(); }
    else if (a === 'numbers') { tab = 'voice'; viewNumbers(); }
    else if (a === 'progress') { tab = 'me'; viewProgress(); }
    else if (a === 'writing') { tab = 'me'; viewWriting(); }
    else if (a === 'grammar') viewGrammar();
    else if (a === 'story' && STORY[b]) viewStory(STORY[b]);
    else if (a === 'method') { tab = 'me'; viewMethod(); }
    else if (a === 'words') { tab = 'words'; viewWords(b); }
    else if (a === 'voice') { tab = 'voice'; viewVoice(); }
    else if (a === 'me') { tab = 'me'; viewMe(); }
    else if (a === 'cert' && LEVEL[b]) { tab = 'me'; viewCert(LEVEL[b]); }
    else viewHome();
    setTab(tab);
    window.scrollTo(0, 0);
  }
  function setTab(t) { document.querySelectorAll('.tabs a').forEach(x => x.classList.toggle('on', x.dataset.tab === t)); }
  window.addEventListener('hashchange', route);

  /* ================= Welcome ================= */
  function viewWelcome() {
    app.innerHTML = `
      ${brand()}
      <div class="hero">
        <span class="eyebrow">Welcome · أهلاً بيكي</span>
        <h1>Your English road, one step at a time.</h1>
        <p>Six levels, from everyday English to confident conversations at work and college-level reading and writing. Every lesson has help in Egyptian Arabic.</p>
        <p class="ar" lang="ar">ست مستويات، من إنجليزي كل يوم لحد إنك تتكلمي بثقة في الشغل وتقري وتكتبي بمستوى الجامعة. كل درس فيه شرح بالعربي.</p>
      </div>
      <div class="card stack">
        <label class="field" for="nm">What should we call you?<span class="ar small muted" lang="ar">نناديكي إيه؟</span>
          <input id="nm" class="input" autocomplete="given-name" placeholder="Mama">
        </label>
        <label class="field" for="jb">What is your job? (optional)<span class="ar small muted" lang="ar">شغلك إيه؟ عشان التدريب على المحادثة يبقى عن شغلك</span>
          <input id="jb" class="input" placeholder="For example: cashier, medical assistant, office assistant">
        </label>
        <button class="btn primary block" id="go">Start</button>
      </div>`;
    const go = () => { S.name = document.getElementById('nm').value.trim() || 'Mama'; S.settings.job = document.getElementById('jb').value.trim(); save(); location.hash = '#/placement-intro'; };
    document.getElementById('go').onclick = go;
    document.getElementById('nm').onkeydown = (e) => { if (e.key === 'Enter') go(); };
  }
  function viewPlacementIntro() {
    app.innerHTML = `
      ${brand()}
      <div class="card stack">
        <span class="eyebrow">Step 1</span>
        <h2>Let's find your starting level</h2>
        <p>Take a short check of 18 questions. It starts easy and gets harder. Don't worry if you don't know some answers. That is the point.</p>
        <p class="ar" lang="ar">امتحان صغير ١٨ سؤال عشان نعرف تبدئي منين. بيبدأ سهل وبيصعب. عادي جداً لو في أسئلة مش عارفاها.</p>
        <div class="row"><a class="btn primary" href="#/placement">Start the check</a><a class="btn ghost" href="#/">Skip, start at Level 1</a></div>
      </div>`;
  }
  function brand() {
    return `<div class="spread"><div class="brand">
      <svg viewBox="0 0 48 48" aria-hidden="true"><rect width="48" height="48" rx="12" fill="var(--nile)"/><path d="M10 36c6-2 8-9 14-11s9-8 14-13" fill="none" stroke="var(--nile-ink)" stroke-width="4" stroke-linecap="round"/><circle cx="10" cy="36" r="3.5" fill="var(--sun)"/><circle cx="38" cy="12" r="3.5" fill="var(--nile-ink)"/></svg>
      <div><b>Sekka</b> <span class="ar" lang="ar">سكة</span></div></div>
      ${S.name ? `<span class="chip gold" title="Days in a row">${streakNow() ? streakNow() + (streakNow() === 1 ? ' day streak' : ' day streak') : 'Start a streak today'}</span>` : ''}</div>`;
  }

  /* ================= Home ================= */
  function nextStep() {
    const start = S.placement ? S.placement.level : 1;
    for (const L of LEVELS) {
      if (L.n < start) continue;
      for (const u of L.units) if (!unitDone(u.id)) return { href: `#/unit/${u.id}/${U(u.id).lesson ? 'quiz' : 'lesson'}`, title: u.title, sub: `Level ${L.n} · ${kindName[u.kind]}`, u };
      if (!(S.tests[L.id] && S.tests[L.id].passed)) return { href: `#/test/${L.id}`, title: `Level ${L.n} Test`, sub: L.title };
    }
    return null;
  }
  function viewHome() {
    const d = today();
    const xpToday = S.days[d] || 0;
    const goal = S.settings.goal;
    const next = nextStep();
    const due = dueCards().length;
    const hour = new Date().getHours();
    const greet = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';
    const greetAr = hour < 12 ? 'صباح الخير' : 'مساء الخير';
    app.innerHTML = `
      ${brand()}
      ${S.toured ? '' : tourCard()}
      <div class="hero">
        <span class="eyebrow">${greet}, ${esc(S.name)} · <span lang="ar">${greetAr}</span></span>
        <h2>Today's session</h2>
        <p>${stepsDone()} of 4 steps done · about 20 minutes</p>
        <div class="row"><a class="btn" href="#/today">${stepsDone() ? 'Continue today\'s session' : 'Start today\'s session'}</a></div>
        ${next ? `<p class="small">Next lesson: ${esc(next.title)} · ${esc(next.sub)}</p>` : '<p class="small">You finished every level. Keep reviewing to keep it strong.</p>'}
        <div class="stack" style="gap:6px"><div class="spread small"><span>Today's goal</span><span>${Math.min(xpToday, goal)} / ${goal} points</span></div>
        <div class="bar"><i style="width:${Math.min(100, xpToday / goal * 100)}%"></i></div></div>
      </div>
      <div class="stats">
        <div class="stat"><b>${S.xp}</b><span>Points</span></div>
        <a class="stat" href="#/words" style="text-decoration:none;color:inherit"><b>${due}</b><span>Words to review</span></a>
        <div class="stat"><b>${Object.keys(S.units).filter(unitDone).length}</b><span>Units passed</span></div>
      </div>
      ${arabicNudge()}
      ${storyCard()}
      ${!S.placement ? `<a class="card flat spread" href="#/placement" style="text-decoration:none;color:inherit"><div><b>Find my level</b><div class="small muted">18 questions · about 10 minutes</div></div><span class="chip">Start</span></a>` : ''}
      <div class="stack">
        <div class="spread"><h2>Your path</h2><span class="small"><a href="#/stories">Story library</a> · <a href="#/grammar">Grammar guide</a></span></div>
        <div>${LEVELS.map(levelBlock).join('')}</div>
      </div>`;
  }
  function arabicNudge() {
    if (!S.settings.arabic || S.arNudged) return '';
    const n = curLevelN();
    if (n < 4) return '';
    return `<div class="card flat stack" id="arn"><b>You are ready to think in English</b>
      <p class="small">At Level ${n}, try turning off the Arabic notes. It feels harder at first, but your brain starts thinking in English faster. You can turn them back on any time in Me → Settings.</p>
      <p class="ar small muted" lang="ar">انتي في المستوى ${n}. جرّبي تقفلي الشرح العربي عشان مخك يتعود يفكر بالإنجليزي. تقدري ترجّعيه في أي وقت.</p>
      <div class="row"><button class="btn small primary" id="arn-off">Turn off Arabic notes</button><button class="btn small ghost" id="arn-keep">Keep them for now</button></div></div>`;
  }
  document.addEventListener('click', (e) => {
    if (e.target.id === 'arn-off') { S.settings.arabic = false; S.arNudged = true; save(); toast('Arabic notes are off. You can do it!'); route(); }
    if (e.target.id === 'arn-keep') { S.arNudged = true; save(); const c = document.getElementById('arn'); if (c) c.remove(); }
  });
  function tourCard() {
    const tips = [
      ['1', 'Every day: Today\'s session', 'Four short steps, about 20 minutes. Do it every day, even on busy days.', 'كل يوم: جلسة النهارده. ٤ خطوات صغيرة، حوالي ٢٠ دقيقة. اعمليها كل يوم حتى لو مشغولة.'],
      ['2', 'Listen to everything', 'Tap the speaker buttons, and tap any word in a story to hear it and see its meaning.', 'دوسي على زرار الصوت، ودوسي على أي كلمة في القصة عشان تسمعيها وتعرفي معناها.'],
      ['3', 'Talk, don\'t just read', 'Each level has "Talk at Work". Practice your part, then talk with Claude voice like a real coworker.', 'كل مستوى فيه «Talk at Work». اتدربي على دورك، وبعدين اتكلمي مع Claude بالصوت كإنه زميلك في الشغل.'],
      ['4', 'Mistakes are part of it', 'Wrong answers come back later so you can learn them. Your son can grade your recordings on the Voice tab.', 'الغلط جزء من التعلم. الأسئلة اللي بتغلطي فيها بترجعلك تاني. وابنك يقدر يقيّم تسجيلاتك من «Voice».']
    ];
    return `<div class="card stack" id="tour">
      <div class="spread"><span class="eyebrow">How to use Sekka</span><button class="btn small ghost" id="tour-x">Got it</button></div>
      ${tips.map(([n, t, d, a]) => `<div class="row" style="align-items:flex-start;flex-wrap:nowrap;gap:12px"><span class="chip" style="flex:none">${n}</span><div class="stack" style="gap:2px;min-width:0"><b>${t}</b><span class="small">${d}</span>${S.settings.arabic ? `<span class="ar small muted" lang="ar">${a}</span>` : ''}</div></div>`).join('')}
    </div>`;
  }
  document.addEventListener('click', (e) => { if (e.target.id === 'tour-x') { S.toured = true; save(); const t = document.getElementById('tour'); if (t) t.remove(); } });
  function levelBlock(L) {
    const p = levelProgress(L);
    const passed = S.tests[L.id] && S.tests[L.id].passed;
    const rec = S.placement && S.placement.level === L.n;
    const cur = next0() === L.id;
    return `<div class="level ${passed ? 'done' : (cur ? 'on' : '')}">
      <div class="rail"><div class="node">${L.n}</div></div>
      <div class="body">
        <div class="spread"><div><span class="eyebrow">${esc(L.grade)} · ${esc(L.cefr)}</span><h3>${esc(L.title)}</h3><div class="ar small muted" lang="ar">${esc(L.ar)}</div></div>
          ${rec ? '<span class="chip gold">Your start</span>' : ''}</div>
        ${L.cando ? `<p class="small"><b>After this level:</b> ${esc(L.cando)}</p>` : ''}
        <div class="bar"><i style="width:${Math.round(p * 100)}%"></i></div>
        <details class="units-wrap" ${cur || rec ? 'open' : ''}><summary class="small muted">${L.units.length} units and a test · ${Math.round(p * 100)}% done</summary>
        <div class="units">
          ${L.units.map(unitLink).join('')}
          <a class="unit-link" href="#/test/${L.id}"><span class="k">${I.test}</span><span class="t"><b>Level ${L.n} Test</b><span>20 questions · pass with ${PASS_TEST}%</span></span>
            ${passed ? `<span class="chip good">${S.tests[L.id].best}%</span>` : (S.tests[L.id] ? `<span class="chip bad">${S.tests[L.id].best}%</span>` : '<span class="chip plain">Test</span>')}</a>
        </div></details>
      </div></div>`;
  }
  function next0() { const n = nextStep(); if (!n) return null; return n.u ? n.u.level.id : (n.href.split('/')[2]); }
  function unitLink(u) {
    const s = S.units[u.id];
    let chip = '<span class="chip plain">New</span>';
    if (s && s.best !== null) chip = s.best >= PASS_UNIT ? `<span class="chip good">${s.best}%</span>` : `<span class="chip bad">${s.best}%</span>`;
    else if (s && s.lesson) chip = '<span class="chip">Quiz next</span>';
    return `<a class="unit-link" href="#/unit/${u.id}/lesson"><span class="k">${kindIcon(u.kind)}</span>
      <span class="t"><b>${esc(u.title)}</b><span>${kindName[u.kind]}</span></span>${chip}</a>`;
  }
  function viewLevel(L) { location.hash = '#/'; }

  /* ================= Unit ================= */
  function viewUnit(u, tab) {
    const L = u.level;
    const s = U(u.id);
    const hasItems = (u.items || []).length > 0;
    const tabs = [['lesson', 'Lesson'], ['practice', 'Practice'], ['quiz', 'Quiz']];
    app.innerHTML = `
      <a class="back" href="#/">${I.back} Level ${L.n} · ${esc(L.title)}</a>
      <div class="stack" style="gap:6px">
        <span class="eyebrow">${kindName[u.kind]}</span>
        <h1>${esc(u.title)}</h1>
        ${u.ar ? `<div class="ar muted" lang="ar">${esc(u.ar)}</div>` : ''}
      </div>
      ${hasItems ? `<nav class="seg">${tabs.map(([k, n]) => `<a href="#/unit/${u.id}/${k}" class="${k === tab ? 'on' : ''}">${n}</a>`).join('')}</nav>` : ''}
      <div id="ubody" class="stack"></div>`;
    const body = document.getElementById('ubody');
    if (tab === 'lesson' || !hasItems) renderLesson(u, body);
    else if (tab === 'practice') {
      runSet({ box: body, items: shuffle(u.items), mode: 'practice', onFinish: (r) => { s.practiced += r.counted; save(); location.hash = `#/unit/${u.id}/quiz`; } });
    } else if (tab === 'quiz') {
      quizIntro(u, body);
    }
  }

  function renderLesson(u, box) {
    const s = U(u.id);
    const blocks = (u.lesson || []).map(blockHTML).join('');
    let words = '';
    if (u.words && u.words.length) {
      words = `<h3>Words in this unit</h3><p class="small muted">These words go into your Review deck when you finish the lesson.</p>
        <div>${u.words.map(w => `<div class="word-row"><b>${esc(w.w)}</b>${speakBtn(w.w)}
          ${S.settings.arabic && w.ar ? `<div class="ar" lang="ar">${esc(w.ar)}</div>` : ''}
          <div class="d">${md(w.d)}</div>${w.ex ? `<div class="e">“${esc(w.ex)}”</div>` : ''}</div>`).join('')}</div>`;
    }
    let passages = '';
    if (u.passages && u.passages.length) {
      passages = `<h3>Read</h3>` + u.passages.map((p, i) => passageHTML(p, i === 0)).join('');
    }
    box.innerHTML = `<div class="lesson">${blocks}${words}${passages}</div>
      <div id="dialoguebox" class="stack"></div>
      <div id="roleplaybox" class="stack"></div>
      <div id="fluencybox" class="stack"></div>
      <div id="speakbox" class="stack"></div>
      <div id="writebox" class="stack"></div>
      <div id="checkbox" class="stack"></div>
      <div class="card flat stack">
        ${s.lesson ? '<p><b>Lesson finished.</b> Practice as much as you like, then take the quiz.</p>' : '<p>When you have read everything above, mark the lesson as finished.</p>'}
        <div class="row">
          ${s.lesson ? '' : '<button class="btn primary" id="ldone">I finished the lesson</button>'}
          ${(u.items || []).length ? `<a class="btn ${s.lesson ? 'primary' : ''}" href="#/unit/${u.id}/practice">Practice</a><a class="btn" href="#/unit/${u.id}/quiz">Quiz</a>` : ''}
        </div>
      </div>`;
    const ld = document.getElementById('ldone');
    if (ld) ld.onclick = () => {
      s.lesson = true; addXP(20); markStep('learn');
      (u.words || []).forEach(w => { if (!S.cards[w.w]) S.cards[w.w] = { box: 0, due: today() }; });
      save(); toast('+20 points. Nice work!');
      location.hash = `#/unit/${u.id}/practice`;
    };
    if (u.dialogue) renderDialogue(u, document.getElementById('dialoguebox'));
    if (u.roleplays && u.roleplays.length) renderRoleplays(u, document.getElementById('roleplaybox'));
    if (u.passages && u.passages.length) renderFluency(u, document.getElementById('fluencybox'));
    if (u.speak && u.speak.length) renderSpeakList(u, document.getElementById('speakbox'));
    if (u.write && u.write.length) renderWrite(u, document.getElementById('writebox'));
    renderCheck(u, document.getElementById('checkbox'));
  }

  function blockHTML(b) {
    if (b.h) return `<h3>${md(b.h)}</h3>`;
    if (b.p) return `<p>${md(b.p)}</p>`;
    if (b.tip) return `<p class="tip">${md(b.tip)}</p>`;
    if (b.ar) return S.settings.arabic ? `<div class="ar-note ar" lang="ar">${md(b.ar)}</div>` : '';
    if (b.ex) return `<div class="ex">${b.ex.map(x => `<div class="ex-line"><span>${md(x)}</span>${speakBtn(x.replace(/\*+/g, '').replace(/_{3,}/g, 'blank'))}</div>`).join('')}</div>`;
    if (b.table) return `<div class="tbl-wrap"><table><thead><tr>${b.table[0].map(c => `<th>${md(c)}</th>`).join('')}</tr></thead><tbody>${b.table.slice(1).map(r => `<tr>${r.map(c => `<td>${md(c)}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
    if (b.pairs) return `<div class="pairs">${b.pairs.map(([x, y]) => `<div class="pair"><button data-say="${esc(x)}">${esc(x)}</button><span class="muted small">vs</span><button data-say="${esc(y)}">${esc(y)}</button></div>`).join('')}</div>`;
    return '';
  }
  function passageHTML(p, open) {
    return `<details class="passage" ${open ? 'open' : ''}><summary><span>${esc(p.title)}</span>${speakBtn(p.text.replace(/\n+/g, ' '), 'Listen to the passage')}</summary>
      <div class="reading">${p.text.split(/\n\n+/).map(x => `<p>${wrapWords(x)}</p>`).join('')}${p.source ? `<p class="small muted">${esc(p.source)}</p>` : ''}</div></details>`;
  }

  function quizIntro(u, box) {
    const s = U(u.id);
    const n = Math.min(10, u.items.filter(x => x.t !== 'say' || Speech.canHear).length);
    const earlier = earlierItems(u);
    box.innerHTML = `<div class="card stack">
      <h2>Unit quiz</h2>
      <p>${n} questions. Pass with ${PASS_UNIT}% or more to master this unit. You can take it again as many times as you want. Your best score is kept.</p>
      ${earlier.length ? '<p class="small muted">2 questions come from earlier units. Mixing old and new topics makes memory last longer.</p>' : ''}
      ${s.best !== null ? `<p>Your best: <b>${s.best}%</b> (${s.tries} ${s.tries === 1 ? 'try' : 'tries'})</p>` : ''}
      <div class="row"><button class="btn primary" id="qs">Start quiz</button>${!s.lesson ? `<a class="btn ghost" href="#/unit/${u.id}/lesson">Read the lesson first</a>` : ''}</div>
    </div>`;
    document.getElementById('qs').onclick = () => {
      const pool = u.items.filter(x => x.t !== 'say' || Speech.canHear);
      const mixed = earlier.length ? shuffle(sample(pool, n - 2).concat(sample(earlier, 2))) : sample(pool, n);
      runSet({
        box, items: mixed, mode: 'quiz',
        onFinish: (r) => {
          s.tries++; if (s.best === null || r.pct > s.best) s.best = r.pct;
          if (r.pct >= PASS_UNIT && !s.passed) s.passed = today();
          if (r.pct >= PASS_UNIT) addXP(30);
          markStep('learn'); save();
          results(box, r, { pass: PASS_UNIT, again: () => viewUnit(u, 'quiz'), next: nextUnitHref(u), backHref: `#/unit/${u.id}/lesson` });
        }
      });
    };
  }
  function studied(u) { const x = S.units[u.id]; return !!(x && (x.lesson || x.best !== null)); }
  function earlierItems(u) {
    const k = UNIT_ORDER.indexOf(u);
    return [].concat(...UNIT_ORDER.slice(0, k).filter(studied).map(x => (x.items || []).filter(i => i.t !== 'say')));
  }
  function nextUnitHref(u) {
    const L = u.level; const nu = L.units[u.index + 1];
    return nu ? { href: `#/unit/${nu.id}/lesson`, label: `Next: ${nu.title}` } : { href: `#/test/${L.id}`, label: `Take the Level ${L.n} Test` };
  }

  /* ================= Question runner ================= */
  function trackItem(item, c, mode) {
    if (!item.id || !ITEM[item.id] || c === null) return;
    const m = S.miss[item.id];
    if (c === false) S.miss[item.id] = { box: 0, due: addDays(today(), MISS_GAPS[0]) };
    else if (m && mode === 'review') {
      m.box++;
      if (m.box >= MISS_GAPS.length) delete S.miss[item.id]; else m.due = addDays(today(), MISS_GAPS[m.box]);
    }
    save();
  }
  const dueMisses = () => { const d = today(); return Object.keys(S.miss).filter(id => ITEM[id] && ITEM[id].t !== 'say' && S.miss[id].due <= d).sort((a, b) => S.miss[a].due < S.miss[b].due ? -1 : 1); };
  let examMode = false;
  function runSet({ box, items, mode, onFinish, quiet, track = true }) {
    examMode = mode === 'quiz' || mode === 'test';
    onLeave(() => { examMode = false; });
    let i = 0, right = 0, counted = 0; const wrongs = [];
    const order = items.slice();
    const total = order.length;
    function show() {
      if (mode !== 'practice' && i >= total) return finish();
      if (mode === 'practice' && i >= order.length) order.push(...shuffle(items));
      const item = order[i];
      const head = mode === 'practice'
        ? `<div class="qhead"><span class="eyebrow">Practice · ${right} right so far</span><button class="btn small ghost" id="endp">Finish practice</button></div>`
        : `<div class="qhead"><span class="eyebrow">Question ${i + 1} of ${total}</span><span class="chip plain">${right} right</span></div><div class="bar"><i style="width:${i / total * 100}%"></i></div>`;
      box.innerHTML = head + '<div id="qbox" class="stack"></div>';
      const endp = document.getElementById('endp');
      if (endp) endp.onclick = () => finish();
      renderQ(item, document.getElementById('qbox'), {
        quiet,
        onResult(c) {
          if (c === null) return;
          if (track) trackItem(item, c, mode);
          counted++;
          if (c) { right++; addXP(mode === 'practice' ? 2 : 3); } else wrongs.push(item);
          if (mode === 'practice' && !c) order.splice(Math.min(order.length, i + 3), 0, item);
        },
        onNext() { i++; show(); }
      });
    }
    function finish() { examMode = false; onFinish({ pct: counted ? Math.round(right / counted * 100) : 0, right, counted, wrongs }); }
    show();
  }

  function answerText(item) {
    if (item.t === 'mc' || item.t === 'listen') return item.o[item.a];
    if (item.t === 'fill') return [].concat(item.a)[0];
    if (item.t === 'order') return item.a;
    if (item.t === 'dict') return item.say;
    if (item.t === 'num') return item.a;
    if (item.t === 'say') return item.text;
    return '';
  }

  const passageOpen = {};
  document.addEventListener('toggle', (e) => {
    const d = e.target;
    if (d.classList && d.classList.contains('passage') && d.closest('#qbox')) {
      const t = d.querySelector('summary span'); if (t) passageOpen[t.textContent] = d.open;
    }
  }, true);
  function renderQ(item, box, cb) {
    let answered = false;
    const passage = item.passage ? passageHTML(item.passage, passageOpen[item.passage.title] !== false) : '';
    const prompt = item.q ? `<div class="qprompt">${md(item.q)}</div>` : '';
    function feedback(correct, extra) {
      if (answered) return; answered = true;
      cb.onResult(correct);
      const fb = document.createElement('div');
      const cls = correct === null ? 'info' : correct ? 'right' : 'wrong';
      const verdict = correct === null ? '' : correct ? pick(['Correct!', 'Yes! Well done.', 'Right!', 'Excellent!']) : 'Not quite.';
      fb.className = 'feedback ' + cls;
      fb.innerHTML = `${verdict ? `<b class="v">${verdict}</b>` : ''}${extra || ''}
        ${!cb.quiet && item.why ? `<div>${md(item.why)}</div>` : ''}
        ${!cb.quiet && item.whyAr && S.settings.arabic ? `<div class="ar" lang="ar">${md(item.whyAr)}</div>` : ''}
        <div><button class="btn primary" id="nextq">Next</button></div>`;
      box.appendChild(fb);
      const nb = fb.querySelector('#nextq'); nb.onclick = cb.onNext; nb.focus({ preventScroll: true });
      fb.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    if (item.t === 'mc' || item.t === 'listen') {
      const idx = shuffle(item.o.map((_, k) => k));
      box.innerHTML = passage + (item.t === 'listen'
        ? `<div class="stack" style="align-items:center"><button class="play-big" data-say="${esc(item.say)}" aria-label="Play">${I.speak}</button><span class="small muted">Tap to listen. Tap again to repeat.</span></div>` : '')
        + (prompt || (item.t === 'listen' ? '<div class="qprompt">What did you hear?</div>' : ''))
        + `<div class="opts">${idx.map(k => `<button class="opt" data-k="${k}">${md(item.o[k])}</button>`).join('')}</div>`;
      if (item.t === 'listen') setTimeout(() => say(item.say), 300);
      box.querySelectorAll('.opt').forEach(b => b.onclick = () => {
        if (answered) return;
        const k = +b.dataset.k; const ok = k === item.a;
        box.querySelectorAll('.opt').forEach(x => { x.disabled = true; if (+x.dataset.k === item.a) x.classList.add('right'); });
        if (!ok) b.classList.add('wrong');
        feedback(ok);
      });
    } else if (item.t === 'fill' || item.t === 'dict' || item.t === 'num') {
      const audio = item.t !== 'fill';
      box.innerHTML = passage + (audio
        ? `<div class="stack" style="align-items:center"><button class="play-big" data-say="${esc(item.say)}" aria-label="Play">${I.speak}</button><span class="small muted">Listen, then type exactly what you hear.</span></div>` : '')
        + (prompt || (item.t === 'dict' ? '<div class="qprompt">Type the sentence.</div>' : ''))
        + `<input class="input" id="fa" autocomplete="off" autocapitalize="off" spellcheck="false" ${item.numeric ? 'inputmode="decimal"' : ''} placeholder="${esc(item.ph || 'Type your answer')}">
        <div><button class="btn primary" id="fc">Check</button></div>`;
      if (audio) setTimeout(() => say(item.say), 300);
      const inp = box.querySelector('#fa');
      const check = () => {
        if (answered) return;
        const v = normAns(inp.value);
        if (!v) { inp.focus(); return; }
        const accepts = item.t === 'dict' ? [item.say] : [].concat(item.a);
        const ok = item.t === 'num' ? item.check(inp.value) : accepts.some(a => normAns(a) === v);
        inp.disabled = true; box.querySelector('#fc').disabled = true;
        feedback(ok, ok ? '' : `<div>Answer: <b>${esc(accepts[0])}</b></div>`);
      };
      box.querySelector('#fc').onclick = check;
      inp.onkeydown = (e) => { if (e.key === 'Enter') check(); };
      if (!item.passage) setTimeout(() => inp.focus({ preventScroll: true }), 50);
    } else if (item.t === 'order') {
      const words = item.a.split(' ');
      let pool = shuffle(words.map((w, k) => ({ w, k })));
      if (pool.map(x => x.w).join(' ') === item.a && words.length > 1) pool = pool.reverse();
      let chosen = [];
      box.innerHTML = passage + (prompt || '<div class="qprompt">Put the words in the right order.</div>')
        + `<div class="tiles answer" id="ta" aria-label="Your sentence"></div><div class="tiles" id="tp"></div>
        <div class="row"><button class="btn primary" id="oc">Check</button><button class="btn ghost" id="or">Clear</button></div>`;
      const ta = box.querySelector('#ta'), tp = box.querySelector('#tp');
      const draw = () => {
        ta.innerHTML = chosen.map((x, k) => `<button class="tile" data-c="${k}">${esc(x.w)}</button>`).join('');
        tp.innerHTML = pool.map((x, k) => `<button class="tile" data-p="${k}">${esc(x.w)}</button>`).join('');
        ta.querySelectorAll('.tile').forEach(t => t.onclick = () => { if (answered) return; pool.push(chosen.splice(+t.dataset.c, 1)[0]); draw(); });
        tp.querySelectorAll('.tile').forEach(t => t.onclick = () => { if (answered) return; chosen.push(pool.splice(+t.dataset.p, 1)[0]); draw(); });
      };
      draw();
      box.querySelector('#or').onclick = () => { if (answered) return; pool = pool.concat(chosen); chosen = []; draw(); };
      box.querySelector('#oc').onclick = () => {
        if (answered || !chosen.length) return;
        const ok = normAns(chosen.map(x => x.w).join(' ')) === normAns(item.a);
        feedback(ok, ok ? `<div>${speakBtn(item.a)}</div>` : `<div>Answer: <b>${esc(item.a)}</b> ${speakBtn(item.a)}</div>`);
      };
    } else if (item.t === 'say') {
      sayWidget(item.text, box, {
        unitId: item.unit && item.unit.id,
        onScore: (sc) => feedback(sc >= 70, `<div>Your reading score: <b>${sc}%</b></div>`),
        onSkip: () => feedback(null, '<div>Skipped. You can record it on the Voice tab and send it to be graded.</div>')
      });
    }
  }
  const pick = (a) => a[Math.floor(Math.random() * a.length)];

  /* ================= Results ================= */
  function results(box, r, { pass, again, next, backHref, title, review, drill }) {
    const ok = r.pct >= pass;
    const msg = drill ? (r.pct >= pass ? 'Great listening!' : 'Keep practicing. Listening gets easier with every try.')
      : review ? (r.pct >= 80 ? 'Great memory! These are getting stronger.' : 'Good work. The ones you missed will come back in a few days.')
      : ok ? pick(['You passed! Very good.', 'Passed! You are getting stronger.', 'Well done, you passed!'])
      : r.pct >= pass - 15 ? 'Almost there. Practice a little more and try again.'
      : 'This needs more practice. Read the lesson again, practice, then try the quiz.';
    const msgAr = drill ? (r.pct >= pass ? 'سمعك ممتاز!' : 'كمّلي تدريب. السمع بيسهل مع كل مرة.') : review ? 'شاطرة! اللي غلطتي فيه هيرجعلك تاني بعد كام يوم.' : ok ? 'برافو عليكي! كمّلي.' : r.pct >= pass - 15 ? 'قربتي خلاص. ذاكري شوية وجرّبي تاني.' : 'محتاجة تدريب أكتر. اقري الدرس تاني واتمرني، وبعدين جرّبي.';
    box.innerHTML = `<div class="card stack" style="text-align:center;align-items:center">
        <span class="eyebrow">${esc(title || 'Your score')}</span>
        <div class="score-ring" style="color:${ok || review ? 'var(--good)' : 'var(--bad)'}">${r.pct}%</div>
        <p>${r.right} of ${r.counted} correct</p>
        <h2>${msg}</h2>
        <p class="ar muted" lang="ar">${msgAr}</p>
        <div class="row" style="justify-content:center">
          ${ok && next ? `<a class="btn primary" href="${next.href}">${esc(next.label)}</a>` : ''}
          <button class="btn ${ok ? '' : 'primary'}" id="again">Try again</button>
          ${backHref ? `<a class="btn ghost" href="${backHref}">Back to lesson</a>` : ''}
        </div></div>
      ${r.wrongs.length ? `<div class="stack"><h3>Review your mistakes</h3>${r.wrongs.map(w => `<div class="card flat stack" style="gap:6px">
          ${w.q ? `<div class="row" style="gap:8px"><span>${md(w.q)}</span>${w.say ? speakBtn(w.say) : ''}</div>` : w.say ? `<div class="row"><span class="muted">Audio:</span> ${esc(w.say)} ${speakBtn(w.say)}</div>` : w.text ? `<div>${esc(w.text)}</div>` : '<div class="muted">Word order</div>'}
          <div>Correct answer: <b>${md(answerText(w))}</b></div>
          ${w.why ? `<div class="small muted">${md(w.why)}</div>` : ''}</div>`).join('')}</div>` : ''}`;
    document.getElementById('again').onclick = again;
    window.scrollTo(0, 0);
  }

  /* ================= Speaking ================= */
  function claudeSpeechPrompt(text, heard, missed) {
    return `You are my patient English pronunciation coach. My first language is Egyptian Arabic.
I tried to read this sentence aloud:
"${text}"
${heard !== undefined ? `Speech recognition heard: "${heard || '(nothing)'}"\nWords it missed: ${missed && missed.length ? missed.join(', ') : 'none'}\n` : ''}Please:
1. Tell me which sounds I probably said wrong (think about common Arabic-speaker problems like p/b, v/f, th, short vowels, and extra vowels in consonant clusters).
2. Explain how to fix each one in very simple English, then the same tip in Egyptian Arabic.
3. Give me 3 short practice words or phrases for each sound.
4. Give me a score from 1 to 10 and one thing I did well.`;
  }
  function claudeVoicePrompt(text) {
    return `I'm practicing English pronunciation. My first language is Egyptian Arabic. In voice mode, I will read this sentence aloud: "${text}". Listen carefully. Tell me which words I said wrong, show me how to say them slowly, and make me repeat each one until it is right. Use simple English, and explain in Egyptian Arabic if I'm confused. Be kind and encouraging.`;
  }

  function chunkText(text) {
    const parts = text.match(/[^,;:.!?]+[,;:.!?]*/g) || [text];
    const out = [];
    parts.forEach(p => {
      const w = p.trim().split(/\s+/).filter(Boolean);
      if (!w.length) return;
      if (w.length <= 5) { out.push(w.join(' ')); return; }
      const groups = Math.ceil(w.length / 4), size = Math.ceil(w.length / groups);
      for (let i = 0; i < w.length; i += size) out.push(w.slice(i, i + size).join(' '));
    });
    return out;
  }
  function sayWidget(text, box, { unitId, onScore, onSkip, onShadow, compact }) {
    const id = 'sw' + Math.random().toString(36).slice(2, 8);
    box.innerHTML = `<div class="card stack" id="${id}">
      <div class="spread"><span class="eyebrow">Read this out loud</span><div class="row" style="gap:6px">${speakBtn(text, 'Hear it')}<button class="icon-btn" data-slow="1" aria-label="Hear it slowly">${I.slow}</button></div></div>
      <div class="say-text">${chunkText(text).map((c, k) => `<span data-ch="${k}">${esc(c)}</span>`).join(' ')}</div>
      <div class="heard" hidden></div>
      <div class="row">
        <button class="btn" data-act="shadow">${I.speak} Listen and repeat</button>
        ${Speech.canHear ? `<button class="btn primary" data-act="check">${I.mic} Check my reading</button>` : ''}
        ${Speech.canRecord ? `<button class="btn" data-act="rec">${I.rec} Record for grading</button>` : ''}
        <button class="btn ghost small" data-act="claude">${I.copy} Claude voice coach</button>
        ${onSkip ? '<button class="btn ghost small" data-act="skip">Skip</button>' : ''}
      </div>
      ${!Speech.canHear ? '<p class="small muted">Automatic checking works in Chrome on Android or a computer. On this device, record yourself and your son or Claude can grade it.</p>' : ''}
      <div class="status small muted" aria-live="polite"></div>
    </div>`;
    const root = box.querySelector('#' + id);
    const status = root.querySelector('.status');
    const heardEl = root.querySelector('.heard');
    let last = null;
    root.querySelector('[data-slow]').onclick = () => Speech.say(text, { rate: 0.6, voice: S.settings.voice });
    let shadowRun = 0;
    const sh = root.querySelector('[data-act="shadow"]');
    sh.onclick = async () => {
      const run = ++shadowRun;
      const chunks = chunkText(text);
      const spans = root.querySelectorAll('[data-ch]');
      const live = () => run === shadowRun && root.isConnected;
      sh.disabled = true;
      for (let k = 0; k < chunks.length && live(); k++) {
        spans.forEach(x => x.classList.toggle('hl', +x.dataset.ch === k));
        status.textContent = 'Listen…';
        await Speech.sayP(chunks[k], { rate: S.settings.rate, voice: S.settings.voice });
        if (!live()) break;
        status.textContent = 'Your turn. Say it out loud.';
        spans.forEach(x => x.classList.toggle('turn', +x.dataset.ch === k));
        await new Promise(r => setTimeout(r, 900 + chunks[k].split(/\s+/).length * 600));
        spans.forEach(x => x.classList.remove('turn'));
      }
      spans.forEach(x => x.classList.remove('hl', 'turn'));
      if (live()) {
        status.textContent = 'Now listen to the whole sentence, then say it all together.';
        await Speech.sayP(text, { rate: S.settings.rate, voice: S.settings.voice });
        if (live()) status.textContent = Speech.canHear ? 'Your turn: say the whole sentence. Tap "Check my reading" to get a score.' : 'Your turn: say the whole sentence.';
        addXP(2);
        if (onShadow) onShadow();
      }
      sh.disabled = false;
    };
    const chk = root.querySelector('[data-act="check"]');
    if (chk) chk.onclick = async () => {
      if (chk.classList.contains('mic-on')) { Speech.stopListening(); return; }
      chk.classList.add('mic-on'); chk.innerHTML = `${I.stop} Listening… tap to stop`; status.textContent = 'Speak now.';
      try {
        const alts = await Speech.listen();
        const r = Speech.best(text, alts); last = r;
        heardEl.hidden = false;
        heardEl.innerHTML = r.words.map((w, k) => `<span class="${r.hit[k] ? 'ok' : 'miss'}">${esc(w)}</span>`).join(' ')
          + `<div class="small muted">Score: <b>${r.score}%</b>${r.heard ? ` · I heard: “${esc(r.heard)}”` : ' · I did not hear anything. Try again closer to the phone.'}</div>`;
        status.textContent = r.score >= 90 ? 'Excellent reading!' : r.score >= 70 ? 'Good! Red words need a little practice.' : 'Listen to the sentence, then try again slowly.';
        if (r.heard) addXP(2);
        if (onScore && r.heard) { onScore(r.score); }
      } catch (err) {
        status.textContent = err === 'not-allowed' || err === 'service-not-allowed' ? 'Please allow the microphone, then try again.' : 'I could not hear you. Try again.';
      }
      chk.classList.remove('mic-on'); chk.innerHTML = `${I.mic} Check again`;
    };
    const rb = root.querySelector('[data-act="rec"]');
    let recorder = null;
    if (rb) rb.onclick = async () => {
      if (recorder) {
        const blob = await recorder.stop(); recorder = null;
        rb.classList.remove('mic-on'); rb.innerHTML = `${I.rec} Record again`;
        await Speech.saveRec({ id: 'r' + Date.now(), at: Date.now(), unitId: unitId || '', text, blob, score: last ? last.score : null, transcript: last ? last.heard : '', grade: null });
        status.innerHTML = 'Saved to the <a href="#/voice">Voice tab</a> for grading.';
        addXP(3);
        return;
      }
      try {
        recorder = await Speech.record();
        rb.classList.add('mic-on'); rb.innerHTML = `${I.stop} Stop and save`; status.textContent = 'Recording… read the sentence, then tap Stop.';
      } catch (e) { status.textContent = 'Please allow the microphone to record.'; }
    };
    root.querySelector('[data-act="claude"]').onclick = () => {
      copy(last ? claudeSpeechPrompt(text, last.heard, last.missed) : claudeVoicePrompt(text));
      status.innerHTML = 'Copied. Open the Claude app, paste it, then tap the voice button and read the sentence.';
    };
    const sk = root.querySelector('[data-act="skip"]');
    if (sk) sk.onclick = () => onSkip();
    onLeave(() => { shadowRun++; Speech.cancel(); if (recorder) recorder.stop(); Speech.stopListening(); });
  }

  function renderSpeakList(u, box) {
    box.innerHTML = `<h3>Say it out loud</h3><p class="small muted">Listen first, then read each sentence. Red words need more practice.</p><div id="spk-one"></div>
      <div class="row" id="spk-nav"></div>`;
    let k = 0;
    const draw = () => {
      sayWidget(u.speak[k], box.querySelector('#spk-one'), { unitId: u.id });
      box.querySelector('#spk-nav').innerHTML = `<button class="btn small" id="sp-prev" ${k === 0 ? 'disabled' : ''}>Previous</button>
        <span class="small muted">${k + 1} of ${u.speak.length}</span>
        <button class="btn small" id="sp-next" ${k === u.speak.length - 1 ? 'disabled' : ''}>Next sentence</button>`;
      box.querySelector('#sp-prev').onclick = () => { k--; draw(); };
      box.querySelector('#sp-next').onclick = () => { k++; draw(); };
    };
    draw();
  }

  function claudeWritingPrompt(L, task, text) {
    return `You are my kind, honest English writing teacher. My first language is Egyptian Arabic. I am working at this level: ${L.grade} (${L.cefr}).
The assignment was: "${task}"

Here is my writing:
"""
${text}
"""

Please:
1. Give me a score out of 10 for each: grammar, vocabulary, organization, and meeting the assignment.
2. Show my writing again with corrections in **bold**.
3. Explain my 3 most important mistakes in simple English, and again in Egyptian Arabic.
4. Tell me 2 things I did well.
5. Give me one short exercise to practice my biggest mistake.`;
  }
  function renderWrite(u, box) {
    const L = u.level;
    box.innerHTML = `<h3>Write</h3>` + u.write.map((w, k) => {
      const key = u.id + ':' + k;
      return `<div class="card stack">
        <p><b>${md(w.task)}</b></p>${w.ar && S.settings.arabic ? `<p class="ar small" lang="ar">${esc(w.ar)}</p>` : ''}
        ${w.hint ? `<p class="small muted">${md(w.hint)}</p>` : ''}
        <label class="small muted" for="wr-${k}">Your writing</label>
        <textarea class="input" id="wr-${k}" data-key="${esc(key)}">${esc(S.writing[key] || '')}</textarea>
        <div class="spread"><span class="small muted" id="wc-${k}">0 words</span>
          <button class="btn primary small" data-copy="${k}">${I.copy} Copy for Claude to grade</button></div>
      </div>`;
    }).join('');
    u.write.forEach((w, k) => {
      const ta = box.querySelector('#wr-' + k), wc = box.querySelector('#wc-' + k);
      const count = () => { const n = (ta.value.match(/\b[\w']+\b/g) || []).length; wc.textContent = n + ' words'; };
      count();
      let t;
      ta.oninput = () => { count(); clearTimeout(t); t = setTimeout(() => { S.writing[ta.dataset.key] = ta.value; save(); }, 400); };
      box.querySelector(`[data-copy="${k}"]`).onclick = () => {
        if (ta.value.trim().split(/\s+/).length < 5) { toast('Write a few sentences first.'); return; }
        S.writing[ta.dataset.key] = ta.value; save(); addXP(10);
        copy(claudeWritingPrompt(L, w.task, ta.value));
      };
    });
  }

  /* ================= Level test ================= */
  function viewTest(L) {
    const t = S.tests[L.id];
    app.innerHTML = `<a class="back" href="#/">${I.back} Your path</a>
      <div class="stack" style="gap:6px"><span class="eyebrow">Level ${L.n} · ${esc(L.grade)}</span><h1>Level ${L.n} Test</h1></div>
      <div id="tbody" class="stack"></div>`;
    const box = document.getElementById('tbody');
    box.innerHTML = `<div class="card stack">
      <p>20 questions from every unit in this level. Pass with <b>${PASS_TEST}%</b> to finish the level and earn your certificate.</p>
      <p class="ar small" lang="ar">٢٠ سؤال من كل الوحدات. لازم ٨٠٪ عشان تعدّي المستوى وتاخدي الشهادة.</p>
      ${t ? `<p>Your best: <b>${t.best}%</b>${t.passed ? ' · Passed' : ''}</p>` : ''}
      <div class="row"><button class="btn primary" id="ts">Start test</button>${t && t.passed ? `<a class="btn" href="#/cert/${L.id}">See certificate</a>` : ''}</div></div>`;
    document.getElementById('ts').onclick = () => {
      let items = [];
      const per = Math.ceil(20 / L.units.length);
      L.units.forEach(u => { items = items.concat(sample((u.items || []).filter(x => x.t !== 'say'), per)); });
      if (L.test) items = items.concat(L.test.map((x, k) => Object.assign(x, { id: L.id + 'T' + k })));
      items = sample(items, Math.min(20, items.length));
      runSet({
        box, items, mode: 'test',
        onFinish: (r) => {
          const prev = S.tests[L.id] || { best: 0, passed: false };
          prev.best = Math.max(prev.best, r.pct);
          if (r.pct >= PASS_TEST && !prev.passed) { prev.passed = true; prev.date = today(); addXP(100); }
          markStep('learn');
          S.tests[L.id] = prev; save();
          const nl = LEVELS[LEVELS.indexOf(L) + 1];
          results(box, r, { pass: PASS_TEST, title: `Level ${L.n} Test`, again: () => viewTest(L), next: r.pct >= PASS_TEST ? { href: `#/cert/${L.id}`, label: 'Get my certificate' } : null });
          if (r.pct >= PASS_TEST && nl) {
            const a = document.createElement('a'); a.className = 'btn block'; a.href = `#/unit/${nl.units[0].id}/lesson`; a.textContent = `Start Level ${nl.n}: ${nl.title}`;
            box.querySelector('.card').appendChild(a);
          }
        }
      });
    };
  }

  function viewCert(L) {
    const t = S.tests[L.id];
    if (!t || !t.passed) { location.hash = `#/test/${L.id}`; return; }
    app.innerHTML = `<a class="back noprint" href="#/me">${I.back} Me</a>
      <div class="card cert">
        <span class="eyebrow">Certificate of Achievement</span>
        <p class="muted">This certifies that</p>
        <h2>${esc(S.name)}</h2>
        <p class="muted">completed</p>
        <h2>Level ${L.n}: ${esc(L.title)}</h2>
        <p>${esc(L.grade)} · ${esc(L.cefr)}</p>
        <p>Score: <b>${t.best}%</b> · ${esc(new Date(t.date + 'T12:00:00').toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' }))}</p>
        <p class="ar" lang="ar">ألف مبروك! تعبك بيجيب نتيجة.</p>
      </div>
      <div class="row noprint"><button class="btn" id="pr">Print or save as PDF</button></div>`;
    document.getElementById('pr').onclick = () => window.print();
  }

  /* ================= Placement ================= */
  function viewPlacement() {
    const items = (window.SEKKA_PLACEMENT || []).map((x, k) => { x.id = 'P' + k; if (x.t === 'tf') { x.t = 'mc'; x.o = ['True', 'False']; x.a = x.a ? 0 : 1; } return x; });
    app.innerHTML = `<a class="back" href="#/">${I.back} Home</a><div class="stack" style="gap:6px"><span class="eyebrow">Placement check</span><h1>Find my level</h1></div><div id="pbody" class="stack"></div>`;
    const box = document.getElementById('pbody');
    const got = {};
    const tagged = items.map(x => Object.assign({}, x));
    let i = 0;
    const res = [];
    function show() {
      if (i >= tagged.length) return done();
      box.innerHTML = `<div class="qhead"><span class="eyebrow">Question ${i + 1} of ${tagged.length}</span><button class="btn small ghost" id="pstop">Stop here</button></div><div class="bar"><i style="width:${i / tagged.length * 100}%"></i></div><div id="qbox" class="stack"></div>`;
      document.getElementById('pstop').onclick = done;
      renderQ(tagged[i], document.getElementById('qbox'), { quiet: true, onResult: (c) => res.push({ lvl: tagged[i].lvl, c }), onNext: () => { i++; show(); } });
    }
    function done() {
      res.forEach(r => { got[r.lvl] = got[r.lvl] || [0, 0]; got[r.lvl][1]++; if (r.c) got[r.lvl][0]++; });
      let level = 1;
      for (let n = 1; n <= LEVELS.length; n++) {
        const g = got[n];
        if (g && g[1] && g[0] / g[1] >= 0.67) level = Math.min(LEVELS.length, n + 1); else break;
      }
      S.placement = { level, date: today() }; addXP(20); save();
      const L = LEVELS[level - 1];
      box.innerHTML = `<div class="card stack">
        <span class="eyebrow">Your result</span>
        <h2>Start at Level ${level}: ${esc(L.title)}</h2>
        ${level === LEVELS.length && got[LEVELS.length] && got[LEVELS.length][0] / got[LEVELS.length][1] >= 0.67 ? '<p><b>You already read at an advanced level.</b> Use Level 6 and the Talk at Work units to polish your speaking and writing for work and college.</p>' : ''}
        <p>${esc(L.grade)} · ${esc(L.cefr)}</p>
        <div class="tbl-wrap"><table><thead><tr><th>Level</th><th>Correct</th></tr></thead><tbody>
        ${LEVELS.map(x => `<tr><td>${x.n}. ${esc(x.title)}</td><td>${got[x.n] ? got[x.n][0] + ' / ' + got[x.n][1] : '—'}</td></tr>`).join('')}</tbody></table></div>
        <p class="small muted">You can open any level at any time. Even if a level is easy, its test is a fast way to check yourself.</p>
        <p class="ar small" lang="ar">تقدري تفتحي أي مستوى في أي وقت.</p>
        <div class="row"><a class="btn primary" href="#/unit/${L.units[0].id}/lesson">Start Level ${level}</a><a class="btn" href="#/">See my path</a></div></div>`;
    }
    show();
  }

  /* ================= Words (spaced review) ================= */
  const BOXES = [0, 1, 3, 7, 16, 35];
  function cardInfo(w) {
    if (ALL_WORDS[w]) return ALL_WORDS[w];
    const m = S.myWords[w];
    return m ? { w, d: m.m || '(your saved word)', ex: m.ex, ar: '' } : null;
  }
  function dueCards() { const d = today(); return Object.keys(S.cards).filter(w => cardInfo(w) && S.cards[w].due <= d); }
  function viewWords(sub) {
    if (sub === 'review') return reviewSession();
    const due = dueCards();
    const known = Object.keys(S.cards).length;
    app.innerHTML = `${brand()}
      <div class="stack" style="gap:6px"><span class="eyebrow">Spaced review</span><h1>My words</h1>
      <p class="muted">Words come back right before you forget them. A few minutes a day is enough.</p></div>
      <div class="hero"><h2>${due.length ? `${due.length} word${due.length === 1 ? '' : 's'} ready to review` : 'Nothing to review right now'}</h2>
        <p>${known} words in your deck · ${Object.values(S.cards).filter(c => c.box >= 4).length} learned well</p>
        <div>${due.length ? '<a class="btn" href="#/words/review">Review now</a>' : '<span class="small">Finish a vocabulary lesson to add words.</span>'}</div></div>
      ${dueMisses().length ? `<a class="card flat spread" href="#/today/warm" style="text-decoration:none;color:inherit"><div><b>${dueMisses().length} question${dueMisses().length === 1 ? '' : 's'} you missed before</b><div class="small muted">They come back after 1, 3, 7, and 16 days until you know them.</div></div><span class="chip">Review</span></a>` : ''}
      ${Object.keys(S.myWords).length ? `<div class="card flat stack" style="gap:0"><h3>Words I saved</h3>${Object.entries(S.myWords).map(([w, m]) => `<div class="word-row"><b>${esc(w)}</b><div class="row" style="gap:6px">${speakBtn(w)}<button class="btn small ghost" data-delw="${esc(w)}">Remove</button></div><div class="d">${esc(m.m)}</div>${m.ex ? `<div class="e">“${esc(m.ex)}”</div>` : ''}</div>`).join('')}</div>` : ''}
      <div class="stack"><h2>All words</h2>
        <input class="input" id="wsearch" placeholder="Search a word" autocomplete="off">
        <div id="wlist"></div></div>`;
    app.querySelectorAll('[data-delw]').forEach(b => b.onclick = () => { delete S.myWords[b.dataset.delw]; delete S.cards[b.dataset.delw]; save(); viewWords(); });
    const list = document.getElementById('wlist');
    const draw = (q) => {
      q = (q || '').toLowerCase();
      list.innerHTML = LEVELS.map(L => {
        const ws = [].concat(...L.units.map(u => u.words || [])).filter(w => !q || w.w.toLowerCase().includes(q) || (w.d || '').toLowerCase().includes(q) || (w.ar || '').includes(q));
        if (!ws.length) return '';
        const inDeck = ws.filter(w => S.cards[w.w]).length;
        return `<div class="card flat stack" style="gap:0"><div class="spread"><h3>Level ${L.n}</h3>
          ${inDeck < ws.length ? `<button class="btn small" data-addlvl="${L.id}">Add all ${ws.length} to review</button>` : '<span class="chip good">In your deck</span>'}</div>
          ${ws.map(w => `<div class="word-row"><b>${esc(w.w)}</b>${speakBtn(w.w)}${S.settings.arabic && w.ar ? `<div class="ar" lang="ar">${esc(w.ar)}</div>` : ''}<div class="d">${md(w.d)}</div>${w.ex ? `<div class="e">“${esc(w.ex)}”</div>` : ''}</div>`).join('')}</div>`;
      }).join('') || '<p class="muted">No words match.</p>';
      list.querySelectorAll('[data-addlvl]').forEach(b => b.onclick = () => {
        const L = LEVEL[b.dataset.addlvl];
        L.units.forEach(u => (u.words || []).forEach(w => { if (!S.cards[w.w]) S.cards[w.w] = { box: 0, due: today() }; }));
        save(); toast('Added to your review deck.'); viewWords();
      });
    };
    draw();
    document.getElementById('wsearch').oninput = (e) => draw(e.target.value);
  }
  function reviewSession() {
    let queue = shuffle(dueCards()).slice(0, 20);
    let done = 0;
    app.innerHTML = `<a class="back" href="#/words">${I.back} My words</a><div id="rv" class="stack"></div>`;
    const box = document.getElementById('rv');
    const show = () => {
      if (!queue.length) {
        markStep('words');
        box.innerHTML = `<div class="card stack" style="text-align:center;align-items:center"><h2>Review finished</h2><p>You reviewed ${done} cards.</p><p class="ar" lang="ar">شاطرة! نكمّل بكرة.</p><a class="btn primary" href="#/today">Back to today's session</a></div>`;
        return;
      }
      const w = cardInfo(queue[0]);
      const flipFirst = Math.random() < 0.35 && w.ar;
      box.innerHTML = `<div class="qhead"><span class="eyebrow">${queue.length} left</span>${speakBtn(w.w)}</div>
        <div class="card flash" id="fl" tabindex="0" role="button" aria-label="Show answer">
          ${flipFirst ? `<div class="ar big" lang="ar" style="font-family:var(--f-ar)">${esc(w.ar)}</div><p class="muted">What is the English word?</p>` : `<div class="big">${esc(w.w)}</div><p class="muted">What does it mean?</p>`}
          <p class="small muted">Tap to see the answer</p></div>
        <div id="gr"></div>`;
      if (!flipFirst) say(w.w);
      const reveal = () => {
        const fl = document.getElementById('fl');
        fl.innerHTML = `<div class="big">${esc(w.w)}</div>${w.ar && S.settings.arabic ? `<div class="ar" lang="ar" style="font-size:1.3rem;color:var(--sun)">${esc(w.ar)}</div>` : ''}${/[\u0600-\u06FF]/.test(w.d) ? `<p class="ar" lang="ar" style="font-size:1.25rem">${esc(w.d)}</p>` : `<p>${md(w.d)}</p>`}${w.ex ? `<p class="muted" style="font-family:var(--f-read);font-style:italic">“${esc(w.ex)}”</p>` : ''}`;
        fl.onclick = null;
        if (flipFirst) say(w.w);
        document.getElementById('gr').innerHTML = `<div class="grade3"><button class="btn" data-g="0">I forgot</button><button class="btn" data-g="1">Hard</button><button class="btn primary" data-g="2">I knew it</button></div>`;
        document.querySelectorAll('[data-g]').forEach(b => b.onclick = () => {
          const g = +b.dataset.g; const c = S.cards[w.w];
          if (g === 0) { c.box = 0; c.due = today(); queue.push(queue.shift()); }
          else { c.box = g === 2 ? Math.min(BOXES.length - 1, c.box + 1) : Math.max(1, c.box); c.due = addDays(today(), BOXES[c.box] || 1); queue.shift(); done++; addXP(1); }
          save(); show();
        });
      };
      const fl = document.getElementById('fl');
      fl.onclick = reveal; fl.onkeydown = (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); reveal(); } };
    };
    show();
  }

  /* ================= Voice (recordings) ================= */
  async function viewVoice() {
    app.innerHTML = `${brand()}
      <div class="stack" style="gap:6px"><span class="eyebrow">Speaking</span><h1>Voice practice</h1>
      <p class="muted">Speak, listen, and practice real conversations. Your recordings stay on this phone so your son can listen and give stars.</p></div>
      <div class="quick">
        <a href="#/numbers" class="qk"><b>Numbers and spelling</b><span>Phone numbers, times, prices</span></a>
        <a href="#/phrases" class="qk"><b>Work phrasebook</b><span>Phrases for calls and meetings</span></a>
        <button class="qk" id="freeconv" type="button"><b>Talk with Claude</b><span>Free chat about your day</span></button>
        <a href="#/unit/${(() => { const L = LEVELS[Math.max(0, curLevelN() - 1)]; const t = L.units.find(u => u.kind === 'conversation'); return t ? t.id : LEVELS[0].units[1].id; })()}/lesson" class="qk"><b>Talk at Work</b><span>Your level's conversation</span></a>
      </div>
      <div class="card stack" id="jobbox"></div>
      <div class="stack" style="gap:8px"><h2>Read out loud</h2><div id="free"></div></div>
      <details class="card flat"><summary><b>How to practice with Claude voice</b></summary>
        <ol class="steps" style="margin-top:10px"><li>Tap a <b>Copy</b> button or <b>Claude voice coach</b>. It copies a message.</li><li>Open the Claude app and paste the message.</li><li>Tap the voice button and talk.</li><li>Claude plays the other person and gives you feedback at the end.</li></ol>
        <p class="ar small" lang="ar">دوسي «Copy» أو «Claude voice coach»، افتحي تطبيق Claude والزقي الرسالة، وبعدين دوسي على زرار الصوت واتكلمي.</p></details>
      <div class="stack"><h2>My recordings</h2><div id="recs"><p class="muted">Loading…</p></div></div>`;
    const free = document.getElementById('free');
    const drawFree = (text) => sayWidget(text, free, { unitId: 'free' });
    const starters = [].concat(...LEVELS.map(L => [].concat(...L.units.map(u => u.speak || []))));
    drawFree(pick(starters) || 'I practice English every day.');
    const extra = document.createElement('div');
    extra.className = 'row';
    extra.innerHTML = `<button class="btn small" id="newsent">Give me another sentence</button><button class="btn small ghost" id="mysent">Use my own sentence</button>`;
    free.after(extra);
    renderJobs(document.getElementById('jobbox'));
    document.getElementById('freeconv').onclick = () => {
      const L = S.placement ? LEVELS[S.placement.level - 1] : LEVELS[0];
      copy(claudeRoleplayPrompt(L, { setup: 'We are friendly coworkers on a lunch break. Ask me about my day, my family, my work, and my plans. Share a little about yourself too, so it feels like a real conversation.', role: 'a friendly coworker', goal: 'Have a natural 10-minute conversation and speak in full sentences.' }));
    };
    document.getElementById('newsent').onclick = () => drawFree(pick(starters));
    document.getElementById('mysent').onclick = () => {
      const c = document.createElement('div'); c.className = 'card stack';
      c.innerHTML = `<label class="field" for="own">Type or paste any English sentence<textarea class="input" id="own" style="min-height:90px"></textarea></label><button class="btn primary" id="useown">Practice this</button>`;
      extra.replaceWith(c);
      document.getElementById('useown').onclick = () => { const v = document.getElementById('own').value.trim(); if (v) { drawFree(v); c.remove(); free.after(extra); } };
    };
    let list = [];
    try { list = await Speech.allRecs(); } catch (e) { document.getElementById('recs').innerHTML = '<p class="muted">Recordings cannot be saved in this browser.</p>'; return; }
    const box = document.getElementById('recs');
    if (!box) return;
    if (!list.length) { box.innerHTML = '<p class="muted">No recordings yet. Tap <b>Record for grading</b> under any sentence.</p>'; return; }
    const urls = [];
    box.innerHTML = list.map(r => {
      const url = URL.createObjectURL(r.blob); urls.push(url);
      const u = UNIT[r.unitId];
      const g = r.grade || { stars: 0, note: '' };
      return `<div class="card stack" data-id="${r.id}">
        <div class="spread"><span class="eyebrow">${new Date(r.at).toLocaleString(undefined, { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}${u ? ' · ' + esc(u.title) : ''}</span>
          ${r.score !== null && r.score !== undefined ? `<span class="chip ${r.score >= 70 ? 'good' : 'bad'}">Auto ${r.score}%</span>` : ''}</div>
        <div class="say-text">${esc(r.text)}</div>
        <audio controls preload="metadata" src="${url}" style="width:100%"></audio>
        <div class="spread"><div><div class="small muted">Teacher's grade</div><div class="stars">${[1, 2, 3, 4, 5].map(n => `<button data-star="${n}" class="${g.stars >= n ? 'on' : ''}" aria-label="${n} stars">★</button>`).join('')}</div></div>
          <div class="row" style="gap:6px">${navigator.share ? '<button class="btn small" data-share>Send</button>' : ''}<button class="btn small ghost" data-del>Delete</button></div></div>
        <input class="input" data-note placeholder="Teacher's note (for example: practice the P sound)" value="${esc(g.note)}">
      </div>`;
    }).join('');
    onLeave(() => urls.forEach(u => URL.revokeObjectURL(u)));
    box.querySelectorAll('[data-id]').forEach(card => {
      const r = list.find(x => x.id === card.dataset.id);
      const persist = () => Speech.saveRec(r);
      card.querySelectorAll('[data-star]').forEach(b => b.onclick = () => {
        r.grade = r.grade || { stars: 0, note: '' }; r.grade.stars = +b.dataset.star; persist();
        card.querySelectorAll('[data-star]').forEach(x => x.classList.toggle('on', +x.dataset.star <= r.grade.stars));
        toast('Grade saved.');
      });
      card.querySelector('[data-note]').onchange = (e) => { r.grade = r.grade || { stars: 0, note: '' }; r.grade.note = e.target.value; persist(); toast('Note saved.'); };
      const sh = card.querySelector('[data-share]');
      if (sh) sh.onclick = async () => {
        const ext = (r.blob.type.includes('mp4') ? 'm4a' : r.blob.type.includes('ogg') ? 'ogg' : 'webm');
        const file = new File([r.blob], `sekka-reading.${ext}`, { type: r.blob.type });
        try {
          if (navigator.canShare && navigator.canShare({ files: [file] })) await navigator.share({ files: [file], title: 'My English reading', text: `Please grade my reading: "${r.text}"` });
          else await navigator.share({ title: 'My English reading', text: `I read: "${r.text}"` });
        } catch (e) {}
      };
      const del = card.querySelector('[data-del]');
      del.onclick = () => {
        if (del.dataset.sure) { Speech.deleteRec(r.id).then(() => card.remove()); return; }
        del.dataset.sure = '1'; del.textContent = 'Tap again to delete'; del.classList.add('confirm');
        setTimeout(() => { if (del.isConnected) { delete del.dataset.sure; del.textContent = 'Delete'; del.classList.remove('confirm'); } }, 3000);
      };
    });
  }

  /* ================= Me ================= */
  function viewMe() {
    const days = [];
    for (let k = 6; k >= 0; k--) { const d = addDays(today(), -k); days.push([d, S.days[d] || 0]); }
    const max = Math.max(S.settings.goal, ...days.map(d => d[1]));
    const passed = LEVELS.filter(L => S.tests[L.id] && S.tests[L.id].passed);
    const voices = Speech.voices();
    const installed = !!(window.matchMedia && window.matchMedia('(display-mode: standalone)').matches) || navigator.standalone === true;
    app.innerHTML = `${brand()}
      <div class="stack" style="gap:6px"><span class="eyebrow">Profile</span><h1>${esc(S.name || 'Me')}</h1></div>
      <div class="stats">
        <div class="stat"><b>${S.xp}</b><span>Points</span></div>
        <div class="stat"><b>${streakNow()}</b><span>Day streak</span></div>
        <div class="stat"><b>${Object.keys(S.cards).length}</b><span>Words in deck</span></div>
      </div>
      <div class="card stack"><div class="spread"><h3>This week</h3><span class="small muted">points per day</span></div>
        <div class="week">${days.map(([d, v]) => `<div><i style="height:${Math.max(3, v / max * 70)}px" title="${v} points"></i><span>${new Date(d + 'T12:00:00').toLocaleDateString(undefined, { weekday: 'short' })}</span></div>`).join('')}</div></div>
      <a class="card flat spread" href="#/writing" style="text-decoration:none;color:inherit"><div><b>My writing</b><div class="small muted">${(n => n === 1 ? '1 piece saved' : n + ' pieces saved')(Object.values(S.writing).filter(t => t && t.trim()).length)}</div></div><span class="chip">Open</span></a>
      <a class="card flat spread" href="#/progress" style="text-decoration:none;color:inherit"><div><b>My progress</b><div class="small muted">Units mastered, words learned, reading speed</div></div><span class="chip">Open</span></a>
      <a class="card flat spread" href="#/method" style="text-decoration:none;color:inherit"><div><b>How Sekka teaches, and how family can help</b><div class="small muted">The learning methods behind the app</div></div><span class="chip">Read</span></a>
      <div class="card stack"><h3>Weekly report for family</h3>
        <p class="small muted">A short summary of this week to send to your son or whoever helps you study.</p>
        <div class="row"><button class="btn small primary" id="rep-send">Send weekly report</button><button class="btn small ghost" id="rep-show">Show it</button></div>
        <pre class="report" id="rep-out" hidden></pre></div>
      <div class="card stack"><h3>Certificates</h3>
        ${passed.length ? passed.map(L => `<a class="unit-link" href="#/cert/${L.id}"><span class="k">${I.test}</span><span class="t"><b>Level ${L.n}: ${esc(L.title)}</b><span>${S.tests[L.id].best}%</span></span><span class="chip gold">View</span></a>`).join('') : '<p class="muted">Pass a level test to earn your first certificate.</p>'}</div>
      <h2 style="margin-top:8px">Settings and phone</h2>
      <details class="card stack" id="set-box"><summary><b>Settings</b> <span class="small muted">text size, Arabic help, voice, job</span></summary>
        <label class="field" for="s-name">Name<input class="input" id="s-name" value="${esc(S.name)}"></label>
        <label class="field" for="s-job">My job <span class="small muted">(used in conversation role-plays)</span><input class="input" id="s-job" value="${esc(S.settings.job)}" placeholder="For example: medical assistant"></label>
        <div class="switch"><span>Text size</span><select class="input" id="s-size" style="width:auto">${[['m', 'Normal'], ['l', 'Large'], ['xl', 'Extra large']].map(([v, n]) => `<option value="${v}" ${S.settings.size === v ? 'selected' : ''}>${n}</option>`).join('')}</select></div>
        <div class="switch"><span>Arabic help <span class="ar small muted" lang="ar">الشرح بالعربي</span></span><input type="checkbox" id="s-ar" ${S.settings.arabic ? 'checked' : ''} style="width:24px;height:24px;accent-color:var(--nile)"></div>
        <div class="switch"><span>Daily goal</span><select class="input" id="s-goal" style="width:auto">${[20, 30, 50, 80].map(v => `<option value="${v}" ${S.settings.goal === v ? 'selected' : ''}>${v} points</option>`).join('')}</select></div>
        <div class="switch"><span>Theme</span><select class="input" id="s-theme" style="width:auto">${[['', 'Match phone'], ['light', 'Light'], ['dark', 'Dark']].map(([v, n]) => `<option value="${v}" ${S.settings.theme === v ? 'selected' : ''}>${n}</option>`).join('')}</select></div>
        <label class="field" for="s-rate">Reading voice speed: <span id="rate-v">${S.settings.rate}</span><input type="range" id="s-rate" min="0.5" max="1.2" step="0.05" value="${S.settings.rate}"></label>
        ${voices.length ? `<label class="field" for="s-voice">Voice<select class="input" id="s-voice"><option value="">Automatic</option>${voices.map(v => `<option ${S.settings.voice === v.name ? 'selected' : ''}>${esc(v.name)}</option>`).join('')}</select></label>` : ''}
        <button class="btn small" data-say="Hello! I am learning English, and I am doing a great job.">${I.speak} Test the voice</button>
      </details>
      ${installed ? '' : `<details class="card stack"><summary><b>Install on the phone</b> <span class="small muted">use it like an app</span></summary>
        <p><b>Android (Chrome):</b> tap the ⋮ menu, then <b>Add to Home screen</b> or <b>Install app</b>.</p>
        <p><b>iPhone (Safari):</b> tap the Share button, then <b>Add to Home Screen</b>.</p>
        <p class="ar small" lang="ar">من كروم: دوسي على التلات نقط ⋮ وبعدين «إضافة للشاشة الرئيسية». هيبقى زي التطبيق بالظبط.</p></details>`}
      <details class="card stack"><summary><b>Backup</b> <span class="small muted">move progress to a new phone</span></summary>
        <p class="small muted">Progress is saved on this phone. Copy a backup code to move it to another phone or keep it safe.</p>
        <div class="row"><button class="btn small" id="bk-copy">${I.copy} Copy backup code</button><button class="btn small ghost" id="bk-show">Restore from code</button></div>
        <div id="bk-area"></div>
        <div class="row"><button class="btn small ghost" id="reset" style="color:var(--bad)">Erase all progress</button></div>
        <p class="small muted">Recordings stay on this phone only and are not in the backup code.</p>
      </details>`;
    const set = (k, v) => { S.settings[k] = v; save(); applySettings(); };
    document.getElementById('rep-show').onclick = async () => { const o = document.getElementById('rep-out'); o.textContent = await weeklyReport(); o.hidden = false; };
    document.getElementById('rep-send').onclick = async () => {
      const text = await weeklyReport();
      if (navigator.share) { try { await navigator.share({ title: 'Sekka English weekly report', text }); return; } catch (e) { if (e && e.name === 'AbortError') return; } }
      copy(text, 'Report copied. Paste it in a message.');
    };
    document.getElementById('s-name').onchange = (e) => { S.name = e.target.value.trim() || S.name; save(); };
    document.getElementById('s-job').onchange = (e) => set('job', e.target.value.trim());
    document.getElementById('s-size').onchange = (e) => set('size', e.target.value);
    document.getElementById('s-ar').onchange = (e) => set('arabic', e.target.checked);
    document.getElementById('s-goal').onchange = (e) => set('goal', +e.target.value);
    document.getElementById('s-theme').onchange = (e) => set('theme', e.target.value);
    document.getElementById('s-rate').oninput = (e) => { set('rate', +e.target.value); document.getElementById('rate-v').textContent = e.target.value; };
    const sv = document.getElementById('s-voice'); if (sv) sv.onchange = (e) => set('voice', e.target.value);
    document.getElementById('bk-copy').onclick = () => copy('SEKKA1:' + btoa(unescape(encodeURIComponent(JSON.stringify(S)))), 'Backup code copied. Keep it somewhere safe.');
    document.getElementById('bk-show').onclick = () => {
      const a = document.getElementById('bk-area');
      a.innerHTML = `<textarea class="input" id="bk-in" style="min-height:90px" placeholder="Paste the backup code"></textarea><button class="btn primary small" id="bk-go">Restore</button>`;
      document.getElementById('bk-go').onclick = () => {
        try {
          const v = document.getElementById('bk-in').value.trim().replace(/^SEKKA1:/, '');
          const obj = JSON.parse(decodeURIComponent(escape(atob(v))));
          S = Object.assign(fresh(), obj); S.settings = Object.assign(fresh().settings, obj.settings || {}); save(); applySettings();
          toast('Progress restored.'); location.hash = '#/';
        } catch (e) { toast('That code did not work. Copy the whole code and try again.'); }
      };
    };
    const rs = document.getElementById('reset');
    rs.onclick = () => {
      if (rs.dataset.sure) { localStorage.removeItem(KEY); S = fresh(); save(); location.hash = '#/'; route(); return; }
      rs.dataset.sure = '1'; rs.textContent = 'Tap again to erase everything'; rs.classList.add('confirm');
      setTimeout(() => { if (rs.isConnected) { delete rs.dataset.sure; rs.textContent = 'Erase all progress'; rs.classList.remove('confirm'); } }, 4000);
    };
  }


  /* ================= Conversation: dialogues and role-plays ================= */
  function twoVoices() {
    const en = Speech.voices();
    const main = Speech.pickVoice(S.settings.voice);
    const other = en.find(v => v !== main && /en[-_]US/i.test(v.lang)) || en.find(v => v !== main) || null;
    return { A: other ? { voiceObj: other } : { voiceObj: main, pitch: 1.25 }, B: { voiceObj: main, pitch: 0.95 } };
  }
  function renderDialogue(u, box) {
    const all = [u.dialogue].concat(u.dialogues || []).filter(Boolean);
    box.innerHTML = all.map((_, i) => `<div class="stack" data-dlg="${i}"></div>`).join('');
    all.forEach((d, i) => renderOneDialogue(d, box.querySelector(`[data-dlg="${i}"]`), i));
  }
  function renderOneDialogue(d, box, idx) {
    const me = d.me;
    box.innerHTML = `<h3>${idx ? 'Another conversation' : 'Listen to the conversation'}: ${esc(d.title)}</h3>
      ${idx ? '' : '<p class="small muted">First listen to the whole conversation. Then practice it: the app plays the other person, and you say your lines out loud.</p>'}
      <div class="card stack" id="dlg">
        ${d.lines.map(([w, t], k) => `<div class="dl ${w === me ? 'mine' : ''}" data-l="${k}"><span class="who">${esc(d.roles[w])}</span><span class="line">${esc(t)}</span></div>`).join('')}
        <div class="row"><button class="btn" id="dl-all">${I.speak} Listen to all</button><button class="btn primary" id="dl-me">${I.mic} Practice my part</button><button class="btn ghost small" id="dl-stop" hidden>Stop</button></div>
        <div class="status small muted" id="dl-st" aria-live="polite"></div>
      </div>`;
    const rows = box.querySelectorAll('.dl'), st = box.querySelector('#dl-st'), stopB = box.querySelector('#dl-stop');
    let run = 0;
    const live = (r) => r === run && box.isConnected;
    const mark = (k, cls) => rows.forEach(x => x.classList.toggle(cls, +x.dataset.l === k));
    const clear = () => rows.forEach(x => x.classList.remove('hl', 'turn', 'ok', 'miss'));
    const voices = twoVoices();
    const speakLine = (w, t) => Speech.sayP(t, Object.assign({ rate: S.settings.rate }, voices[w]));
    const playAll = async () => {
      const r = ++run; clear(); stopB.hidden = false;
      for (let k = 0; k < d.lines.length && live(r); k++) { mark(k, 'hl'); await speakLine(d.lines[k][0], d.lines[k][1]); }
      if (live(r)) { clear(); st.textContent = 'Now try "Practice my part."'; stopB.hidden = true; }
    };
    const practice = async () => {
      const r = ++run; clear(); stopB.hidden = false; let scores = [];
      for (let k = 0; k < d.lines.length && live(r); k++) {
        const [w, t] = d.lines[k];
        if (w !== me) { mark(k, 'hl'); st.textContent = 'Listen…'; await speakLine(w, t); continue; }
        mark(k, 'turn');
        if (Speech.canHear) {
          st.textContent = 'Your turn. Say your line now.';
          try {
            const alts = await Speech.listen();
            if (!live(r)) break;
            const res = Speech.best(t, alts); scores.push(res.score);
            rows[k].classList.add(res.score >= 70 ? 'ok' : 'miss');
            st.textContent = `${res.score}%${res.heard ? ' · I heard: “' + res.heard + '”' : ''}`;
            await new Promise(x => setTimeout(x, 700));
          } catch (e) { st.textContent = 'I could not hear you. Keep going.'; await new Promise(x => setTimeout(x, 1500)); }
        } else {
          st.textContent = 'Your turn. Say your line out loud.';
          await new Promise(x => setTimeout(x, 1500 + t.split(/\s+/).length * 550));
        }
      }
      if (live(r)) {
        rows.forEach(x => x.classList.remove('hl', 'turn'));
        stopB.hidden = true; addXP(5); markStep('speak');
        const avg = scores.length ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : null;
        st.textContent = avg !== null ? `Conversation finished. Average: ${avg}%. Practice it again until it feels natural.` : 'Conversation finished. Practice it again until it feels natural.';
      }
    };
    box.querySelector('#dl-all').onclick = playAll;
    box.querySelector('#dl-me').onclick = practice;
    stopB.onclick = () => { run++; Speech.cancel(); Speech.stopListening(); clear(); stopB.hidden = true; st.textContent = ''; };
    onLeave(() => { run++; Speech.cancel(); Speech.stopListening(); });
  }
  function claudeRoleplayPrompt(L, rp) {
    const job = S.settings.job ? `I work as ${S.settings.job}.` : 'I work in an American workplace.';
    return `Let's do a speaking role-play in voice mode. I'm an adult English learner, and my first language is Egyptian Arabic. My level is about ${L.cefr} (${L.grade}). ${job}

Scenario: ${rp.setup}
You play: ${rp.role}.
My goal: ${rp.goal}

Rules:
- Stay in character and talk like a real person at work. Keep your sentences at my level and speak a little slowly.
- Don't stop to correct me during the conversation. If I make a mistake, just repeat my idea back correctly in your reply, the way a native speaker naturally would.
- If I'm stuck, give me a hint with a useful phrase.
- After about 8–10 exchanges, step out of the role and give me feedback: 3 things I did well, 3 useful phrases I should learn (with examples), and my 2 most important grammar or pronunciation mistakes. Explain briefly in Egyptian Arabic if I seem confused.
- Then offer to do the role-play again so I can improve.

Start now by saying your first line in character.`;
  }
  function renderRoleplays(u, box) {
    const L = u.level;
    box.innerHTML = `<p class="small"><a href="#/phrases">All work phrases in one list →</a> · <a href="#/numbers">Numbers and spelling drill →</a></p><h3>Real conversation practice with Claude</h3>
      <p class="small muted">Tap a scenario to copy it. Open the Claude app, paste it, then tap the voice button and talk. Claude plays the other person and gives you feedback at the end.</p>
      ${S.settings.arabic ? '<p class="ar small" lang="ar">دوسي على الموقف، افتحي تطبيق Claude والزقي الرسالة، ودوسي على زرار الصوت واتكلمي. Claude هيمثّل الشخص التاني ويقولك رأيه في الآخر.</p>' : ''}
      ${S.settings.job ? '' : '<p class="small">Tip: add your job in <a href="#/me">Me → Settings</a> so the conversations match your workplace.</p>'}
      <div class="units">${u.roleplays.map((rp, k) => `<button class="unit-link" data-rp="${k}" style="text-align:left;cursor:pointer;font:inherit"><span class="k">${I.speaking}</span><span class="t"><b>${esc(rp.title)}</b><span>${esc(rp.goal)}</span></span><span class="chip">Copy</span></button>`).join('')}</div>`;
    box.querySelectorAll('[data-rp]').forEach(b => b.onclick = () => { copy(claudeRoleplayPrompt(L, u.roleplays[+b.dataset.rp])); addXP(5); markStep('speak'); });
  }

  /* ================= Story library (extensive reading) ================= */
  function curLevelN() {
    const n = nextStep();
    if (n && n.u) return n.u.level.n;
    if (n) return LEVEL[n.href.split('/')[2]] ? LEVEL[n.href.split('/')[2]].n : 1;
    return S.placement ? S.placement.level : LEVELS.length;
  }
  function storyOfDay() {
    if (!STORIES.length) return null;
    if (S.storyDay.date === today() && STORY[S.storyDay.id]) return STORY[S.storyDay.id];
    const lv = curLevelN();
    const fits = STORIES.filter(x => x.lvl <= lv);
    const unread = fits.filter(x => !S.read[x.id]).sort((a, b) => Math.abs(lv - a.lvl) - Math.abs(lv - b.lvl) || b.lvl - a.lvl);
    const pickS = unread[0] || pick(fits.length ? fits : STORIES);
    S.storyDay = { date: today(), id: pickS.id }; save();
    return pickS;
  }
  function storyCard() {
    const st = storyOfDay();
    if (!st) return '';
    const r = S.read[st.id];
    const words = st.text.split(/\s+/).length;
    return `<a class="card flat spread" href="#/story/${st.id}" style="text-decoration:none;color:inherit">
      <div><span class="eyebrow">Story of the day · Level ${st.lvl}</span><div><b>${esc(st.title)}</b></div>
      <div class="small muted">${words} words · about ${Math.max(2, Math.round(words / 90))} min${r ? ' · read ' + r.n + (r.n === 1 ? ' time' : ' times') : ''}</div></div>
      <span class="chip">${r ? 'Read again' : 'Read'}</span></a>`;
  }
  function viewStories() {
    const lv = curLevelN();
    app.innerHTML = `<a class="back" href="#/">${I.back} Home</a>
      <div class="stack" style="gap:6px"><span class="eyebrow">Reading for pleasure</span><h1>Story library</h1>
      <p class="muted">Reading a lot of easy, interesting English is one of the best ways to learn. Pick stories at your level or a little below. Tap any word to hear it and see its meaning.</p>
      <p class="ar small muted" lang="ar">اقري حكايات سهلة وممتعة كتير. ده من أحسن الطرق لتعلم اللغة. دوسي على أي كلمة عشان تسمعيها وتعرفي معناها.</p></div>
      ${LEVELS.map(L => {
        const list = STORIES.filter(x => x.lvl === L.n);
        if (!list.length) return '';
        return `<div class="stack"><div class="spread"><h3>Level ${L.n}: ${esc(L.title)}</h3>${L.n === lv ? '<span class="chip gold">Your level</span>' : ''}</div>
          <div class="units">${list.map(st => { const r = S.read[st.id]; return `<a class="unit-link" href="#/story/${st.id}"><span class="k">${I.reading}</span><span class="t"><b>${esc(st.title)}</b><span>${st.text.split(/\s+/).length} words</span></span>${r ? `<span class="chip good">Read ${r.n}×</span>` : '<span class="chip plain">New</span>'}</a>`; }).join('')}</div></div>`;
      }).join('')}`;
  }
  function viewStory(st) {
    const r = S.read[st.id];
    const sentences = (p) => (p.match(/[^.!?]+[.!?]+["”’']?\s*|[^.!?]+$/g) || [p]).map(x => x.trim()).filter(Boolean);
    app.innerHTML = `<a class="back" href="#/stories">${I.back} Story library</a>
      <div class="stack" style="gap:6px"><span class="eyebrow">Level ${st.lvl} story${r ? ` · read ${r.n}×` : ''}</span><h1>${esc(st.title)}</h1></div>
      <div class="row"><button class="btn" id="st-all">${I.speak} Listen to the story</button><button class="btn ghost small" id="st-stop" hidden>Stop</button></div>
      <div class="card reading story" id="st-text">${st.text.split(/\n\n+/).map(p => `<p>${sentences(p).map(x => `<span class="sent" data-sent="${esc(x)}">${wrapWords(x)}</span>`).join(' ')}</p>`).join('')}</div>
      <p class="small muted">Tap any word to hear it and see what it means. Read once for the meaning first. Don't stop for every new word: guess from the story.</p>
      <div id="st-q" class="stack"><button class="btn primary" id="st-check">I finished reading · Quick check</button></div>`;
    const sents = [...app.querySelectorAll('.sent')];
    let run = 0;
    const stopB = document.getElementById('st-stop');
    document.getElementById('st-all').onclick = async () => {
      const me = ++run; stopB.hidden = false;
      for (const el of sents) {
        if (me !== run || !el.isConnected) break;
        sents.forEach(x => x.classList.toggle('hl', x === el));
        await Speech.sayP(el.dataset.sent, { rate: S.settings.rate, voice: S.settings.voice });
      }
      sents.forEach(x => x.classList.remove('hl')); stopB.hidden = true;
    };
    stopB.onclick = () => { run++; Speech.cancel(); sents.forEach(x => x.classList.remove('hl')); stopB.hidden = true; };
    onLeave(() => { run++; Speech.cancel(); });
    document.getElementById('st-check').onclick = () => {
      const box = document.getElementById('st-q');
      runSet({ box, items: st.qs.slice(), mode: 'story', track: false, onFinish: (res) => {
        const rec = S.read[st.id] || { n: 0 };
        rec.n++; rec.last = today(); rec.best = Math.max(rec.best || 0, res.pct);
        S.read[st.id] = rec; addXP(10); save();
        const lvStories = STORIES.filter(x => x.lvl === st.lvl);
        const nx = lvStories[(lvStories.indexOf(st) + 1) % lvStories.length];
        box.innerHTML = `<div class="card stack"><h3>${res.right} of ${res.counted} correct</h3>
          <p>${res.pct >= 67 ? 'You understood the story. Great reading!' : 'Read the story one more time, then try the questions again.'}</p>
          <p class="ar small" lang="ar">${res.pct >= 67 ? 'فهمتي القصة. برافو!' : 'اقري القصة تاني وجرّبي الأسئلة.'}</p>
          <div class="row">${nx && nx !== st ? `<a class="btn primary" href="#/story/${nx.id}">Next story: ${esc(nx.title)}</a>` : ''}<a class="btn" href="#/stories">Story library</a></div></div>`;
      } });
    };
  }

  /* ================= Tap-a-word ================= */
  function wrapWords(text) {
    return String(text).split(/([A-Za-z][A-Za-z'’]*(?:-[A-Za-z]+)*)/).map((t, k) => k % 2 ? `<span class="w">${esc(t)}</span>` : md(t)).join('');
  }
  function lookupWord(raw) {
    const w = raw.toLowerCase().replace(/[’]/g, "'").replace(/'s$/, '');
    const tries = [w, w.replace(/ies$/, 'y'), w.replace(/es$/, ''), w.replace(/s$/, ''), w.replace(/ied$/, 'y'), w.replace(/ed$/, ''), w.replace(/d$/, ''), w.replace(/ing$/, ''), w.replace(/ing$/, 'e'), w.replace(/ly$/, '')];
    for (const t of tries) { if (ALL_WORDS[t]) return { key: t, info: ALL_WORDS[t] }; if (S.myWords[t]) return { key: t, info: cardInfo(t) }; }
    return { key: w, info: null };
  }
  function sentenceAround(el) {
    const p = el.closest('p');
    if (!p) return '';
    const parts = p.textContent.match(/[^.!?]+[.!?]*/g) || [];
    const word = el.textContent;
    return (parts.find(x => x.includes(word)) || '').trim();
  }
  function closeSheet() { const sh = document.getElementById('sheet'); if (sh) sh.remove(); }
  function openWordSheet(el) {
    closeSheet();
    const raw = el.textContent;
    const found = lookupWord(raw);
    const key = found.key, info = examMode ? null : found.info;
    const shown = found.info ? key : raw.replace(/['’]s$/, '');
    const sentEl = el.closest('[data-sent]');
    const sentence = sentEl ? sentEl.dataset.sent : sentenceAround(el);
    const inDeck = !!S.cards[key];
    const sh = document.createElement('div');
    sh.id = 'sheet'; sh.className = 'sheet'; sh.setAttribute('role', 'dialog'); sh.setAttribute('aria-label', 'Word: ' + key);
    sh.innerHTML = `<div class="sheet-in stack">
      <div class="spread"><div class="row" style="gap:8px"><b class="big-w">${esc(shown)}</b>${speakBtn(shown, 'Hear the word')}</div><button class="icon-btn" id="sh-x" aria-label="Close">✕</button></div>
      ${examMode ? '<p class="small muted">Meanings are hidden during quizzes and tests. Use the sentence to guess.</p>' : info ? `${info.ar && S.settings.arabic ? `<div class="ar" lang="ar" style="color:var(--sun);font-size:1.15rem">${esc(info.ar)}</div>` : ''}<div>${md(info.d)}</div>${info.ex ? `<div class="muted" style="font-family:var(--f-read);font-style:italic">“${esc(info.ex)}”</div>` : ''}`
        : `<p class="small muted">This word is not in your lessons yet. Guess the meaning from the sentence, then write it here to save it.</p>
           <input class="input" id="sh-m" placeholder="Meaning in Arabic or English" autocomplete="off">`}
      ${sentence ? `<div class="row" style="gap:8px"><button class="btn small" id="sh-sent">${I.speak} Hear the sentence</button></div>` : ''}
      ${examMode ? '' : `<div class="row">${inDeck ? '<span class="chip good">In your review deck</span>' : `<button class="btn primary small" id="sh-save">Save to my words</button>`}</div>`}
    </div>`;
    document.body.appendChild(sh);
    say(key);
    sh.querySelector('#sh-x').onclick = closeSheet;
    sh.onclick = (e) => { if (e.target === sh) closeSheet(); };
    const sb = sh.querySelector('#sh-sent'); if (sb) sb.onclick = () => say(sentence);
    const sv = sh.querySelector('#sh-save');
    if (sv) sv.onclick = () => {
      if (!info) {
        const m = sh.querySelector('#sh-m').value.trim();
        if (!m) { sh.querySelector('#sh-m').focus(); toast('Write what you think it means first.'); return; }
        S.myWords[key] = { m, ex: sentence, added: today() };
      }
      S.cards[key] = { box: 0, due: today() };
      save(); addXP(2); toast('Saved. It will come back in your word review.'); closeSheet();
    };
    const mi = sh.querySelector('#sh-m'); if (mi) setTimeout(() => mi.focus({ preventScroll: true }), 50);
  }
  document.addEventListener('click', (e) => {
    const w = e.target.closest('.w');
    if (w) { e.preventDefault(); e.stopPropagation(); openWordSheet(w); }
  }, true);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeSheet();
    const w = e.target.closest && e.target.closest('.w');
    if (w && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); openWordSheet(w); }
  });
  window.addEventListener('hashchange', closeSheet);

  /* ================= Weekly report ================= */
  async function weeklyReport() {
    const days = []; for (let k = 6; k >= 0; k--) days.push(addDays(today(), -k));
    const active = days.filter(d => (S.days[d] || 0) > 0).length;
    const pts = days.reduce((a, d) => a + (S.days[d] || 0), 0);
    const passedWeek = UNIT_ORDER.filter(u => S.units[u.id] && S.units[u.id].passed && S.units[u.id].passed >= days[0]);
    const testsWeek = LEVELS.filter(L => S.tests[L.id] && S.tests[L.id].passed && S.tests[L.id].date >= days[0]);
    const deck = Object.keys(S.cards).length, strong = Object.values(S.cards).filter(c => c.box >= 3).length;
    const storiesWeek = Object.values(S.read).filter(r => r.last >= days[0]).length;
    const flu = Object.values(S.fluency).map(h => h.filter(x => x.d >= days[0])).filter(h => h.length);
    let ungraded = 0;
    try { ungraded = (await Speech.allRecs()).filter(r => !r.grade || !r.grade.stars).length; } catch (e) {}
    const next = nextStep();
    const fmt = (d) => new Date(d + 'T12:00:00').toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
    const lines = [
      `Sekka English: weekly report for ${S.name}`,
      `${fmt(days[0])} – ${fmt(days[6])}`,
      '',
      `Days practiced: ${active} of 7 (streak: ${streakNow()} day${streakNow() === 1 ? '' : 's'})`,
      `Points this week: ${pts}`,
      `Units passed this week: ${passedWeek.length ? passedWeek.map(u => `L${u.level.n} ${u.title}`).join('; ') : 'none yet'}`,
      testsWeek.length ? `Level tests passed: ${testsWeek.map(L => 'Level ' + L.n).join(', ')}` : null,
      `Words in review deck: ${deck} (${strong} learned well)`,
      `Stories read this week: ${storiesWeek}`,
      flu.length ? `Timed reading: ${flu.map(h => `${h[0].wcpm}→${h[h.length - 1].wcpm} wpm`).join(', ')}` : null,
      `Old mistakes waiting for review: ${dueMisses().length}`,
      `Recordings waiting for your grade: ${ungraded}`,
      next ? `Working on now: ${next.title} (${next.sub})` : 'Working on now: all levels finished',
      '',
      'How you can help this week:',
      ungraded ? `- Open the Voice tab on her phone and grade her ${ungraded} recording${ungraded === 1 ? '' : 's'}. Give one thing to fix.` : '- Ask her to record one sentence for you to grade on the Voice tab.',
      active < 4 ? '- Help her pick a fixed daily time for the 20-minute session (for example, right after morning tea).' : '- Tell her you noticed she practiced most days this week. Specific praise keeps the habit going.',
      '- Ask her: "What did you learn this week? Teach me."',
      '- Speak only English with her for 10 minutes a day about real things.'
    ].filter(x => x !== null);
    return lines.join('\n');
  }

  /* ================= Work phrasebook ================= */
  function phrasebook() {
    const groups = [];
    LEVELS.forEach(L => L.units.filter(u => u.kind === 'conversation').forEach(u => {
      let cur = null;
      (u.lesson || []).forEach(b => {
        if (b.h) { cur = { level: L.n, unit: u, title: b.h, items: [] }; groups.push(cur); }
        else if (b.ex && cur) b.ex.forEach(x => { const t = x.replace(/\*+/g, '').replace(/^(Situation|Task|Action|Result|Context|Request|Benefit|Flexibility): /, '').replace(/\s*\((context|request|benefit|flexibility|reason|time|plan|plan made|decision now|promise)\)\s*$/i, ''); if (!/^\d\./.test(t)) cur.items.push(t); });
        else if (b.table && cur && /Polite|Formal/i.test(b.table[0].join(' '))) {
          const col = b.table[0].findIndex(c => /Polite|Formal/i.test(c));
          b.table.slice(1).forEach(r => cur.items.push(r[col].replace(/\*+/g, '')));
        }
      });
    }));
    return groups.filter(g => g.items.length);
  }
  function viewPhrases() {
    const groups = phrasebook();
    app.innerHTML = `<a class="back" href="#/voice">${I.back} Voice</a>
      <div class="stack" style="gap:6px"><span class="eyebrow">Talk at Work</span><h1>Work phrasebook</h1>
      <p class="muted">Every phrase from the Talk at Work lessons in one place. Look here before a phone call, a meeting, or a hard conversation. Tap to hear it.</p>
      <p class="ar small muted" lang="ar">كل جمل الشغل في مكان واحد. بصّي هنا قبل مكالمة أو اجتماع.</p></div>
      <input class="input" id="ph-q" placeholder="Search, for example: sick, meeting, phone" autocomplete="off">
      <div id="ph-list" class="stack"></div>`;
    const list = document.getElementById('ph-list');
    const draw = (q) => {
      q = (q || '').toLowerCase().trim();
      const html = groups.map(g => {
        const items = g.items.filter(x => !q || x.toLowerCase().includes(q) || g.title.toLowerCase().includes(q) || g.unit.title.toLowerCase().includes(q));
        if (!items.length) return '';
        return `<div class="stack" style="gap:8px"><div class="spread"><h3>${esc(g.title)}</h3><a class="small" href="#/unit/${g.unit.id}/lesson">Level ${g.level}</a></div>
          <div class="ex">${items.map(x => `<div class="ex-line"><span>${esc(x)}</span>${speakBtn(x)}</div>`).join('')}</div></div>`;
      }).join('');
      list.innerHTML = html || '<p class="muted">No phrases match. Try a simpler word.</p>';
    };
    draw();
    document.getElementById('ph-q').oninput = (e) => draw(e.target.value);
  }

  /* ================= Numbers, times, prices, spelling ================= */
  const NUM_WORDS = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];
  const TENS = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];
  const rnd = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
  const n2w = (n) => n < 20 ? NUM_WORDS[n] : TENS[Math.floor(n / 10)] + (n % 10 ? '-' + NUM_WORDS[n % 10] : '');
  const digitsOnly = (v) => String(v).replace(/\D/g, '');
  const GEN = {
    phone() {
      const area = String(rnd(201, 989));
      const d = String(rnd(200, 989)) + String(rnd(0, 9999)).padStart(4, '0');
      const spoken = (str) => str.split('').map(c => (c === '0' && Math.random() < 0.3) ? 'oh' : NUM_WORDS[+c]).join(' ');
      return {
        t: 'num', q: 'Type the phone number you hear.', ph: 'Example: 973 555 0142', numeric: true,
        say: `${spoken(area)}. ${spoken(d.slice(0, 3))}. ${spoken(d.slice(3))}.`,
        a: `(${area}) ${d.slice(0, 3)}-${d.slice(3)}`,
        check: (v) => digitsOnly(v) === area + d,
        why: 'Americans say phone numbers in groups: 3 digits, 3 digits, then 4. "Oh" sometimes means zero.'
      };
    },
    time() {
      const h = [7, 8, 9, 10, 11, 12, 1, 2, 3, 4, 5][rnd(0, 10)], m = [0, 5, 10, 15, 20, 30, 40, 45, 50][rnd(0, 8)];
      const mins = m === 0 ? "o'clock" : m < 10 ? 'oh ' + NUM_WORDS[m] : n2w(m);
      const mm = String(m).padStart(2, '0');
      return {
        t: 'num', q: 'Type the appointment time you hear (like 3:45).', ph: 'Example: 3:45', numeric: true,
        say: `Your appointment is at ${n2w(h)} ${mins} ${h >= 7 && h <= 11 ? 'in the morning' : 'in the afternoon'}.`,
        a: `${h}:${mm}`,
        check: (v) => digitsOnly(v) === `${h}${mm}` || (m === 0 && digitsOnly(v) === String(h)),
        why: '"Oh five" means :05. "O\'clock" means :00.'
      };
    },
    price() {
      const d = rnd(1, 99), c = [0, 25, 50, 75, 99, 10][rnd(0, 5)];
      const said = `${n2w(d)} dollar${d === 1 ? '' : 's'}` + (c ? ` and ${n2w(c)} cents` : '');
      return {
        t: 'num', q: 'Type the price you hear.', ph: 'Example: 12.50', numeric: true,
        say: `That will be ${said}.`, a: `$${d}.${String(c).padStart(2, '0')}`,
        check: (v) => { const x = parseFloat(String(v).replace(/[^0-9.]/g, '')); return Math.abs(x - (d + c / 100)) < 0.001; }
      };
    },
    teens() {
      const n = rnd(3, 9), teen = 10 + n, ten = n * 10, isTeen = Math.random() < 0.5;
      const val = isTeen ? teen : ten;
      return {
        t: 'listen', q: 'Which number do you hear?', say: `${n2w(val)}. The number is ${n2w(val)}.`,
        o: [String(teen), String(ten)], a: isTeen ? 0 : 1,
        why: '**-teen** numbers (13–19) are stressed at the end: thir-TEEN. **-ty** numbers are stressed at the start: THIR-ty.'
      };
    },
    date() {
      const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
      const ord = ['', 'first', 'second', 'third', 'fourth', 'fifth', 'sixth', 'seventh', 'eighth', 'ninth', 'tenth', 'eleventh', 'twelfth', 'thirteenth', 'fourteenth', 'fifteenth', 'sixteenth', 'seventeenth', 'eighteenth', 'nineteenth', 'twentieth', 'twenty-first', 'twenty-second', 'twenty-third', 'twenty-fourth', 'twenty-fifth', 'twenty-sixth', 'twenty-seventh', 'twenty-eighth'];
      const m = rnd(0, 11), d = rnd(1, 28);
      const wrongD = d > 18 ? d - 10 : d + 10, wrongM = (m + 1) % 12;
      return {
        t: 'listen', q: 'Which date do you hear?', say: `The meeting is on ${months[m]} ${ord[d]}.`,
        o: [`${months[m]} ${d}`, `${months[m]} ${wrongD}`, `${months[wrongM]} ${d}`], a: 0,
        why: 'Dates use ordinal numbers: March **fourteenth**, June **twenty-first**.'
      };
    },
    spell() {
      const names = ['KAREN', 'BRADY', 'NADIA', 'PATEL', 'DIMAS', 'MENDEZ', 'BOWEN', 'PERRY', 'NGUYEN', 'DAVIS', 'MORGAN', 'BIANCA', 'VEGA', 'TIBBS', 'MADDEN'];
      const nm = names[rnd(0, names.length - 1)];
      return {
        t: 'num', q: 'A caller spells their name. Type it.', ph: 'Example: KAREN',
        say: `My last name is spelled: ${nm.split('').join(', ')}.`, a: nm,
        check: (v) => String(v).toUpperCase().replace(/[^A-Z]/g, '') === nm,
        why: 'Letters that are easy to confuse on the phone: **B/P/D/E/T/V**, **M/N**, **F/S**. You can ask: "B as in boy?"'
      };
    }
  };
  function viewNumbers() {
    const kinds = [['mix', 'Mixed practice'], ['phone', 'Phone numbers'], ['time', 'Times'], ['price', 'Prices'], ['teens', '13 or 30?'], ['date', 'Dates'], ['spell', 'Spelled names']];
    app.innerHTML = `<a class="back" href="#/voice">${I.back} Voice</a>
      <div class="stack" style="gap:6px"><span class="eyebrow">Listening at work</span><h1>Numbers and spelling</h1>
      <p class="muted">Phone numbers, appointment times, prices, dates, and spelled names come up every day at work. Each drill is new every time. Tap the big button to hear it again.</p>
      <p class="ar small muted" lang="ar">أرقام التليفون والمواعيد والأسعار وتهجية الأسامي بتيجي كل يوم في الشغل. كل تمرين جديد كل مرة.</p></div>
      <div class="units" id="nk">${kinds.map(([k, n]) => `<button class="unit-link" data-k="${k}" style="text-align:left;cursor:pointer;font:inherit"><span class="k">${I.speak}</span><span class="t"><b>${n}</b><span>10 questions</span></span><span class="chip">Start</span></button>`).join('')}</div>
      <div id="nb" class="stack"></div>`;
    app.querySelectorAll('[data-k]').forEach(b => b.onclick = () => {
      const k = b.dataset.k;
      const keys = Object.keys(GEN);
      const items = Array.from({ length: 10 }, () => GEN[k === 'mix' ? pick(keys) : k]());
      document.getElementById('nk').hidden = true;
      const box = document.getElementById('nb');
      runSet({ box, items, mode: 'drill', track: false, onFinish: (r) => {
        addXP(5);
        results(box, r, { pass: 70, drill: true, title: 'Numbers and spelling', again: () => viewNumbers(), next: { href: '#/voice', label: 'Back to Voice' } });
      } });
    });
  }

  /* ================= Progress page ================= */
  function viewProgress() {
    const cards = Object.values(S.cards);
    const wNew = cards.filter(c => c.box === 0).length, wLearning = cards.filter(c => c.box > 0 && c.box < 3).length, wStrong = cards.filter(c => c.box >= 3).length;
    const wTotal = Math.max(1, cards.length);
    const mastered = UNIT_ORDER.filter(u => unitDone(u.id)).length;
    const days = []; for (let k = 27; k >= 0; k--) days.push(addDays(today(), -k));
    const maxDay = Math.max(S.settings.goal, ...days.map(d => S.days[d] || 0));
    const fl = Object.entries(S.fluency).filter(([, h]) => h.length).map(([key, h]) => {
      const [uid, pi, k] = key.split(':');
      const u = UNIT[uid];
      const title = u && u.passages && u.passages[+pi] ? `${u.passages[+pi].title}, paragraph ${+k + 1}` : key;
      return { title, h };
    });
    const storiesRead = Object.keys(S.read).length;
    app.innerHTML = `<a class="back" href="#/me">${I.back} Me</a>
      <div class="stack" style="gap:6px"><span class="eyebrow">Progress</span><h1>How far you have come</h1>
      <p class="ar small muted" lang="ar">شوفي انتي وصلتي لفين.</p></div>
      <div class="stats">
        <div class="stat"><b>${mastered}</b><span>of ${UNIT_ORDER.length} units mastered</span></div>
        <div class="stat"><b>${wStrong}</b><span>words learned well</span></div>
        <div class="stat"><b>${storiesRead}</b><span>stories read</span></div>
      </div>
      <div class="card stack"><h3>Units by level</h3>
        <div class="stack" style="gap:10px">${LEVELS.map(L => `<div class="stack" style="gap:4px">
          <div class="spread small"><b>Level ${L.n}: ${esc(L.title)}</b>${S.tests[L.id] && S.tests[L.id].passed ? '<span class="chip good">Test passed</span>' : ''}</div>
          <div class="cells">${L.units.map(u => { const st = S.units[u.id]; const cls = unitDone(u.id) ? 'done' : st && st.best !== null ? 'tried' : st && st.lesson ? 'started' : ''; return `<a class="cell ${cls}" href="#/unit/${u.id}/lesson" title="${esc(u.title)}${st && st.best !== null ? ' · best ' + st.best + '%' : ''}"><span>${esc(({ grammar: 'Grammar', conversation: 'Talk', vocab: 'Words', reading: 'Reading', speaking: 'Speak', strategy: 'Method' })[u.kind] || u.kind)}</span></a>`; }).join('')}</div></div>`).join('')}</div>
        <div class="row small muted" style="gap:14px"><span><i class="key done"></i> Mastered (80%+)</span><span><i class="key tried"></i> Tried</span><span><i class="key started"></i> Lesson read</span></div>
      </div>
      <div class="card stack"><h3>Words</h3>
        ${cards.length ? `<div class="stackbar"><i style="width:${wStrong / wTotal * 100}%;background:var(--good)"></i><i style="width:${wLearning / wTotal * 100}%;background:var(--nile)"></i><i style="width:${wNew / wTotal * 100}%;background:var(--line)"></i></div>
        <div class="row small" style="gap:14px"><span><i class="key" style="background:var(--good)"></i> Learned well: ${wStrong}</span><span><i class="key" style="background:var(--nile)"></i> Learning: ${wLearning}</span><span><i class="key" style="background:var(--line)"></i> New: ${wNew}</span></div>`
        : '<p class="muted">Finish a vocabulary lesson to start your word deck.</p>'}
      </div>
      <div class="card stack"><h3>Last 4 weeks</h3>
        <div class="cal">${days.map(d => { const v = S.days[d] || 0; const lvl = v === 0 ? 0 : v < maxDay / 3 ? 1 : v < maxDay * 2 / 3 ? 2 : 3; return `<i class="l${lvl}" title="${d}: ${v} points"></i>`; }).join('')}</div>
        <p class="small muted">${days.filter(d => S.days[d]).length} of 28 days practiced. Stronger color means more practice.</p>
      </div>
      <div class="card stack"><h3>Reading speed</h3>
        ${fl.length ? fl.map(({ title, h }) => `<div class="stack" style="gap:4px"><span class="small"><b>${esc(title)}</b></span>
          <div class="sparks">${h.slice(-8).map(x => `<div><i style="height:${Math.min(100, x.wcpm / 160 * 100)}%"></i><span>${x.wcpm}</span></div>`).join('')}</div></div>`).join('')
          + '<p class="small muted">Words correct per minute on each try. A strong goal is 110 or more with 95% accuracy.</p>'
          : '<p class="muted">Use "Read alone, timed" in any reading lesson to track your reading speed.</p>'}
      </div>`;
  }

  /* ================= Job-specific role-plays ================= */
  const JOBS = window.SEKKA_JOBS || [];
  function guessJob() {
    const j = (S.settings.job || '').toLowerCase();
    const map = [['retail', /cash|retail|store|shop|sales/], ['medical', /medic|clinic|hospital|nurs|doctor|dental|pharm|patient/], ['warehouse', /warehouse|factory|packag|plant|forklift|ware/],
      ['office', /office|admin|secretar|reception|assistant|clerk|account/], ['restaurant', /restaurant|server|waitress|cook|kitchen|food|cafe|bakery/],
      ['childcare', /child|daycare|school|teacher|nanny|babysit/], ['housekeep', /clean|housekeep|hotel|maid/], ['callcenter', /call|customer service|phone|support/]];
    const hit = map.find(([, re]) => re.test(j));
    return hit ? (JOBS.find(x => x.id.startsWith(hit[0])) || JOBS[0]) : null;
  }
  function renderJobs(box) {
    if (!box || !JOBS.length) return;
    const cur = JOBS.find(x => x.id === S.settings.jobPick) || guessJob() || JOBS[0];
    const L = S.placement ? LEVELS[Math.max(0, curLevelN() - 1)] : LEVELS[0];
    box.innerHTML = `<h3>Practice for my job</h3>
      <p class="small muted">Real situations from your kind of work. Tap one to copy it, paste it into the Claude app, and talk in voice mode.</p>
      <label class="small" for="job-sel">My kind of work</label>
      <select class="input" id="job-sel">${JOBS.map(j => `<option value="${j.id}" ${j.id === cur.id ? 'selected' : ''}>${esc(j.name)}</option>`).join('')}</select>
      <div class="units">${cur.scenes.map((sc, k) => `<button class="unit-link" data-sc="${k}" style="text-align:left;cursor:pointer;font:inherit"><span class="k">${I.speaking}</span><span class="t"><b>${esc(sc.title)}</b><span>${esc(sc.goal)}</span></span><span class="chip">Copy</span></button>`).join('')}</div>`;
    box.querySelector('#job-sel').onchange = (e) => { S.settings.jobPick = e.target.value; save(); renderJobs(box); };
    box.querySelectorAll('[data-sc]').forEach(b => b.onclick = () => {
      copy(claudeRoleplayPrompt(L, cur.scenes[+b.dataset.sc]));
      addXP(5); markStep('speak');
    });
  }

  /* ================= Check yourself (retrieval right after the lesson) ================= */
  function renderCheck(u, box) {
    const pool = (u.items || []).filter(i => ['mc', 'fill', 'order', 'listen'].includes(i.t));
    if (pool.length < 2) return;
    box.innerHTML = `<div class="card stack" id="chk">
      <h3>Check yourself</h3>
      <p class="small muted">Answer 2 quick questions without looking back. Trying to remember is what makes a lesson stick.</p>
      <p class="ar small muted" lang="ar">جاوبي على سؤالين من غير ما تبصّي فوق. محاولة التذكّر هي اللي بتثبّت الدرس.</p>
      <div><button class="btn" id="chk-go">Check myself</button></div>
    </div>`;
    box.querySelector('#chk-go').onclick = () => {
      const card = box.querySelector('#chk');
      const qb = document.createElement('div'); qb.className = 'stack';
      card.querySelector('#chk-go').parentElement.replaceWith(qb);
      runSet({ box: qb, items: sample(pool, 2), mode: 'check', track: true, onFinish: (r) => {
        qb.innerHTML = `<div class="feedback ${r.right === r.counted ? 'right' : 'info'}"><b class="v">${r.right} of ${r.counted} correct</b>
          <div>${r.right === r.counted ? 'You remembered it. Now finish the lesson and practice.' : 'Good try. Read the part you missed again, then practice. Missed questions will come back later.'}</div></div>`;
      } });
    };
  }

  /* ================= My writing ================= */
  function viewWriting() {
    const entries = Object.entries(S.writing).filter(([, t]) => t && t.trim()).map(([key, text]) => {
      const [uid, k] = key.split(':');
      const u = UNIT[uid];
      const task = u && u.write && u.write[+k] ? u.write[+k].task : '';
      return { key, u, task, text, words: (text.match(/\b[\w']+\b/g) || []).length };
    }).filter(e => e.u).sort((a, b) => UNIT_ORDER.indexOf(a.u) - UNIT_ORDER.indexOf(b.u));
    const total = entries.reduce((a, e) => a + e.words, 0);
    app.innerHTML = `<a class="back" href="#/me">${I.back} Me</a>
      <div class="stack" style="gap:6px"><span class="eyebrow">Writing</span><h1>My writing</h1>
      <p class="muted">${entries.length ? `${entries.length} piece${entries.length === 1 ? '' : 's'} · ${total} words in total. Look how your writing grows.` : 'Your writing assignments will appear here.'}</p></div>
      ${entries.length ? entries.map((e, i) => `<div class="card stack">
        <div class="spread"><span class="eyebrow">Level ${e.u.level.n} · ${esc(e.u.title)}</span><span class="chip plain">${e.words} words</span></div>
        <p class="small"><b>${md(e.task)}</b></p>
        <div class="reading" style="white-space:pre-wrap">${esc(e.text)}</div>
        <div class="row"><button class="btn small primary" data-wcopy="${i}">${I.copy} Copy for Claude to grade</button><a class="btn small" href="#/unit/${e.u.id}/lesson">Edit</a></div>
      </div>`).join('') : `<div class="card flat stack"><p>Each Speaking &amp; Writing unit has a writing task. Your writing is saved automatically as you type.</p><a class="btn primary" href="#/unit/${(UNIT_ORDER.find(u => u.write && u.write.length) || UNIT_ORDER[0]).id}/lesson">Go to the first writing task</a></div>`}`;
    app.querySelectorAll('[data-wcopy]').forEach(b => b.onclick = () => {
      const e = entries[+b.dataset.wcopy];
      copy(claudeWritingPrompt(e.u.level, e.task, e.text));
    });
  }

  /* ================= Grammar guide ================= */
  function grammarTopics() {
    const out = [];
    LEVELS.forEach(L => L.units.filter(u => u.kind === 'grammar' || /Punctuation/.test(u.title)).forEach(u => {
      let cur = null;
      (u.lesson || []).forEach(b => {
        if (b.h) { cur = { L, u, title: b.h, blocks: [] }; out.push(cur); }
        else {
          if (!cur) { cur = { L, u, title: u.title, blocks: [] }; out.push(cur); }
          cur.blocks.push(b);
        }
      });
    }));
    return out.filter(t => t.blocks.length && !/aloud/i.test(t.title));
  }
  function blockText(b) {
    if (b.p) return b.p; if (b.tip) return b.tip; if (b.ar) return b.ar;
    if (b.ex) return b.ex.join(' '); if (b.table) return b.table.map(r => r.join(' ')).join(' ');
    return '';
  }
  function viewGrammar() {
    const topics = grammarTopics();
    app.innerHTML = `<a class="back" href="#/">${I.back} Home</a>
      <div class="stack" style="gap:6px"><span class="eyebrow">Quick reference</span><h1>Grammar guide</h1>
      <p class="muted">Every grammar rule from the lessons in one place. Search when you are not sure, for example "since", "passive", "has", or "comma".</p>
      <p class="ar small muted" lang="ar">كل قواعد الدروس في مكان واحد. دوري على أي قاعدة لما تبقي مش متأكدة.</p></div>
      <input class="input" id="gr-q" placeholder="Search grammar" autocomplete="off">
      <div id="gr-list" class="stack"></div>`;
    const list = document.getElementById('gr-list');
    const draw = (q) => {
      q = (q || '').toLowerCase().trim();
      const shown = topics.filter(t => !q || t.title.toLowerCase().includes(q) || t.blocks.some(b => blockText(b).toLowerCase().includes(q)));
      let lastL = null;
      list.innerHTML = shown.map(t => {
        const head = t.L !== lastL ? `<h2 style="margin-top:6px">Level ${t.L.n}</h2>` : '';
        lastL = t.L;
        return head + `<details class="card stack gr" ${q ? 'open' : ''}><summary><b>${md(t.title)}</b> <span class="small muted">${esc(t.u.title)}</span></summary>
          <div class="lesson">${t.blocks.map(blockHTML).join('')}</div>
          <div><a class="small" href="#/unit/${t.u.id}/practice">Practice this →</a></div></details>`;
      }).join('') || '<p class="muted">Nothing found. Try a shorter word.</p>';
    };
    draw();
    document.getElementById('gr-q').oninput = (e) => draw(e.target.value);
  }

  /* ================= Daily session ================= */
  function sess() { if (S.session.date !== today()) S.session = { date: today() }; return S.session; }
  function markStep(k) { sess()[k] = true; save(); }
  function autoSteps() {
    const x = sess();
    const noWords = dueCards().length === 0, noWarm = warmItems(1).length === 0;
    if (!x.words && noWords) x.words = 'auto'; else if (x.words === 'auto' && !noWords) x.words = false;
    if (!x.warm && noWarm) x.warm = 'auto'; else if (x.warm === 'auto' && !noWarm) x.warm = false;
  }
  function stepsDone() { autoSteps(); const x = sess(); return ['warm', 'learn', 'words', 'speak'].filter(k => x[k]).length; }
  function warmItems(n) {
    const misses = dueMisses().slice(0, n).map(id => ITEM[id]);
    const ids = new Set(misses.map(x => x.id));
    const pool = [].concat(...UNIT_ORDER.filter(studied).map(u => (u.items || []).filter(i => i.t !== 'say' && !ids.has(i.id))));
    return misses.concat(sample(pool, Math.max(0, n - misses.length)));
  }
  function todaySentences() {
    const n = nextStep();
    const L = n && n.u ? n.u.level : (S.placement ? LEVELS[S.placement.level - 1] : LEVELS[0]);
    const own = [].concat(...L.units.map(u => u.speak || []));
    return sample(own.length ? own : [].concat(...LEVELS.map(x => [].concat(...x.units.map(u => u.speak || [])))), 3);
  }
  function viewToday(sub) {
    const x = sess();
    if (sub === 'warm') {
      const items = warmItems(dueMisses().length > 5 ? Math.min(10, dueMisses().length) : 5);
      app.innerHTML = `<a class="back" href="#/today">${I.back} Today's session</a><div class="stack" style="gap:6px"><span class="eyebrow">Step 1 · Warm-up</span><h1>Remember first</h1></div><div id="wb" class="stack"></div>`;
      const box = document.getElementById('wb');
      if (!items.length) { markStep('warm'); box.innerHTML = '<div class="card stack"><p>Nothing to review yet. After your first lesson, this step will bring back old questions so you don\'t forget them.</p><a class="btn primary" href="#/today">Back to today\'s session</a></div>'; return; }
      box.innerHTML = `<div class="card stack"><p>${items.length} questions from earlier lessons and questions you missed before. Try to remember the answer <b>before</b> you look at the choices.</p>
        <p class="ar small" lang="ar">حاولي تفتكري الإجابة الأول قبل ما تبصي على الاختيارات. محاولة التذكّر نفسها هي اللي بتثبّت المعلومة.</p>
        <button class="btn primary" id="wgo">Start warm-up</button></div>`;
      document.getElementById('wgo').onclick = () => runSet({ box, items, mode: 'review', onFinish: (r) => {
        markStep('warm');
        results(box, r, { pass: 0, review: true, title: 'Warm-up', again: () => viewToday('warm'), next: { href: '#/today', label: 'Next step' } });
      } });
      return;
    }
    if (sub === 'speak') {
      const list = todaySentences();
      let k = 0;
      app.innerHTML = `<a class="back" href="#/today">${I.back} Today's session</a><div class="stack" style="gap:6px"><span class="eyebrow">Step 4 · Speak</span><h1>Listen and repeat</h1>
        <p class="muted">Tap <b>Listen and repeat</b>. The voice says a short piece, then you say it. Copying a native speaker closely is one of the fastest ways to improve your accent and rhythm.</p></div>
        <div id="sb"></div><div class="row" id="snav"></div>
        <p class="small muted">Want more? Open the <b>Talk at Work</b> unit in your level and practice a real conversation with Claude voice.</p>`;
      const draw = () => {
        sayWidget(list[k], document.getElementById('sb'), { unitId: 'today' });
        document.getElementById('snav').innerHTML = `<span class="small muted">Sentence ${k + 1} of ${list.length}</span>` + (k < list.length - 1 ? '<button class="btn primary" id="sn">Next sentence</button>' : '<button class="btn primary" id="sn">Finish</button>');
        document.getElementById('sn').onclick = () => { if (k < list.length - 1) { k++; draw(); } else { markStep('speak'); addXP(5); location.hash = '#/today'; } };
      };
      draw();
      return;
    }
    const next = nextStep();
    const due = dueCards().length;
    const misses = dueMisses().length;
    autoSteps();
    const step = (key, n, title, sub, href, label, mins) => `<div class="unit-link" style="grid-template-columns:38px 1fr auto">
      <span class="k" style="${x[key] ? 'background:var(--nile);color:var(--nile-ink)' : ''}">${x[key] ? '✓' : n}</span>
      <span class="t"><b>${title}</b><span>${sub} · ${mins} min</span></span>
      ${x[key] === 'auto' ? '<span class="chip plain">Nothing due</span>' : x[key] ? '<span class="chip good">Done</span>' : `<a class="btn small primary" href="${href}">${label}</a>`}</div>`;
    app.innerHTML = `<a class="back" href="#/">${I.back} Home</a>
      <div class="stack" style="gap:6px"><span class="eyebrow">${new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}</span><h1>Today's session</h1>
      <p class="muted">Four short steps, about 20 minutes. Doing a little every day works much better than a lot once a week.</p>
      <p class="ar small muted" lang="ar">٢٠ دقيقة كل يوم أحسن بكتير من ساعتين مرة في الأسبوع.</p></div>
      <div class="units">
        ${step('warm', 1, 'Warm-up review', misses ? `${misses} old mistake${misses === 1 ? '' : 's'} to fix + earlier lessons` : 'Questions from earlier lessons', '#/today/warm', 'Start', 3)}
        ${step('learn', 2, next ? esc(next.title) : 'Review any level', next ? esc(next.sub) : 'You finished the path', next ? next.href : '#/', 'Open', 10)}
        ${step('words', 3, 'Word review', due ? `${due} word${due === 1 ? '' : 's'} ready` : 'No words due today', due ? '#/words/review' : '#/words', due ? 'Review' : 'Open', 4)}
        ${step('speak', 4, 'Listen and repeat', '3 sentences, out loud', '#/today/speak', 'Start', 3)}
      </div>
      <div class="stack" style="gap:6px"><span class="eyebrow">Bonus</span>${storyCard()}
        <a class="card flat spread" href="#/numbers" style="text-decoration:none;color:inherit"><div><b>Numbers and spelling</b><div class="small muted">Phone numbers, times, prices · 3 min</div></div><span class="chip">Practice</span></a></div>
      ${stepsDone() === 4 ? '<div class="hero"><h2>All done for today!</h2><p>Come back tomorrow. Sleep helps your brain store what you learned.</p><p class="ar" lang="ar">برافو! النوم بيساعد المخ يحفظ اللي اتعلمتيه. نكمّل بكرة.</p></div>' : ''}
      <a class="small" href="#/method">Why it works this way</a>`;
  }

  /* ================= Repeated reading (fluency) ================= */
  function renderFluency(u, box) {
    const paras = [];
    u.passages.forEach((p, pi) => p.text.split(/\n\n+/).forEach((t, k) => { if (t.split(/\s+/).length >= 25) paras.push({ key: `${u.id}:${pi}:${k}`, label: `${p.title} · paragraph ${k + 1}`, text: t.replace(/\n/g, ' ') }); }));
    if (!paras.length) return;
    let cur = 0;
    box.innerHTML = `<h3>Fluency practice: repeated reading</h3>
      <p class="small muted">Reading the same paragraph aloud 3 or 4 times this week builds speed and confidence. Each try is timed so you can see your progress.</p>
      <div class="card stack">
        <select class="input" id="fl-sel">${paras.map((p, k) => `<option value="${k}">${esc(p.label)}</option>`).join('')}</select>
        <ol class="steps small"><li><b>Listen</b> while you follow the words with your finger.</li><li><b>Read along</b> with the voice.</li><li><b>Read alone</b>, timed. Don't rush: correct words matter more than speed.</li></ol>
        <div class="reading" id="fl-text"></div>
        <div class="row"><button class="btn" id="fl-listen">${I.speak} Listen</button>
          ${Speech.canHear ? `<button class="btn primary" id="fl-go">${I.mic} Read alone, timed</button>` : ''}</div>
        ${Speech.canHear ? '' : '<p class="small muted">Timed reading needs Chrome on Android or a computer. You can still listen and read along here.</p>'}
        <div id="fl-out" class="stack" aria-live="polite"></div>
      </div>`;
    const sel = box.querySelector('#fl-sel'), txt = box.querySelector('#fl-text'), out = box.querySelector('#fl-out');
    const history = () => {
      const h = S.fluency[paras[cur].key] || [];
      if (!h.length) return '<p class="small muted">No timed tries yet for this paragraph.</p>';
      return `<div class="small"><b>Your tries:</b> ${h.slice(-6).map(x => `${x.wcpm} wpm · ${x.acc}%`).join(' → ')}</div>`;
    };
    const draw = () => { txt.innerHTML = `<p>${esc(paras[cur].text)}</p>`; out.innerHTML = history(); };
    sel.onchange = () => { cur = +sel.value; draw(); };
    draw();
    box.querySelector('#fl-listen').onclick = () => say(paras[cur].text);
    const go = box.querySelector('#fl-go');
    let ctl = null;
    if (go) go.onclick = async () => {
      if (ctl) {
        go.disabled = true; go.textContent = 'Checking…';
        const r = await ctl.stop(); ctl = null;
        go.disabled = false; go.classList.remove('mic-on'); go.innerHTML = `${I.mic} Read again, timed`;
        if (r.error) { out.innerHTML = '<p>Please allow the microphone, then try again.</p>'; return; }
        const c = Speech.compare(paras[cur].text, r.text);
        const matched = c.hit.filter(Boolean).length;
        const wcpm = Math.round(matched / (r.ms / 60000));
        const rec = { d: today(), wcpm, acc: c.score };
        (S.fluency[paras[cur].key] = S.fluency[paras[cur].key] || []).push(rec);
        addXP(5); save();
        txt.innerHTML = `<p class="heard">${c.words.map((w, k) => `<span class="${c.hit[k] ? 'ok' : 'miss'}">${esc(w)}</span>`).join(' ')}</p>`;
        out.innerHTML = `<div class="feedback ${c.score >= 95 ? 'right' : 'info'}"><b class="v">${wcpm} words correct per minute · ${c.score}% accurate</b>
          <div>${c.score >= 95 ? 'Very accurate! Next time, try to read a little more smoothly, like you are talking.' : c.score >= 85 ? 'Good. Practice the red words, then read the paragraph again.' : 'Listen to the paragraph again and read along with the voice first, then try alone.'}</div>
          <div class="small muted">A strong goal is 95% accuracy at 110 or more words per minute. Speed grows when you read the same text again.</div></div>${history()}`;
        return;
      }
      try {
        ctl = Speech.listenLong();
        go.classList.add('mic-on'); go.innerHTML = `${I.stop} I finished reading`;
        out.innerHTML = '<p class="small muted">Read the paragraph out loud now. Tap the button when you finish.</p>';
      } catch (e) { out.innerHTML = '<p>Timed reading is not available in this browser.</p>'; }
    };
    onLeave(() => { if (ctl) ctl.stop(); });
  }

  /* ================= Teaching method ================= */
  function viewMethod() {
    const rows = [
      ['A little every day', 'Short daily practice beats long, rare study. Your brain stores learning between sessions, especially during sleep.', 'شوية كل يوم أحسن من كتير مرة واحدة. المخ بيثبّت المعلومة بين المرّات وخصوصاً وانتي نايمة.'],
      ['Remember before you look', 'Quizzes are not only tests. Pulling an answer out of your memory is what makes it stay. That is why every session starts with a warm-up.', 'الامتحان مش بس تقييم. لما تحاولي تفتكري الإجابة، المعلومة بتثبت أكتر.'],
      ['Mistakes come back', 'A question you miss returns after 1, 3, 7, and 16 days until you know it. Words in your deck work the same way.', 'السؤال اللي بتغلطي فيه بيرجعلك بعد يوم، ٣ أيام، أسبوع، وأسبوعين لحد ما تحفظيه.'],
      ['Mix old and new', 'Every quiz includes questions from earlier units. Mixing topics feels harder, but you remember longer.', 'كل امتحان فيه أسئلة من الدروس القديمة. ده أصعب شوية بس بيخلّي المعلومة تعيش أطول.'],
      ['Master it, then move on', 'You need 80% to finish a unit. A strong base makes every next level easier.', 'لازم ٨٠٪ عشان تخلصي الوحدة. الأساس القوي بيسهّل اللي بعده.'],
      ['Understand a lot of English', 'We learn a language mostly by understanding messages, reading and listening to things that are a little easy. Read and listen as much as you can.', 'بنتعلم اللغة أكتر من إننا نسمع ونقرا حاجات فاهمين معظمها. اسمعي واقري كتير.'],
      ['Listen, then copy', 'Listening to a short piece and repeating it right away trains your mouth and ear together. Adults can improve pronunciation at any age with this kind of practice.', 'اسمعي حتة صغيرة وكرريها على طول. ده بيدرّب ودنك وبقك مع بعض. النطق بيتحسن في أي سن.'],
      ['Read it again', 'Reading the same paragraph aloud several times is a proven way to build reading speed and confidence.', 'لما تقري نفس الفقرة بصوت عالي كذا مرة، سرعتك وثقتك بيزيدوا.'],
      ['Your life is the lesson', 'Adults learn best when the topic matters to them. Write and speak about your family, your work, and your day.', 'الكبار بيتعلموا أحسن لما الموضوع يخصّهم. اكتبي واتكلمي عن عيلتك وشغلك ويومك.'],
      ['Arabic is a bridge', 'Comparing English with Arabic helps you understand why mistakes happen. As you grow, turn Arabic help off in settings and think more in English.', 'المقارنة بالعربي بتفهّمك سبب الغلط. ولما تتقدمي، اقفلي الشرح العربي من الإعدادات وفكّري بالإنجليزي.']
    ];
    const help = [
      ['Ask her to teach you', 'Once a day, ask: "What did you learn today? Teach me." Explaining a lesson is one of the strongest ways to learn it.'],
      ['Correct by repeating, not by stopping', 'If she says "Yesterday I go to the store," answer naturally: "Oh, you went to the store? What did you buy?" She hears the right form and the conversation keeps going.'],
      ['Ten minutes of English a day', 'Pick one daily moment, like dinner or a drive, to speak only English about real things.'],
      ['Praise effort and specific progress', 'Say "Your TH sound is much clearer" rather than "You\'re smart." Specific praise builds the habit.'],
      ['Grade one thing at a time', 'When you listen to her recordings, give one thing to fix, not ten. Use the stars and the note on the Voice tab.'],
      ['Surround her with easy English', 'English labels on things at home, a favorite show with English audio and English subtitles, and simple news such as VOA Learning English.'],
      ['Make it a routine', 'Same time every day, linked to an existing habit, like right after morning tea.']
    ];
    app.innerHTML = `<a class="back" href="#/me">${I.back} Me</a>
      <div class="stack" style="gap:6px"><span class="eyebrow">The method</span><h1>How Sekka teaches</h1>
      <p class="muted">These methods come from research on how adults learn and remember. Age 40 is a great age to learn: adults learn grammar and vocabulary faster than children when they practice the right way.</p>
      <p class="ar muted" lang="ar">سن الأربعين سن ممتاز للتعلّم. الكبار بيتعلموا القواعد والكلمات أسرع من الأطفال لما يذاكروا بالطريقة الصح.</p></div>
      <div class="stack">${rows.map(([t, d, a]) => `<div class="card flat stack" style="gap:6px"><h3>${esc(t)}</h3><p>${esc(d)}</p>${S.settings.arabic ? `<p class="ar small" lang="ar">${esc(a)}</p>` : ''}</div>`).join('')}</div>
      <div class="stack" style="gap:6px"><span class="eyebrow">For family</span><h2>How you can help</h2></div>
      <div class="stack">${help.map(([t, d]) => `<div class="card flat stack" style="gap:6px"><h3>${esc(t)}</h3><p>${esc(d)}</p></div>`).join('')}</div>`;
  }

  /* ================= Boot ================= */
  applySettings();
  route();
  if ('serviceWorker' in navigator && location.protocol.startsWith('http')) {
    window.addEventListener('load', () => navigator.serviceWorker.register('sw.js').catch(() => {}));
  }
})();
