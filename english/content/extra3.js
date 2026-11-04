/* Extra practice items for Levels 5 and 6, appended to existing units by id (ids stay stable). */
(function () {
  const EXTRA = {
    L5U1: [
      { t: 'mc', q: 'One of my coworkers ___ from Egypt.', o: ['is', 'are'], a: 0, why: 'The subject is **one**, not coworkers.' },
      { t: 'mc', q: 'The quality of the products ___ improved.', o: ['has', 'have'], a: 0 },
      { t: 'mc', q: 'Either the manager or the assistants ___ the schedule. (closest subject is plural)', o: ['prepare', 'prepares'], a: 0, why: 'With **either…or**, the verb agrees with the **closer** subject: assistants → prepare.' },
      { t: 'mc', q: 'Every nurse and doctor ___ required to wash their hands.', o: ['is', 'are'], a: 0, why: '**Every** makes the subject singular.' },
      { t: 'mc', q: 'Which sentence is parallel?', o: ['I prefer walking to driving.', 'I prefer walking to drive.', 'I prefer to walk than driving.', 'I prefer walk to driving.'], a: 0 },
      { t: 'mc', q: 'Which sentence is parallel?', o: ['The plan is fast, cheap, and simple.', 'The plan is fast, cheap, and it is simple to do.', 'The plan is fast, cheaply, and simple.', 'The plan is fastly, cheap, and simple.'], a: 0 },
      { t: 'mc', q: 'Which sentence has a misplaced modifier?', o: ['I saw a dog on the way to work with a red collar.', 'On the way to work, I saw a dog with a red collar.', 'I saw a dog with a red collar on my way to work.', 'A dog with a red collar was near my office.'], a: 0, why: 'It sounds like "work" has a red collar. Move the description next to "dog".' },
      { t: 'mc', q: 'Fix the dangling modifier: "After finishing the report, the computer crashed."', o: ['After I finished the report, the computer crashed.', 'After finishing, the report crashed the computer.', 'The computer, after finishing the report, crashed.', 'Finishing the report, crashed the computer.'], a: 0 },
      { t: 'mc', q: 'Which sentence has a clear pronoun?', o: ['Sara told Mona that Sara\'s schedule had changed.', 'Sara told Mona that her schedule had changed.', 'She told her that her schedule changed.', 'Sara told Mona that it changed.'], a: 0, why: 'In the second choice, "her" could mean Sara or Mona.' },
      { t: 'fill', q: 'Neither of the reports ___ (be) finished. (present)', a: ['is'] },
      { t: 'order', a: 'Each of the students has a laptop' }
    ],
    L5U2: [
      { t: 'mc', q: 'Some people like early shifts, ___ others prefer to work at night.', o: ['whereas', 'consequently', 'furthermore', 'thereby'], a: 0 },
      { t: 'mc', q: 'She trained every new employee, ___ saving the company thousands of dollars.', o: ['thereby', 'whereas', 'nevertheless', 'albeit'], a: 0 },
      { t: 'mc', q: 'The results were ___ : some readers thought the drug helped, others thought it didn\'t.', o: ['ambiguous', 'coherent', 'empirical', 'plausible'], a: 0 },
      { t: 'mc', q: 'Stress is an ___ part of the job; you can\'t avoid it completely.', o: ['inherent', 'ambiguous', 'empirical', 'plausible'], a: 0 },
      { t: 'mc', q: 'The ___ of the new law will affect millions of families.', o: ['implications', 'hypotheses', 'paradigms', 'phenomena'], a: 0 },
      { t: 'mc', q: 'The internet created a new ___ for how people work and learn.', o: ['paradigm', 'hypothesis', 'phenomenon', 'evidence'], a: 0 },
      { t: 'mc', q: '"Admittedly, the plan is expensive. ___, it will save money over ten years."', o: ['Nevertheless', 'Furthermore', 'For instance', 'Consequently'], a: 0 },
      { t: 'mc', q: 'Which word signals a **result**?', o: ['therefore', 'whereas', 'albeit', 'furthermore'], a: 0 },
      { t: 'fill', q: 'His story didn\'t make sense. It wasn\'t ___ . (logical and organized)', a: ['coherent'] },
      { t: 'tf', q: '**Undermine** means to strengthen.', a: false, why: 'It means to **weaken**, often slowly.' },
      { t: 'listen', say: 'Consequently, the plan was postponed.', o: ['Consequently, the plan was postponed.', 'Constantly, the plan was posted.', 'Consequently, the plane was postponed.', 'Conveniently, the plan was proposed.'], a: 0 }
    ],
    L5U3: [
      { t: 'mc', p: 0, q: 'According to the passage, frequent task switching may reduce productivity by as much as…', o: ['40 percent', '4 percent', '14 percent', '90 percent'], a: 0 },
      { t: 'mc', p: 0, q: 'What does the brain actually do when we "multitask" on two demanding tasks?', o: ['It switches rapidly between them.', 'It does both at exactly the same time.', 'It stops working.', 'It ignores one task completely.'], a: 0 },
      { t: 'mc', p: 0, q: 'Which situation would the author consider the most harmful?', o: ['Writing an email while listening to a lecture', 'Walking while talking', 'Listening to music while cleaning', 'Breathing while reading'], a: 0, why: 'The problem arises "when both tasks require thought."' },
      { t: 'mc', p: 0, q: 'The final sentence suggests the author\'s advice is to…', o: ['focus fully on important tasks', 'never use technology', 'multitask only at work', 'take more breaks'], a: 0 },
      { t: 'mc', p: 1, q: 'In paragraph 1, the author says schools "grade it in red ink." This detail shows that…', o: ['society usually treats failure as something bad', 'teachers like red ink', 'schools are expensive', 'failure is rare'], a: 0 },
      { t: 'mc', p: 1, q: 'According to the author, a failed experiment is useful because it…', o: ['shows where our understanding is incomplete', 'confirms what we hoped', 'is easy to repeat', 'costs less money'], a: 0 },
      { t: 'mc', p: 1, q: 'What does the author mean by "failure as data, rather than as a judgment of their worth"?', o: ['Use failure as information, not as proof that you are not good enough.', 'Count your failures on a chart.', 'Failures make you worth less.', 'Only data scientists fail.'], a: 0 },
      { t: 'mc', p: 1, q: 'Which example would best illustrate "failing better"?', o: ['Trying a new recipe on a small batch, then adjusting it based on what went wrong', 'Never cooking again after one bad meal', 'Hiding a mistake from your boss', 'Repeating the same mistake without thinking'], a: 0 }
    ],
    L5U4: [
      { t: 'mc', q: 'Which thesis is too **broad**?', o: ['Technology is important.', 'Online classes help working adults finish college because they offer flexible schedules.', 'Cities should add bike lanes downtown to reduce traffic deaths.', 'Hospitals should offer interpreters to improve patient safety.'], a: 0 },
      { t: 'mc', q: 'Which sentence is a good **paraphrase** of "Sleep strengthens memory"?', o: ['Getting enough rest helps the brain store information.', 'Sleep strengthens memory.', 'Memory sleep strong.', 'Sleeping is important for strength.'], a: 0 },
      { t: 'mc', q: 'Formal replacement for "get" in "We got the results":', o: ['obtained', 'grabbed', 'took in', 'snagged'], a: 0 },
      { t: 'mc', q: 'Formal replacement for "think about":', o: ['consider', 'chew on', 'mull it', 'figure'], a: 0 },
      { t: 'mc', q: 'Which sentence is too informal for an essay?', o: ['Basically, kids these days are glued to their phones.', 'Many adolescents spend several hours a day on their phones.', 'Research suggests screen time affects sleep.', 'This trend has significant implications.'], a: 0 },
      { t: 'mc', q: 'Where does the thesis usually go in a college essay?', o: ['At the end of the introduction', 'In the conclusion only', 'In the middle of the second paragraph', 'In the title only'], a: 0 },
      { t: 'tf', q: 'In a summary, you should add your own opinion.', a: false, why: 'A summary reports the **author\'s** main ideas only.' },
      { t: 'say', text: 'Nevertheless, further research is required to substantiate this hypothesis.' }
    ],
    L5T: [
      { t: 'mc', q: 'You want to ask your manager for a meeting. The best email subject is:', o: ['Request for a short meeting this week', 'Hey', 'Important!!!', 'Meeting?'], a: 0 },
      { t: 'mc', q: 'Your manager praises your work. You say:', o: ['Thank you, I really appreciate that.', 'I know.', 'It was nothing, I am not good.', 'Okay.'], a: 0 },
      { t: 'mc', q: 'You need to decline a request politely in an email:', o: ['Unfortunately, I won\'t be able to cover Saturday, but I could help on Sunday.', 'No.', 'I can\'t, sorry, bye.', 'Not possible. Ask someone else.'], a: 0 },
      { t: 'mc', q: 'To follow up on an email with no reply, you write:', o: ['I wanted to follow up on my email from Monday about the schedule.', 'Why didn\'t you answer?', 'Answer me please!!', 'Hello again again.'], a: 0 },
      { t: 'mc', q: 'You disagree with feedback. The most professional response is:', o: ['I see what you mean. Could we look at an example together? I want to understand.', 'That\'s wrong.', 'You never liked me.', '(Leave the meeting.)'], a: 0 },
      { t: 'fill', q: 'Thank you for ___ this. (thinking about my request)', a: ['considering'] },
      { t: 'order', a: 'I am writing to ask about my schedule' },
      { t: 'dict', say: 'Please let me know if you have any questions.' }
    ],
    L6U1: [
      { t: 'mc', q: 'After each paragraph of a hard text, a good reader…', o: ['says its main point in a few words', 'reads the next paragraph faster', 'skips the examples', 'counts the words'], a: 0 },
      { t: 'mc', q: 'An answer choice says the author "completely rejects" a theory. The author wrote: "This theory has some weaknesses." This answer is…', o: ['too extreme', 'correct', 'out of scope', 'the main idea'], a: 0 },
      { t: 'mc', q: 'Which question asks you to **apply** the passage to a new situation?', o: ['Which of the following situations is most similar to the one described?', 'What does the word "novel" mean in line 4?', 'What is the main idea?', 'How many examples does the author give?'], a: 0 },
      { t: 'mc', q: 'An author writes: "Admittedly, the policy is expensive." The word **admittedly** signals that the author is…', o: ['accepting a point against their own view before continuing', 'changing their mind completely', 'giving an example', 'ending the passage'], a: 0 },
      { t: 'mc', q: 'In "Some argue X. Yet this overlooks Y," the author\'s view is most likely…', o: ['Y matters and X is incomplete', 'X is correct', 'neither X nor Y matters', 'the author has no view'], a: 0 },
      { t: 'mc', q: 'What should you do if two answer choices both seem correct?', o: ['Go back to the passage and look for the exact words that support one of them', 'Pick the longer one', 'Pick the first one', 'Skip the question forever'], a: 0 },
      { t: 'tf', q: 'Correlation always proves causation.', a: false }
    ],
    L6U2: [
      { t: 'mc', q: '"We need to get the ball rolling on the new project." The speaker wants to…', o: ['start the project', 'cancel the project', 'play a game', 'finish early'], a: 0 },
      { t: 'mc', q: 'Your manager says, "Thanks for going the extra mile." You…', o: ['did more than expected', 'drove too far', 'arrived late', 'made a mistake'], a: 0 },
      { t: 'mc', q: '"The meeting is running late." It will…', o: ['finish later than planned', 'start early', 'be cancelled', 'move outside'], a: 0 },
      { t: 'mc', q: '"Can you take the lead on the training?" You will…', o: ['be in charge of the training', 'attend the training', 'skip the training', 'record the training'], a: 0 },
      { t: 'mc', q: 'A new software has "a steep learning curve." It is…', o: ['hard to learn at first', 'very easy', 'broken', 'expensive'], a: 0 },
      { t: 'mc', q: 'Which is a polite way to admit a mistake at work?', o: ['I dropped the ball on that. I\'ll fix it right away.', 'It\'s not my fault.', 'Someone else did it.', 'Whatever.'], a: 0 },
      { t: 'mc', q: 'Your coworker says, "Let\'s think outside the box." She wants…', o: ['creative new ideas', 'to clean the boxes', 'to leave the office', 'to follow the old plan'], a: 0 },
      { t: 'fill', q: 'Thanks for the ___-___! I didn\'t know the meeting moved. (two words: heads…)', a: ['heads-up', 'heads up'] },
      { t: 'listen', say: 'Can you bring me up to speed on the project?', o: ['Can you bring me up to speed on the project?', 'Can you bring me a speed project?', 'Can you speed up the project?', 'Can you bring me up the stairs?'], a: 0 }
    ],
    L6U3: [
      { t: 'mc', p: 0, q: 'When was the Mona Lisa stolen?', o: ['1911', '1811', '1945', '1970'], a: 0 },
      { t: 'mc', p: 0, q: 'According to the passage, what happens when a painting is discovered to be a forgery?', o: ['Museums remove it and its value collapses.', 'Its price goes up.', 'Nothing changes.', 'It is given back to the artist.'], a: 0 },
      { t: 'mc', p: 0, q: 'In paragraph 2, the author uses forgeries to argue that…', o: ['we value more than what we can see', 'forgeries are beautiful', 'experts are always right', 'chemical analysis is useless'], a: 0 },
      { t: 'mc', p: 0, q: 'Which phrase best captures the author\'s final point?', o: ['A copy can reproduce the surface, but not the history.', 'Art is only about beauty.', 'Museums should sell their originals.', 'Theft makes art more beautiful.'], a: 0 }
    ],
    L6U4: [
      { t: 'mc', p: 0, q: 'When did paternalism come "under sustained attack," according to the passage?', o: ['By the 1970s', 'In the 1900s', 'In the 2020s', 'In the 1850s'], a: 0 },
      { t: 'mc', p: 0, q: 'Under paternalism, doctors often withheld bad news because they believed…', o: ['hope itself helped patients heal', 'patients didn\'t want to pay', 'it was illegal to tell them', 'nurses should tell them'], a: 0 },
      { t: 'mc', p: 0, q: 'According to research mentioned, how did many patients feel when given only a list of options?', o: ['Abandoned rather than respected', 'Very empowered', 'Bored', 'Angry at the nurses'], a: 0 },
      { t: 'mc', p: 0, q: 'The author would most likely agree with which statement?', o: ['A doctor can give an honest recommendation and still respect a patient\'s choice.', 'Doctors should never give opinions.', 'Patients should always follow the doctor.', 'Statistics are enough for every decision.'], a: 0 }
    ],
    L6T: [
      { t: 'mc', q: 'In an interview: "What is your greatest weakness?" The best answer:', o: ['I used to be nervous speaking in meetings, so I started preparing one point in advance. Now I speak up every week.', 'I have no weaknesses.', 'I am lazy sometimes.', 'I don\'t know.'], a: 0, why: 'Name a real weakness and show what you did to improve it.' },
      { t: 'mc', q: 'At the start of a presentation, the best opening is:', o: ['Today I\'d like to share one idea that could save us five hours a week.', 'Um, so, yeah, I\'m going to talk.', 'This is boring, sorry.', 'Let\'s finish fast.'], a: 0 },
      { t: 'mc', q: 'An interviewer asks, "Why should we hire you?" A strong answer:', o: ['I bring eight years of managing a business, I learn new systems quickly, and I work well with customers.', 'Because I need money.', 'Because I\'m nice.', 'I don\'t know, you decide.'], a: 0 },
      { t: 'mc', q: 'In a difficult conversation, which sentence describes the problem without blaming?', o: ['When extra work is left at five, I can\'t finish on time.', 'You are always lazy.', 'Everyone knows you leave work for me.', 'I hate working with you.'], a: 0 },
      { t: 'mc', q: 'After an interview, it is professional to…', o: ['send a short thank-you email', 'call every hour', 'post about it online', 'do nothing ever'], a: 0 },
      { t: 'order', a: 'I would be happy to answer any questions' },
      { t: 'dict', say: 'Thank you for having me.' }
    ]
  };
  (window.SEKKA_LEVELS || []).forEach(L => L.units.forEach(u => {
    const extra = EXTRA[u.id];
    if (extra && !u._extra3) { u.items = (u.items || []).concat(extra); u._extra3 = true; }
  }));
})();
