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
    },
    L4T: {
      title: 'Disagreeing about a schedule', roles: { A: 'Manager (Mr. Lee)', B: 'You' }, me: 'B',
      lines: [
        ['A', 'Starting next month, everyone will work one Sunday a month. Any questions?'],
        ['B', 'Could I add something?'],
        ['A', 'Of course.'],
        ['B', 'I understand we need more coverage on weekends. But Sunday is very difficult for me because of my family.'],
        ['A', 'I see. What would you suggest?'],
        ['B', 'I could work two Saturdays a month instead of one Sunday. That way the weekend is still covered.'],
        ['A', 'That\'s a fair idea. Let me check if that works with the schedule.'],
        ['B', 'Thank you. I\'m happy to talk about other options too.']
      ]
    },
    L5T: {
      title: 'An annual review', roles: { A: 'Supervisor (Ms. Grant)', B: 'You' }, me: 'B',
      lines: [
        ['A', 'Thanks for meeting with me. Overall, this has been a strong year for you.'],
        ['B', 'Thank you. I really appreciate that.'],
        ['A', 'Your attendance is excellent, and customers often mention how patient you are.'],
        ['B', 'That\'s nice to hear. I enjoy helping customers.'],
        ['A', 'One area to work on is speaking up in team meetings. You have good ideas, but we don\'t always hear them.'],
        ['B', 'That\'s fair. Could you give me an example of when I could have spoken up?'],
        ['A', 'In the last meeting about the new system, you mentioned a great idea to me afterward. The whole team would have benefited.'],
        ['B', 'I understand. I\'ll prepare one point before each meeting and share it. Can we check in again in three months?'],
        ['A', 'That sounds like a great plan.']
      ]
    },
    L6T: {
      title: 'Meeting a college advisor', roles: { A: 'Advisor (Mr. Brooks)', B: 'You' }, me: 'B',
      lines: [
        ['A', 'Welcome. What brings you in today?'],
        ['B', 'I\'d like to start a degree in business administration, but I work full-time. I need a schedule that fits my job.'],
        ['A', 'That\'s very common here. Many of our students work. Are evenings or weekends better for you?'],
        ['B', 'Evenings on Tuesday and Thursday are best. I could also take one class online.'],
        ['A', 'Good. Did you take any college courses before?'],
        ['B', 'Yes, I studied accounting at a university in Egypt. I have my transcript and a credential evaluation.'],
        ['A', 'Excellent. Some of those courses may transfer, which would save you time and money.'],
        ['B', 'That would be wonderful. What are the next steps?'],
        ['A', 'Submit your evaluation to the registrar, and I\'ll build a plan for two classes this fall.'],
        ['B', 'Thank you. I\'ll send it this week.']
      ]
    }
  };
  (window.SEKKA_LEVELS || []).forEach(L => L.units.forEach(u => { if (D2[u.id] && !u.dialogues) u.dialogues = [D2[u.id]]; }));
})();
