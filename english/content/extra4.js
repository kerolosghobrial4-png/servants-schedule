/* Extra Talk at Work items for Levels 5 and 6 (appended; existing ids stay stable). */
(function () {
  const EXTRA = {
    L5T: [
      { t: 'mc', q: 'A coworker emails: "Can you send the report by Friday?" You can\'t. The best reply:', o: ['I\'m sorry, I won\'t be able to finish it by Friday. Could Monday morning work instead?', 'No, too busy.', 'Friday is impossible, ask someone else.', '(Don\'t reply.)'], a: 0 },
      { t: 'mc', q: 'You want to remind your manager about a request politely. You write:', o: ['Just following up on my request from last week. Please let me know if you need anything from me.', 'Why haven\'t you answered me?', 'Answer my email.', 'Did you forget me?'], a: 0 },
      { t: 'mc', q: 'Your manager says: "Your report had several errors." The most professional answer:', o: ['Thank you for telling me. Could you show me the errors so I can avoid them next time?', 'Everyone makes mistakes.', 'That\'s not my fault.', 'Fine.'], a: 0 },
      { t: 'mc', q: 'Which closing is best for a formal email to someone you don\'t know?', o: ['Kind regards,', 'Love,', 'Cya!', 'Bye bye'], a: 0 },
      { t: 'mc', q: 'You want to ask for a raise. Which opening is best?', o: ['Could we schedule a time to talk about my role and compensation?', 'I want more money now.', 'Everyone else gets more than me.', 'Pay me more or I quit.'], a: 0 },
      { t: 'mc', q: 'A customer says: "This is the third time I\'m calling!" You answer:', o: ['I\'m really sorry about that. Let me make sure we solve it today.', 'Calm down.', 'That\'s not my department.', 'Call again tomorrow.'], a: 0 },
      { t: 'fill', q: 'I\'m writing to ___ about the schedule for next month. (ask for information)', a: ['ask', 'inquire', 'enquire'] },
      { t: 'order', a: 'Could you give me an example so I understand' }
    ],
    L6T: [
      { t: 'mc', q: '"Tell me about a time you failed." The strongest answer…', o: ['describes a real mistake, what you learned, and what you do differently now', 'says you never fail', 'blames a coworker', 'changes the subject'], a: 0 },
      { t: 'mc', q: 'In a presentation, someone asks a hard question. You don\'t know the answer. You say:', o: ['That\'s a great question. I don\'t have the numbers now, but I\'ll find out and email you today.', 'I don\'t know.', 'That\'s a bad question.', 'Next question, please.'], a: 0 },
      { t: 'mc', q: 'Which interview answer uses the STAR method?', o: ['When our clinic changed systems (S), I was asked to train staff (T). I made a guide and ran two sessions (A). Errors dropped by half (R).', 'I am a hard worker and very nice.', 'I have done many things at many jobs.', 'You can call my manager.'], a: 0 },
      { t: 'mc', q: 'A coworker takes credit for your idea in a meeting. The most professional response is:', o: ['I\'m glad you liked the idea I shared with you on Monday. I\'d be happy to help develop it.', 'You stole my idea!', '(Say nothing and stay angry.)', 'Complain to everyone after the meeting.'], a: 0 },
      { t: 'mc', q: 'To end a job interview well, you say:', o: ['Thank you for your time. I\'m very interested in this role, and I look forward to hearing from you.', 'So, did I get the job?', 'Okay, bye.', 'When do I start?'], a: 0 },
      { t: 'mc', q: 'Which phrase introduces your main point in a presentation?', o: ['The key point I want you to remember is…', 'Whatever, so…', 'I forgot what I wanted to say.', 'This is boring, but…'], a: 0 },
      { t: 'fill', q: 'I\'m not sure, but I\'ll find ___ and get back to you. (learn the information)', a: ['out'] },
      { t: 'order', a: 'The key point I want you to remember is this' }
    ]
  };
  (window.SEKKA_LEVELS || []).forEach(L => L.units.forEach(u => {
    const extra = EXTRA[u.id];
    if (extra && !u._extra4) { u.items = (u.items || []).concat(extra); u._extra4 = true; }
  }));
})();
