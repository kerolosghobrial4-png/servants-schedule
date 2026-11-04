/* Second model dialogues for Talk at Work units. Loaded after talk.js. */
(function () {
  const D2 = {
    L1T: {
      title: 'Finding your way at work', roles: { A: 'Coworker (Sam)', B: 'You' }, me: 'B',
      lines: [
        ['B', 'Excuse me, Sam. Can I ask you something?'],
        ['A', 'Sure, what do you need?'],
        ['B', 'Where do I clock in?'],
        ['A', 'The time clock is next to the front door. You scan your badge.'],
        ['B', 'Sorry, what does "scan" mean?'],
        ['A', 'You hold your badge near the machine, like this. It beeps.'],
        ['B', 'Oh, I see. And where is the bathroom?'],
        ['A', 'It\'s at the end of the hall, on the right.'],
        ['B', 'Thank you so much. You\'re very kind.'],
        ['A', 'Anytime. Welcome to the team!']
      ]
    },
    L2T: {
      title: 'A computer problem', roles: { A: 'IT helper (Dana)', B: 'You' }, me: 'B',
      lines: [
        ['A', 'Hi, this is Dana from IT. How can I help?'],
        ['B', 'Hi, Dana. I have a problem with my computer. I can\'t log in.'],
        ['A', 'Okay. What happens when you type your password?'],
        ['B', 'It says my password is wrong, but I\'m sure it\'s correct.'],
        ['A', 'Is the Caps Lock key on?'],
        ['B', 'Let me check. Oh, yes, it was on. I\'m sorry!'],
        ['A', 'No problem. That happens to everyone. Try again now.'],
        ['B', 'It works! Thank you for your help.'],
        ['A', 'You\'re welcome. Call me if anything else comes up.']
      ]
    },
    L3T: {
      title: 'Instructions by phone', roles: { A: 'Manager (Ms. Ortiz)', B: 'You' }, me: 'B',
      lines: [
        ['A', 'Hi, it\'s Ms. Ortiz. I\'m stuck in traffic. Can you open the office for me?'],
        ['B', 'Of course. What do you need me to do?'],
        ['A', 'First, turn on the lights and the computers. Then check the voicemail and write down any messages.'],
        ['B', 'Okay. Should I call anyone back?'],
        ['A', 'Only if it\'s urgent. And please tell the nine o\'clock client I\'ll be fifteen minutes late.'],
        ['B', 'Just to make sure I understand: lights and computers, check the voicemail, and tell the nine o\'clock client you\'ll be fifteen minutes late. Right?'],
        ['A', 'Exactly. Thank you, you\'re a lifesaver.'],
        ['B', 'No problem. Drive safely.']
      ]
    }
  };
  (window.SEKKA_LEVELS || []).forEach(L => L.units.forEach(u => { if (D2[u.id] && !u.dialogues) u.dialogues = [D2[u.id]]; }));
})();
