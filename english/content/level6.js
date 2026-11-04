window.SEKKA_LEVELS = window.SEKKA_LEVELS || [];
window.SEKKA_LEVELS.push({
  id: 'L6', n: 6, title: 'Advanced: Career and College', ar: 'متقدم: الشغل والجامعة', grade: 'Advanced · college & career', cefr: 'CEFR C1',
  cando: 'Lead conversations and meetings, read difficult college texts, and argue a point clearly in writing.',
  units: [
    {
      id: 'L6U1', kind: 'strategy', title: 'Reading Hard Texts: A College Method', ar: 'طريقة لقراءة النصوص الصعبة',
      lesson: [
        { p: 'College courses, placement tests, and professional reports all ask the same thing: understand a difficult text and reason about it. This method works for any hard reading, from a textbook chapter to a company policy.' },
        { ar: 'الطريقة دي بتنفع لأي نص صعب: كتاب الجامعة، امتحان تحديد المستوى، أو تقرير في الشغل.' },
        { h: 'Three kinds of questions' },
        { table: [['Kind', 'About', 'Sounds like'], ['**Understanding**', 'What the text says and means', '"The author\'s main point is…", "In paragraph 3, the word X means…"'], ['**Reasoning inside the text**', 'How the argument is built', '"The author mentions X in order to…", "Which claim has the least support?"'], ['**Reasoning beyond the text**', 'Applying the ideas to a new situation', '"Which new fact would weaken…?", "The author would probably agree that…"']] },
        { h: 'A 4-step method' },
        { ex: ['1. Read actively. After each paragraph, say its point in five words or less.', '2. Find the author\'s voice. Separate the author\'s opinion from other people\'s opinions.', '3. Before the answers, predict. What would a good answer say?', '4. Eliminate. Cross out answers that are too extreme, off-topic, or the opposite.'] },
        { h: 'Signs of a wrong answer' },
        { table: [['Trap', 'Example'], ['Too extreme', 'Words like **always, never, all, only, completely** when the author was careful'], ['Out of scope', 'True in real life, but the text never discusses it'], ['Half right', 'The first half matches; the second half twists it'], ['Opposite', 'The view of someone the author argues against']] },
        { tip: 'The same skill helps at work: when you read an email or a policy, ask "What does the writer want, and what is the evidence?"' }
      ],
      items: [
        { t: 'mc', q: '"Which of the following findings would most weaken the author\'s argument?" This question asks you to…', o: ['reason beyond the text', 'find a word meaning', 'summarize paragraph 1', 'find a date'], a: 0 },
        { t: 'mc', q: '"As used in paragraph 2, the word *novel* most nearly means…" This is a…', o: ['understanding question', 'reasoning beyond the text question', 'math question', 'trick question'], a: 0 },
        { t: 'mc', q: '"The author mentions the 1920s exhibition mainly in order to…" This asks about…', o: ['how the argument is built (reasoning inside the text)', 'applying ideas to a new situation', 'vocabulary only'], a: 0 },
        { t: 'mc', q: 'An author writes: "Some evidence suggests that urban gardens may reduce stress." Which answer is **too extreme**?', o: ['Urban gardens always eliminate stress.', 'Urban gardens might lower stress.', 'There is some support for gardens reducing stress.', 'Gardens may have psychological benefits.'], a: 0, why: '**always** and **eliminate** are much stronger than "some evidence" and "may reduce".' },
        { t: 'mc', q: 'The text argues that a painter was underappreciated in her lifetime. An answer says "She was the most famous painter of her century." This answer is…', o: ['the opposite of the text', 'a correct inference', 'out of scope', 'half right'], a: 0 },
        { t: 'mc', q: 'The author discusses music education. An answer says "Music lessons increase math scores." The text never mentions math. This answer is…', o: ['out of scope', 'too extreme', 'the main idea', 'the author\'s assumption'], a: 0 },
        { t: 'mc', q: 'What is the best first step after reading a question?', o: ['Predict the answer in your own words before reading the choices', 'Choose the longest answer', 'Read the choices quickly and pick one', 'Skip to the next text'], a: 0 },
        { t: 'mc', q: '"Critics claim the novel is sentimental. This view misses the book\'s quiet irony." The author thinks the novel…', o: ['has irony that critics overlook', 'is sentimental', 'is badly written', 'has no irony'], a: 0, why: 'Separate the author\'s voice ("This view misses…") from the critics\' view.' },
        { t: 'mc', q: 'A company email says: "While the new schedule has some drawbacks, it will reduce overtime costs." The writer most likely…', o: ['supports the new schedule despite its problems', 'opposes the new schedule', 'thinks the schedule is perfect', 'has no opinion'], a: 0 },
        { t: 'mc', q: 'Countries that eat more chocolate win more Nobel Prizes. The best conclusion is:', o: ['This is a correlation that other factors, such as wealth, may explain.', 'Chocolate makes people smarter.', 'Nobel Prizes cause chocolate sales.', 'The data must be false.'], a: 0, why: '**Correlation** (two things happen together) is not **causation** (one causes the other).' },
        { t: 'tf', q: 'In a reading test, an answer that is true in real life is always correct.', a: false, why: 'The answer must be supported by **the text**.' }
      ]
    },
    {
      id: 'L6U2', kind: 'vocab', title: 'Workplace Idioms and Professional Expressions', ar: 'تعبيرات الشغل',
      lesson: [
        { p: 'Coworkers and managers use many **idioms**: expressions whose meaning is different from the separate words. Understanding them is a big step toward following fast conversations at work.' },
        { ar: 'الـ idioms تعبيرات معناها مختلف عن معنى كل كلمة لوحدها. زي ما بنقول في العربي «على راسي» ومش قصدنا الراس فعلاً.' },
        { tip: 'You don\'t need to use every idiom yourself. First, learn to **understand** them. Then use the ones you like.' }
      ],
      words: [
        { w: 'touch base', ar: 'نتواصل / نطمّن على بعض', d: 'To contact someone briefly to share an update.', ex: 'Let\'s touch base on Friday about the project.' },
        { w: 'on the same page', ar: 'متفقين / فاهمين نفس الحاجة', d: 'Agreeing or understanding something the same way.', ex: 'Before we start, let\'s make sure we\'re on the same page.' },
        { w: 'get the ball rolling', ar: 'نبدأ', d: 'To start an activity or process.', ex: 'I\'ll send the first email to get the ball rolling.' },
        { w: 'heads-up', ar: 'تنبيه مسبق', d: 'A warning or notice in advance.', ex: 'Thanks for the heads-up about the meeting change.' },
        { w: 'follow up', ar: 'يتابع', d: 'To contact someone again to continue or check on something.', ex: 'I\'ll follow up with the client tomorrow.' },
        { w: 'bottom line', ar: 'الخلاصة / أهم نقطة', d: 'The most important fact or result.', ex: 'The bottom line is that we need more staff.' },
        { w: 'behind schedule', ar: 'متأخرين عن الميعاد', d: 'Later than planned.', ex: 'The project is two weeks behind schedule.' },
        { w: 'take the lead', ar: 'ياخد القيادة / يمسك الموضوع', d: 'To be in charge of something.', ex: 'Can you take the lead on this task?' },
        { w: 'a learning curve', ar: 'فترة تعلّم', d: 'The time it takes to learn something new.', ex: 'The new system has a steep learning curve.' },
        { w: 'go the extra mile', ar: 'يعمل أكتر من المطلوب', d: 'To do more than is expected.', ex: 'She always goes the extra mile for customers.' },
        { w: 'think outside the box', ar: 'يفكر بطريقة جديدة', d: 'To think in a new, creative way.', ex: 'We need to think outside the box to solve this.' },
        { w: 'on short notice', ar: 'على السريع / من غير ميعاد كافي', d: 'With very little warning.', ex: 'Sorry to ask on short notice, but can you cover my shift?' },
        { w: 'run late', ar: 'يتأخر', d: 'To be later than expected.', ex: 'The meeting is running late.' },
        { w: 'up to speed', ar: 'متابع وعارف آخر التطورات', d: 'Having the newest information.', ex: 'Can you bring me up to speed on what I missed?' },
        { w: 'a win-win', ar: 'كل الأطراف كسبانة', d: 'A situation good for everyone.', ex: 'Flexible hours are a win-win for staff and the company.' },
        { w: 'drop the ball', ar: 'يقصّر / ينسى حاجة مهمة', d: 'To make a mistake by not doing something you should.', ex: 'I dropped the ball on that email. I\'ll send it now.' }
      ],
      items: [
        { t: 'mc', q: '"Let\'s touch base next week." The speaker wants to…', o: ['talk briefly to share updates', 'play a ball game', 'end the project', 'meet at a baseball field'], a: 0 },
        { t: 'mc', q: '"Thanks for the heads-up." Someone gave you…', o: ['a warning in advance', 'a new hat', 'a promotion', 'a complaint'], a: 0 },
        { t: 'mc', q: '"I dropped the ball on that report." The speaker…', o: ['made a mistake by not doing it', 'finished it early', 'gave it to someone', 'lost a ball'], a: 0 },
        { t: 'mc', q: 'Your manager says: "Can you bring me up to speed?" You should…', o: ['tell her the latest updates', 'walk faster', 'drive her to work', 'repeat your question'], a: 0 },
        { t: 'mc', q: '"The project is behind schedule." It is…', o: ['late', 'early', 'cancelled', 'finished'], a: 0 },
        { t: 'mc', q: 'Before we decide, let\'s make sure we\'re all ___.', o: ['on the same page', 'behind schedule', 'a win-win', 'on short notice'], a: 0 },
        { t: 'mc', q: '"The bottom line is we can\'t afford it." "Bottom line" means…', o: ['the most important point', 'the last line of a page', 'the lowest price', 'a long list'], a: 0 },
        { t: 'mc', q: 'Which phrase means "do more than expected"?', o: ['go the extra mile', 'run late', 'touch base', 'follow up'], a: 0 },
        { t: 'mc', q: 'Your coworker asks you to work tomorrow, and it\'s already 8 p.m. She is asking ___.', o: ['on short notice', 'on the same page', 'up to speed', 'outside the box'], a: 0 },
        { t: 'mc', q: '"I\'ll follow up with the customer." The speaker will…', o: ['contact the customer again', 'walk behind the customer', 'forget the customer', 'cancel the order'], a: 0 },
        { t: 'fill', q: 'Working from home on Fridays is a ___-___: we save time and the company saves money. (two words: win…)', a: ['win-win', 'win win'] },
        { t: 'tf', q: '"There is a learning curve" means it takes time to learn something new.', a: true },
        { t: 'listen', say: 'Let\'s touch base on Friday to get the ball rolling.', o: ['Let\'s touch base on Friday to get the ball rolling.', 'Let\'s touch the base on Friday and roll the ball.', 'Let\'s talk Friday about the rolling ball.', 'Let\'s touch face on Friday.'], a: 0 }
      ]
    },
    {
      id: 'L6U3', kind: 'reading', title: 'Critical Reading: Art and Authenticity', ar: 'قراءة نقدية: الفن والأصالة',
      lesson: [
        { p: 'This is a long, college-level passage, like the readings in a first-year college course. Give yourself **10 minutes** for the passage and its questions. Use the 4-step method: read actively, find the author\'s voice, predict, eliminate.' },
        { ar: 'اديكي ١٠ دقايق للقطعة والأسئلة. بعد كل فقرة قولي فكرتها في كلمتين.' }
      ],
      passages: [
        { title: 'The Original and the Copy', text: 'In 1911, the Mona Lisa was stolen from the Louvre. For more than two years, the painting was missing, and something curious happened: crowds came to the museum to stare at the empty space on the wall. According to some accounts, more people came to see the blank spot than had come to see the painting itself. The episode raises an uncomfortable question about what, exactly, we value when we value a work of art.\n\nThe common answer is beauty, or skill, or meaning. Yet these answers struggle to explain our attitude toward copies. A skilled forgery may be visually identical to an original; trained experts sometimes cannot tell the difference without chemical analysis. If what we prized were only what we see, the discovery that a painting is a forgery should not change our experience of it. But it does. Museums quietly remove such works, and their market value collapses overnight.\n\nSome philosophers conclude that our reverence for originals is a kind of superstition: a belief, like the belief in holy relics, that physical contact with a great person leaves a trace in an object. On this view, the art market is less a judge of beauty than a trade in signatures. There is something to this argument, but it goes too far. An original is not merely an object the artist touched. It is the record of a series of decisions, including mistakes, corrections, and hesitations, that a copy can only imitate after the fact. To see the original is to see a mind at work; to see a copy is to see a mind imitating another mind\'s work.\n\nThis explanation also accounts for the crowds at the empty wall. They did not come to see beauty. They came to stand near a story: a theft, a loss, a mystery. In this sense they were not so different from the art lovers who came before them. What draws us to the original is not only what it looks like but what happened to it and through it. A copy can reproduce the surface. It cannot reproduce the history.' }
      ],
      items: [
        { t: 'mc', p: 0, q: 'The central thesis of the passage is that:', o: ['we value original artworks largely for the human history and decisions they record, not only for how they look.', 'forgeries are as valuable as originals.', 'the art market is entirely based on superstition.', 'the Mona Lisa is the most beautiful painting in the world.'], a: 0 },
        { t: 'mc', p: 0, q: 'The author mentions the crowds visiting the empty wall primarily in order to:', o: ['raise a question about what people really value in art', 'prove that the Louvre was poorly guarded', 'show that the Mona Lisa was not beautiful', 'argue that copies should be displayed'], a: 0 },
        { t: 'mc', p: 0, q: 'The author\'s attitude toward the "superstition" view of the philosophers is best described as:', o: ['partial agreement with an important reservation', 'complete agreement', 'complete rejection', 'indifference'], a: 0, why: '"There is something to this argument, but it goes too far."' },
        { t: 'mc', p: 0, q: 'According to the author, what can an original show that a copy cannot?', o: ['The real sequence of an artist\'s decisions and corrections', 'Brighter colors', 'A higher price', 'The artist\'s signature'], a: 0 },
        { t: 'mc', p: 0, q: 'Which new finding would most **challenge** the author\'s explanation?', o: ['Viewers who are told nothing about a painting\'s history still strongly prefer originals they cannot tell apart from copies.', 'Forgeries lose market value when discovered.', 'Many tourists visit famous museums.', 'Experts sometimes need chemical analysis to identify forgeries.'], a: 0, why: 'If people prefer originals **without** knowing the history, the "history" explanation is weakened.' },
        { t: 'mc', p: 0, q: 'As used in paragraph 3, "reverence" most nearly means:', o: ['deep respect', 'fear', 'confusion', 'dislike'], a: 0 },
        { t: 'mc', p: 0, q: 'Based on the passage, the author would most likely agree that:', o: ['a famous photograph\'s original print may be valued for its history even if copies look the same.', 'museums should replace originals with copies.', 'beauty is the only thing that matters in art.', 'art experts are never fooled by forgeries.'], a: 0, why: 'This is **Reasoning Beyond the Text**: apply the idea to a new case.' },
        { t: 'mc', p: 0, q: 'The comparison between originals and "holy relics" is used by:', o: ['some philosophers, to suggest our respect for originals is irrational', 'the author, to prove the art market is fair', 'museum directors, to sell tickets', 'forgers, to defend themselves'], a: 0 }
      ]
    },
    {
      id: 'L6U4', kind: 'reading', title: 'Critical Reading: Doctors and Patients', ar: 'قراءة نقدية: الدكتور والمريض',
      lesson: [
        { p: 'A second college-level passage, about how doctors and patients make decisions together. Again, about **10 minutes**. Watch for where the author agrees and disagrees with others.' },
        { tip: 'When an author says "This is true, but…" the part **after "but"** is usually the author\'s real view.' }
      ],
      passages: [
        { title: 'Choosing for Patients', text: 'For most of the twentieth century, medicine operated on a model that critics now call paternalism. The physician, possessing expert knowledge, decided what was best, and the patient was expected to comply. Doctors routinely withheld grim diagnoses on the theory that hope was itself therapeutic. By the 1970s, this model had come under sustained attack, and in its place arose the principle of patient autonomy: the idea that competent adults have the right to make decisions about their own bodies, even decisions their doctors consider unwise.\n\nFew today would argue for a return to the old model. Yet the triumph of autonomy has produced problems of its own. In its most extreme form, the doctor becomes a kind of waiter, presenting a menu of options with their statistical risks and stepping back while the patient chooses. Research on decision-making suggests that this approach can overwhelm rather than empower. Patients facing frightening diagnoses often report that being handed a list of choices, with no recommendation, felt less like respect than abandonment.\n\nThe solution, some ethicists argue, is "shared decision-making," in which physicians offer both information and a recommendation, while the patient remains free to refuse. Critics worry that any recommendation, coming from an authority figure, will pressure patients into agreement and quietly restore paternalism. The worry is not baseless. But it assumes that information without guidance is neutral, and that assumption is doubtful. The order in which risks are presented, the words used to describe them, even the doctor\'s tone of voice all shape a patient\'s choice. Influence, in other words, is unavoidable. The question is not whether physicians will influence patients but whether they will do so openly, with reasons the patient can examine and reject.\n\nRespect for autonomy, properly understood, does not require doctors to keep their opinions to themselves. It requires that patients be treated as people capable of hearing an opinion and deciding for themselves what to do with it.' }
      ],
      items: [
        { t: 'mc', p: 0, q: 'The main purpose of the passage is to:', o: ['argue that respecting autonomy is compatible with doctors giving open recommendations', 'defend a return to medical paternalism', 'describe the history of hospitals', 'argue that patients should never make medical decisions'], a: 0 },
        { t: 'mc', p: 0, q: 'The author compares the doctor to "a kind of waiter" in order to:', o: ['criticize an extreme version of autonomy in which doctors only present options', 'praise doctors for their service', 'show that doctors are paid too little', 'describe paternalism'], a: 0 },
        { t: 'mc', p: 0, q: 'Which assumption does the author say the critics of shared decision-making make?', o: ['That information given without a recommendation is neutral', 'That doctors are always right', 'That patients prefer paternalism', 'That statistics are unreliable'], a: 0 },
        { t: 'mc', p: 0, q: 'The author\'s response to the critics\' worry is best described as:', o: ['acknowledging it is reasonable, then arguing that influence happens anyway', 'dismissing it as foolish', 'fully accepting it', 'ignoring it'], a: 0, why: '"The worry is not baseless. **But** it assumes…" Read the part after **but**.' },
        { t: 'mc', p: 0, q: 'As used in paragraph 1, "therapeutic" most nearly means:', o: ['helpful for healing', 'dangerous', 'expensive', 'scientific'], a: 0 },
        { t: 'mc', p: 0, q: 'Which situation best fits the author\'s ideal?', o: ['A doctor explains options, recommends one with clear reasons, and accepts the patient\'s refusal.', 'A doctor chooses a treatment without telling the patient.', 'A doctor gives a list of statistics and leaves the room.', 'A patient chooses a treatment based only on online reviews.'], a: 0 },
        { t: 'mc', p: 0, q: 'Which finding would most **support** the author\'s claim that influence is unavoidable?', o: ['Patients choose surgery more often when its risks are described as a "90% survival rate" than as a "10% death rate."', 'Most patients trust their doctors.', 'Paternalism was common in the 1950s.', 'Some patients refuse all treatment.'], a: 0, why: 'The same information, framed differently, changes choices. So even "neutral" information influences.' },
        { t: 'tf', p: 0, q: 'The author wants to return to the paternalist model.', a: false, why: '"Few today would argue for a return to the old model," and the author does not.' }
      ],
      speak: [
        'Competent adults have the right to make decisions about their own bodies.',
        'Influence, in other words, is unavoidable.',
        'Let\'s touch base on Friday to make sure we\'re on the same page.',
        'The bottom line is that we need a clear plan.'
      ],
      write: [
        { task: '**Reflection:** In 5–6 sentences, explain the author\'s argument in "Choosing for Patients" and say whether you agree. Use at least two transition words (however, therefore, nevertheless…).', ar: 'في ٥-٦ جمل اشرحي رأي الكاتب وقولي انتي موافقة ولا لأ. استخدمي كلمتين ربط على الأقل.' }
      ]
    }
  ],
  test: [
    { t: 'mc', q: 'An author writes: "While the policy has flaws, abandoning it would be worse." The author most likely:', o: ['supports keeping the policy despite its problems', 'wants to abandon the policy', 'thinks the policy is perfect', 'has no opinion'], a: 0 },
    { t: 'mc', q: 'Your manager says: "I\'m running late. Can you get the ball rolling?" She wants you to…', o: ['start the meeting without her', 'cancel the meeting', 'wait for her', 'go home'], a: 0 }
  ]
});
