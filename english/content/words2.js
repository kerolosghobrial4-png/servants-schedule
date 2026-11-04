/* Extra vocabulary for Level 1 and 2 vocabulary units (workplace words). Words are keyed by the word itself. */
(function () {
  const W = {
    L1U2: [
      { w: 'shift', ar: 'وردية / شيفت', d: 'The hours you work on a certain day.', ex: 'My shift starts at seven.' },
      { w: 'paycheck', ar: 'المرتب / القبض', d: 'The money your job pays you, usually every week or two.', ex: 'I get my paycheck on Friday.' },
      { w: 'coworker', ar: 'زميل في الشغل', d: 'A person you work with.', ex: 'My coworker helped me today.' },
      { w: 'manager', ar: 'مدير', d: 'The person in charge of workers.', ex: 'Ask the manager about your schedule.' },
      { w: 'customer', ar: 'زبون / عميل', d: 'A person who buys something or uses a service.', ex: 'The customer wants a refund.' },
      { w: 'uniform', ar: 'يونيفورم / زي الشغل', d: 'Special clothes you wear for work.', ex: 'We wear a blue uniform.' },
      { w: 'break', ar: 'استراحة', d: 'A short rest from work.', ex: 'I take a fifteen-minute break at ten.' },
      { w: 'available', ar: 'متاح / فاضي', d: 'Free to do something or be used.', ex: 'Are you available on Saturday?' },
      { w: 'emergency', ar: 'طوارئ / حالة طارئة', d: 'A sudden, dangerous situation that needs help fast.', ex: 'In an emergency, call 911.' },
      { w: 'address', ar: 'عنوان', d: 'Where a person lives or a building is.', ex: 'Please write your address here.' }
    ],
    L2U2: [
      { w: 'clock in', ar: 'يسجّل حضور', d: 'To record the time you start work.', ex: 'Don\'t forget to clock in when you arrive.' },
      { w: 'clock out', ar: 'يسجّل انصراف', d: 'To record the time you finish work.', ex: 'I clocked out at five thirty.' },
      { w: 'call in sick', ar: 'يتصل يقول إنه عيان', d: 'To phone work and say you are too sick to come.', ex: 'She called in sick this morning.' },
      { w: 'fill out', ar: 'يملا (استمارة)', d: 'To write the information needed on a form.', ex: 'Please fill out this application.' },
      { w: 'show up', ar: 'يحضر / ييجي', d: 'To arrive or come somewhere.', ex: 'He showed up ten minutes early.' },
      { w: 'hand in', ar: 'يسلّم', d: 'To give work or a paper to someone in charge.', ex: 'Hand in your timesheet on Friday.' },
      { w: 'sign up', ar: 'يسجّل (في حاجة)', d: 'To put your name on a list to join something.', ex: 'I signed up for an English class.' },
      { w: 'set up', ar: 'يجهّز / يركّب', d: 'To prepare or arrange something.', ex: 'Can you set up the room for the meeting?' },
      { w: 'figure out', ar: 'يفهم / يلاقي حل', d: 'To understand or solve something after thinking.', ex: 'I figured out how to use the new machine.' },
      { w: 'cover for', ar: 'يغطّي مكان حد', d: 'To do someone\'s work while they are away.', ex: 'Can you cover for me on Tuesday?' }
    ]
  };
  (window.SEKKA_LEVELS || []).forEach(L => L.units.forEach(u => {
    if (W[u.id] && !u._words2) {
      const have = new Set((u.words || []).map(x => x.w));
      u.words = (u.words || []).concat(W[u.id].filter(x => !have.has(x.w)));
      u._words2 = true;
    }
  }));
  // a few quiz items for the new words (appended to the end so existing item ids stay stable)
  const Q = {
    L1U2: [
      { t: 'mc', q: 'I work from 7 a.m. to 3 p.m. That is my ___.', o: ['shift', 'paycheck', 'uniform', 'address'], a: 0 },
      { t: 'mc', q: 'The person who works next to you every day is your ___.', o: ['coworker', 'customer', 'manager', 'neighbor'], a: 0 },
      { t: 'mc', q: '"Are you ___ to work on Sunday?" means "Are you free?"', o: ['available', 'emergency', 'busy', 'cheap'], a: 0 }
    ],
    L2U2: [
      { t: 'mc', q: 'You are too sick to work. You ___.', o: ['call in sick', 'clock in', 'show up', 'set up'], a: 0 },
      { t: 'mc', q: 'Before you start work, you ___ at the time clock.', o: ['clock in', 'clock out', 'hand in', 'fill out'], a: 0 },
      { t: 'mc', q: 'Please ___ this form with your name and phone number.', o: ['fill out', 'show up', 'cover for', 'figure out'], a: 0 },
      { t: 'mc', q: 'Can you ___ me on Tuesday? I have a doctor\'s appointment.', o: ['cover for', 'sign up', 'clock out', 'hand in'], a: 0 }
    ]
  };
  (window.SEKKA_LEVELS || []).forEach(L => L.units.forEach(u => {
    if (Q[u.id] && !u._words2q) { u.items = (u.items || []).concat(Q[u.id]); u._words2q = true; }
  }));
})();
