/* Extra practice items for Levels 3 and 4, appended to existing units by id (ids stay stable). */
(function () {
  const EXTRA = {
    L3U1: [
      { t: 'mc', q: 'I ___ my keys. I can\'t find them anywhere!', o: ['have lost', 'lost yesterday', 'lose', 'am losing'], a: 0, why: 'A past action with a result **now** → present perfect.' },
      { t: 'mc', q: 'We ___ to Florida in 2019.', o: ['went', 'have gone', 'have been going', 'go'], a: 0 },
      { t: 'mc', q: 'How long ___ you worked at the hospital?', o: ['have', 'did', 'are', 'do'], a: 0 },
      { t: 'mc', q: 'She has ___ finished her homework. (before now, earlier than expected)', o: ['already', 'yet', 'since', 'ago'], a: 0 },
      { t: 'mc', q: 'Have you called the doctor ___?', o: ['yet', 'already', 'since', 'for'], a: 0, why: '**yet** goes at the end of questions and negatives.' },
      { t: 'fill', q: 'I have ___ (write) three emails this morning.', a: ['written'] },
      { t: 'fill', q: 'He has ___ (be) a nurse for twenty years.', a: ['been'] },
      { t: 'fill', q: 'Summer is ___ (hot) than spring.', a: ['hotter'], why: 'Short word ending consonant-vowel-consonant: double the last letter: hot**ter**.' },
      { t: 'fill', q: 'That was the ___ (bad) traffic I have ever seen.', a: ['worst'] },
      { t: 'mc', q: 'This apartment is ___ than our old one.', o: ['more comfortable', 'comfortabler', 'most comfortable', 'more comfortabler'], a: 0 },
      { t: 'mc', q: 'Look at those clouds! It ___ rain.', o: ['is going to', 'will be', 'has', 'did'], a: 0, why: 'A prediction from **evidence you can see now** → going to.' },
      { t: 'mc', q: '"I forgot my wallet." "Don\'t worry, I ___ pay."', o: ['will', 'am going to', 'have', 'paid'], a: 0 },
      { t: 'order', a: 'Have you ever worked at night' },
      { t: 'dict', say: 'I have lived here for ten years.' }
    ],
    L3U2: [
      { t: 'mc', q: 'Use the roots: **spectator** is a person who…', o: ['watches an event', 'carries things', 'writes books', 'says no'], a: 0, why: '**spect** = look.' },
      { t: 'mc', q: 'Use the roots: **export** means to…', o: ['carry goods out of a country', 'look at goods', 'study goods', 'write about goods'], a: 0, why: '**ex** = out, **port** = carry.' },
      { t: 'mc', q: 'Use the roots: **contradict** means to…', o: ['say the opposite', 'say again', 'say before', 'write down'], a: 0, why: '**contra** = against, **dict** = say.' },
      { t: 'mc', q: '**Unreliable** means…', o: ['cannot be trusted', 'very reliable', 'reliable again', 'full of trust'], a: 0 },
      { t: 'mc', q: '**Prepay** means to pay…', o: ['before', 'after', 'again', 'wrongly'], a: 0 },
      { t: 'mc', q: '**Misspell** means to spell…', o: ['wrongly', 'again', 'before', 'well'], a: 0 },
      { t: 'mc', q: 'A **graph** in math class is something you…', o: ['draw (write) to show numbers', 'carry', 'listen to', 'eat'], a: 0 },
      { t: 'fill', q: 'Without care = care___', a: ['less', 'careless'] },
      { t: 'fill', q: 'Can be washed = wash___', a: ['able', 'washable'] },
      { t: 'tf', q: '**Television** comes from **tele** (far) + **vision** (see): seeing things far away.', a: true },
      { t: 'listen', say: 'reliable', o: ['reliable', 'relieve', 'religion', 'available'], a: 0 }
    ],
    L3U3: [
      { t: 'mc', p: 0, q: 'How many adults get less sleep than they need?', o: ['Nearly one in three', 'Almost all', 'One in ten', 'None'], a: 0 },
      { t: 'mc', p: 0, q: 'According to the passage, people who sleep too little are more likely to…', o: ['get sick and make mistakes', 'remember more', 'feel more energy', 'lose weight'], a: 0 },
      { t: 'mc', p: 0, q: 'The last sentence, "It is working," means:', o: ['The brain does important work during sleep.', 'People should work at night.', 'The body never rests.', 'Sleep is a job.'], a: 0 },
      { t: 'mc', p: 1, q: 'How old was Fatma when she arrived in New York?', o: ['Forty-two', 'Twenty', 'Eight', 'Fifty'], a: 0 },
      { t: 'mc', p: 1, q: 'Why did Fatma point at things in the supermarket?', o: ['She didn\'t know the English words.', 'She was in a hurry.', 'She could not see well.', 'The store was loud.'], a: 0, why: 'An **inference** from "she knew about twenty words."' },
      { t: 'mc', p: 1, q: 'What did Fatma do the next week?', o: ['She signed up for a free English class.', 'She moved to a new city.', 'She hired a tutor.', 'She stopped going to school meetings.'], a: 0 },
      { t: 'mc', p: 1, q: 'What is Fatma\'s job at the end of the story?', o: ['Class volunteer', 'Teacher\'s aide at her daughter\'s school', 'Librarian', 'Radio host'], a: 0 },
      { t: 'mc', q: 'Context clue: "The soup was **bland**, without any salt or spices." Bland means:', o: ['without much taste', 'very spicy', 'very hot', 'expensive'], a: 0 },
      { t: 'mc', q: 'Context clue: "She was **exhausted**. She had worked for fourteen hours." Exhausted means:', o: ['very tired', 'very happy', 'bored', 'hungry'], a: 0 },
      { t: 'mc', q: 'A newspaper article explains how a new bridge was built. The author\'s purpose is mainly to…', o: ['inform', 'entertain', 'persuade'], a: 0 }
    ],
    L3U4: [
      { t: 'listen', say: 'street', o: ['street', 'estreet', 'treat', 'sweet'], a: 0 },
      { t: 'listen', say: 'school', o: ['school', 'skull', 'cool', 'stool'], a: 0 },
      { t: 'mc', q: 'Which is the best **concluding** sentence for a paragraph about walking?', o: ['In conclusion, walking every day is a simple way to stay healthy.', 'I like shoes.', 'For example, I walk to the store.', 'First, walking is free.'], a: 0 },
      { t: 'mc', q: 'Which detail best **supports** "Learning two languages helps children"?', o: ['Studies show bilingual children are often better at switching between tasks.', 'My neighbor has a dog.', 'Some children like ice cream.', 'English has 26 letters.'], a: 0 },
      { t: 'mc', q: 'Which linking word adds another reason?', o: ['In addition', 'However', 'In conclusion', 'For example'], a: 0 },
      { t: 'mc', q: '"Turn it on" usually sounds like:', o: ['tur-ni-ton', 'turn — it — on', 'turnit-on', 'tern-on'], a: 0 },
      { t: 'say', text: 'In spring, the strong wind blows through the trees.' },
      { t: 'say', text: 'Please pick it up and put it on the table.' }
    ],
    L3T: [
      { t: 'mc', q: 'Your manager says: "Put the boxes in storage after lunch." You check:', o: ['So, after lunch I should put the boxes in storage, right?', 'What boxes?', 'Okay okay.', 'Why?'], a: 0 },
      { t: 'mc', q: 'The caller is speaking too fast. You say:', o: ['I\'m sorry, could you repeat that a little more slowly?', 'Too fast!', 'I don\'t speak English.', '(Hang up.)'], a: 0 },
      { t: 'mc', q: 'You want to transfer a call. You say:', o: ['One moment, please. I\'ll transfer you.', 'Wait.', 'Go to another person.', 'Bye.'], a: 0 },
      { t: 'mc', q: 'Which is the best way to end a phone call?', o: ['Thank you for calling. Have a good day.', 'Okay, finish.', 'Bye bye bye.', 'That\'s all, goodbye forever.'], a: 0 },
      { t: 'mc', q: 'To make a polite request: "___ mind waiting a moment?"', o: ['Would you', 'Do you', 'Will you', 'Can you'], a: 0 },
      { t: 'fill', q: 'Can I take a ___? (a note for someone who isn\'t here)', a: ['message'] },
      { t: 'order', a: 'Let me read that back to you' },
      { t: 'dict', say: 'May I ask who\'s calling?' }
    ],
    L4U1: [
      { t: 'fill', q: 'The meeting ___ (cancel) because the manager was sick. (passive, past)', a: ['was cancelled', 'was canceled'] },
      { t: 'fill', q: 'All the rooms ___ (clean) every morning. (passive, present)', a: ['are cleaned'] },
      { t: 'mc', q: 'The new policy ___ next month.', o: ['will be introduced', 'will introduce', 'is introducing', 'introduced'], a: 0 },
      { t: 'mc', q: 'Rice ___ in many parts of Egypt.', o: ['is grown', 'grows by', 'is growing by', 'grown'], a: 0 },
      { t: 'mc', q: 'The customer ___ order was lost called again.', o: ['whose', 'who', 'which', 'where'], a: 0 },
      { t: 'mc', q: 'The form ___ you need is on the front desk.', o: ['that', 'who', 'whose', 'where'], a: 0 },
      { t: 'mc', q: 'Do you remember the restaurant ___ we had our first date?', o: ['where', 'which', 'who', 'whose'], a: 0 },
      { t: 'mc', q: 'If you press this button, the machine ___.', o: ['stops', 'would stop', 'stopped', 'would have stopped'], a: 0 },
      { t: 'mc', q: 'If I won the lottery, I ___ a house for my parents.', o: ['would buy', 'will buy', 'buy', 'bought'], a: 0 },
      { t: 'mc', q: 'If she had taken the job, she ___ to Chicago.', o: ['would have moved', 'will move', 'would move', 'moved'], a: 0 },
      { t: 'mc', q: 'If it ___ tomorrow, we will cancel the picnic.', o: ['rains', 'will rain', 'would rain', 'rained'], a: 0, why: 'In the **if** part of a first conditional, use the present, not will.' },
      { t: 'tf', q: '"If I will see him, I will tell him" is correct.', a: false, why: 'Say: **If I see him**, I will tell him.' },
      { t: 'order', a: 'The woman who called you is my manager' }
    ],
    L4U2: [
      { t: 'mc', q: 'Before we choose a method, we need to ___ the problem carefully.', o: ['analyze', 'vary', 'consist', 'assume'], a: 0 },
      { t: 'mc', q: 'What is your ___ to solving this problem?', o: ['approach', 'evidence', 'data', 'factor'], a: 0 },
      { t: 'mc', q: 'The teacher asked us to ___ the word "democracy."', o: ['define', 'indicate', 'vary', 'consist'], a: 0 },
      { t: 'mc', q: 'People ___ the same poem in very different ways.', o: ['interpret', 'establish', 'consist', 'benefit'], a: 0 },
      { t: 'mc', q: 'The word means different things in different ___s.', o: ['context', 'method', 'theory', 'data'], a: 0 },
      { t: 'mc', q: 'The adjective form of **vary** is:', o: ['various', 'variety', 'variously', 'vary'], a: 0 },
      { t: 'mc', q: 'The noun form of **assume** is:', o: ['assumption', 'assumer', 'assumable', 'assumed'], a: 0 },
      { t: 'fill', q: 'Regular exercise has many health ___s. (advantages)', a: ['benefit', 'benefits'] },
      { t: 'tf', q: '**Evidence** and **proof** have similar meanings.', a: true },
      { t: 'listen', say: 'We need more evidence before we can establish a theory.', o: ['We need more evidence before we can establish a theory.', 'We need more evident before we stabilize a theory.', 'We need evidence to estimate a theory.', 'We need some events to establish the story.'], a: 0 }
    ],
    L4U3: [
      { t: 'mc', p: 0, q: 'Which cities does the author mention besides Oslo?', o: ['Madrid and Seoul', 'Paris and London', 'Cairo and Dubai', 'New York and Tokyo'], a: 0 },
      { t: 'mc', p: 0, q: 'According to research mentioned, people on foot tend to…', o: ['visit more shops than drivers', 'spend less money', 'avoid cafés', 'shop online'], a: 0 },
      { t: 'mc', p: 0, q: '"This concern is real, and it must not be ignored" shows that the author…', o: ['takes the critics seriously', 'agrees cars should return', 'thinks critics are lying', 'is unsure of the claim'], a: 0 },
      { t: 'mc', p: 1, q: 'How long was Fleming on vacation?', o: ['Two weeks', 'Two months', 'Ten years', 'Two days'], a: 0 },
      { t: 'mc', p: 1, q: 'The passage says Fleming "was not known for keeping a tidy workspace." Why does the author include this?', o: ['It helps explain why the dishes were left out and grew mold.', 'To criticize Fleming.', 'To describe London.', 'To show he was lazy.'], a: 0, why: 'A **function** question: the detail sets up the accident.' },
      { t: 'mc', p: 1, q: 'What was penicillin used for by the end of World War II?', o: ['Saving soldiers from infected wounds', 'Making bread', 'Cleaning laboratories', 'Growing mold'], a: 0 },
      { t: 'mc', p: 1, q: 'The tone of the passage is mostly…', o: ['informative and admiring', 'angry', 'humorous', 'sad'], a: 0 },
      { t: 'mc', q: 'A writer says: "Some people claim homework is useless. However, studies show it improves memory." Which part is the **counterargument**?', o: ['Some people claim homework is useless.', 'However', 'studies show it improves memory', 'There is no counterargument.'], a: 0 }
    ],
    L4U4: [
      { t: 'mc', q: 'Which is correct?', o: ['I bought apples, oranges, and bananas.', 'I bought apples oranges and bananas.', 'I bought, apples, oranges, and bananas.', 'I bought apples, oranges, and, bananas.'], a: 0 },
      { t: 'mc', q: 'Which is a **fragment**?', o: ['While I was cooking dinner.', 'I was cooking dinner.', 'While I was cooking dinner, the phone rang.', 'The phone rang.'], a: 0 },
      { t: 'mc', q: 'Fix the run-on: "She works hard she wants a promotion."', o: ['She works hard because she wants a promotion.', 'She works hard, she wants a promotion.', 'She works hard she, wants a promotion.', 'She works, hard she wants a promotion.'], a: 0 },
      { t: 'mc', q: 'Which sentence uses a colon correctly?', o: ['Remember the rule: always check your work.', 'Remember: the rule always check your work.', 'Remember the: rule.', 'Remember the rule always: check.'], a: 0 },
      { t: 'mc', q: 'Which is correct?', o: ['However, the plan did not work.', 'However the plan, did not work.', 'However; the plan did not work.', 'However the plan did not work,'], a: 0, why: 'Put a comma after **However** at the start of a sentence.' },
      { t: 'tf', q: '"Because it was raining." is a complete sentence.', a: false },
      { t: 'say', text: 'Research indicates that people on foot visit more shops.' },
      { t: 'say', text: 'If I had known earlier, I would have called you.' }
    ],
    L4T: [
      { t: 'mc', q: 'You agree with a coworker\'s idea. You say:', o: ['I was thinking the same thing.', 'Maybe.', 'Whatever you want.', 'No comment.'], a: 0 },
      { t: 'mc', q: 'You want to return to an earlier point. You say:', o: ['Going back to what Sam said…', 'Stop, back!', 'Before, before.', 'Sam said, remember?'], a: 0 },
      { t: 'mc', q: 'At the end of the meeting, you want to confirm. You say:', o: ['Can I just check that we agree on the next steps?', 'Is it finished?', 'Okay, bye.', 'What now?'], a: 0 },
      { t: 'mc', q: 'Which phrase softens your opinion?', o: ['I think it might be better to…', 'You must…', 'Obviously, everyone knows…', 'That\'s the only way.'], a: 0 },
      { t: 'mc', q: 'A coworker interrupts you. You politely continue:', o: ['Sorry, could I just finish my point?', 'Be quiet!', 'Don\'t interrupt me!', '(Stop talking forever.)'], a: 0 },
      { t: 'fill', q: 'I see your ___, but I have a different idea. (what you mean)', a: ['point'] },
      { t: 'order', a: 'In my opinion we should start earlier' },
      { t: 'dict', say: 'That\'s a great point.' }
    ]
  };
  (window.SEKKA_LEVELS || []).forEach(L => L.units.forEach(u => {
    const extra = EXTRA[u.id];
    if (extra && !u._extra2) { u.items = (u.items || []).concat(extra); u._extra2 = true; }
  }));
})();
