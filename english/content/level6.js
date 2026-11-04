window.SEKKA_LEVELS = window.SEKKA_LEVELS || [];
window.SEKKA_LEVELS.push({
  id: 'L6', n: 6, title: 'MCAT Reading (CARS) and Science English', ar: 'قراءة الـ MCAT وإنجليزي العلوم', grade: 'Pre-med / MCAT', cefr: 'CEFR C1',
  units: [
    {
      id: 'L6U1', kind: 'strategy', title: 'How CARS Works', ar: 'إزاي قسم CARS بيشتغل',
      lesson: [
        { p: 'The MCAT has four sections. One of them is **CARS: Critical Analysis and Reasoning Skills**. It has **9 passages and 53 questions in 90 minutes**, about 10 minutes per passage. The passages are about humanities and social sciences (art, philosophy, history, ethics, culture). You do **not** need outside knowledge. Everything you need is in the passage.' },
        { ar: 'قسم CARS: ٩ قطع، ٥٣ سؤال، ٩٠ دقيقة. يعني حوالي ١٠ دقايق لكل قطعة. المواضيع فن وفلسفة وتاريخ وأخلاق. **مش محتاجة معلومات من برّه**، كل حاجة موجودة في القطعة.' },
        { h: 'The three question families' },
        { table: [['Family', 'About', 'Sounds like'], ['**Foundations of Comprehension** (about 30%)', 'What the passage says and means', '"The author\'s main point is…", "As used in paragraph 3, the word X means…"'], ['**Reasoning Within the Text** (about 30%)', 'How the argument is built and supported', '"Which claim is least supported?", "The author mentions X in order to…"'], ['**Reasoning Beyond the Text** (about 40%)', 'Applying the ideas to a new situation', '"Which new finding would most weaken…?", "The author would most likely agree that…"']] },
        { h: 'A 4-step method for each passage' },
        { ex: ['1. Read actively. After each paragraph, say its point in five words or less.', '2. Find the author\'s voice. Separate the author\'s opinion from other people\'s opinions.', '3. Before the answers, predict. What would a good answer say?', '4. Eliminate. Cross out answers that are too extreme, off-topic, or opposite.'] },
        { h: 'Signs of a wrong answer' },
        { table: [['Trap', 'Example'], ['Too extreme', 'Words like **always, never, all, only, completely** when the author was careful'], ['Out of scope', 'True in real life, but the passage never discusses it'], ['Half right', 'The first half matches; the second half twists it'], ['Opposite', 'The view of someone the author argues against']] },
        { tip: 'CARS rewards patience more than speed. Your English level matters most. That is why the earlier levels are the real MCAT preparation.' }
      ],
      items: [
        { t: 'mc', q: 'How many questions are in the CARS section?', o: ['53', '59', '30', '100'], a: 0 },
        { t: 'mc', q: 'How much outside knowledge does CARS require?', o: ['None. All information is in the passage.', 'A lot of biology', 'Some history facts', 'Chemistry formulas'], a: 0 },
        { t: 'mc', q: 'About how long should you spend on one CARS passage?', o: ['About 10 minutes', 'About 2 minutes', 'About 30 minutes', 'About 1 hour'], a: 0 },
        { t: 'mc', q: '"Which of the following findings would most weaken the author\'s argument?" This is a…', o: ['Reasoning Beyond the Text question', 'Foundations of Comprehension question', 'vocabulary question', 'math question'], a: 0 },
        { t: 'mc', q: '"As used in paragraph 2, the word *novel* most nearly means…" This is a…', o: ['Foundations of Comprehension question', 'Reasoning Beyond the Text question', 'science question', 'trick question'], a: 0 },
        { t: 'mc', q: '"The author mentions the 1920s exhibition primarily in order to…" This is a…', o: ['Reasoning Within the Text question', 'Reasoning Beyond the Text question', 'Foundations of Comprehension question'], a: 0 },
        { t: 'mc', q: 'An author writes: "Some evidence suggests that urban gardens may reduce stress." Which answer choice is **too extreme**?', o: ['Urban gardens always eliminate stress.', 'Urban gardens might lower stress.', 'There is some support for gardens reducing stress.', 'Gardens may have psychological benefits.'], a: 0, why: '**always** and **eliminate** are much stronger than "some evidence" and "may reduce".' },
        { t: 'mc', q: 'The passage argues that a painter was underappreciated in her lifetime. An answer says "She was the most famous painter of her century." This is…', o: ['the opposite of the passage', 'a correct inference', 'out of scope', 'half right'], a: 0 },
        { t: 'mc', q: 'The author discusses music education in schools. An answer choice says "Music lessons increase test scores in math." The passage never mentions math. This answer is…', o: ['out of scope', 'too extreme', 'the main idea', 'the author\'s assumption'], a: 0 },
        { t: 'mc', q: 'What is the best first step after reading a question?', o: ['Predict the answer in your own words before reading the choices', 'Choose the longest answer', 'Read the choices quickly and pick one', 'Skip to the next passage'], a: 0 },
        { t: 'mc', q: 'An author writes: "Critics claim the novel is sentimental. This view misses the book\'s quiet irony." The author\'s own view is that the novel…', o: ['contains irony that critics overlook', 'is sentimental', 'is badly written', 'has no irony'], a: 0, why: 'Separate the author\'s voice ("This view misses…") from the critics\' view.' },
        { t: 'tf', q: 'In CARS, an answer that is true in real life is always correct.', a: false, why: 'The answer must be supported by **the passage**.' }
      ]
    },
    {
      id: 'L6U2', kind: 'vocab', title: 'Medical and Science Word Parts', ar: 'مقاطع الكلمات الطبية والعلمية',
      lesson: [
        { p: 'The science sections of the MCAT and every medical textbook use Greek and Latin parts. With about 30 parts, you can understand hundreds of medical terms.' },
        { table: [['Part', 'Meaning', 'Example'], ['cardi(o)', 'heart', 'cardiology'], ['neur(o)', 'nerve, brain', 'neuron, neurology'], ['hepat(o)', 'liver', 'hepatitis'], ['nephr(o) / ren', 'kidney', 'nephron, renal'], ['gastr(o)', 'stomach', 'gastric'], ['derm', 'skin', 'dermatology'], ['hem(at)', 'blood', 'hemoglobin, hematology'], ['oste(o)', 'bone', 'osteoporosis'], ['-itis', 'inflammation', 'arthritis'], ['-ectomy', 'surgical removal', 'appendectomy'], ['-ology', 'study of', 'biology'], ['hypo-', 'below, too little', 'hypoglycemia'], ['hyper-', 'above, too much', 'hypertension'], ['endo-', 'inside', 'endocrine'], ['exo-', 'outside', 'exocrine'], ['-lysis', 'breaking down', 'glycolysis, hydrolysis']] },
        { ar: '**hyper** = زيادة، **hypo** = نقص. **hypertension** = ضغط عالي، **hypoglycemia** = سكر واطي. **itis** = التهاب: **hepatitis** = التهاب الكبد.' },
        { tip: 'Break a long word into parts: **gastro + enter + itis** = inflammation of the stomach and intestines.' }
      ],
      words: [
        { w: 'homeostasis', ar: 'الاتزان الداخلي للجسم', d: 'The body keeping its inside conditions (temperature, sugar, water) stable.', ex: 'Sweating helps maintain homeostasis.' },
        { w: 'enzyme', ar: 'إنزيم', d: 'A protein that speeds up a chemical reaction in the body.', ex: 'Enzymes in saliva begin to digest starch.' },
        { w: 'metabolism', ar: 'التمثيل الغذائي / الأيض', d: 'All the chemical reactions that keep a living thing alive.', ex: 'Thyroid hormones affect metabolism.' },
        { w: 'catalyst', ar: 'عامل مساعد (محفّز)', d: 'Something that speeds up a reaction without being used up.', ex: 'An enzyme is a biological catalyst.' },
        { w: 'variable', ar: 'متغيّر', d: 'Something that can change in an experiment. The independent variable is what you change; the dependent variable is what you measure.', ex: 'Temperature was the independent variable.' },
        { w: 'correlation', ar: 'ارتباط / علاقة', d: 'When two things change together.', ex: 'There is a correlation between smoking and lung disease.' },
        { w: 'causation', ar: 'سببية', d: 'When one thing actually causes another. Correlation is not always causation.', ex: 'The study could not prove causation.' },
        { w: 'hypertension', ar: 'ضغط الدم العالي', d: 'High blood pressure. (hyper = too much)', ex: 'Too much salt can worsen hypertension.' },
        { w: 'hypoglycemia', ar: 'هبوط السكر في الدم', d: 'Low blood sugar. (hypo = too little, glyc = sugar, emia = blood)', ex: 'Skipping meals can cause hypoglycemia in diabetics.' },
        { w: 'inflammation', ar: 'التهاب', d: 'Redness, swelling, heat, and pain as the body reacts to injury or infection.', ex: 'Ice reduces inflammation.' },
        { w: 'renal', ar: 'كلوي (خاص بالكلى)', d: 'Related to the kidneys.', ex: 'Renal failure means the kidneys stop working.' },
        { w: 'cardiac', ar: 'قلبي (خاص بالقلب)', d: 'Related to the heart.', ex: 'He had cardiac surgery.' },
        { w: 'neuron', ar: 'خلية عصبية', d: 'A nerve cell that sends electrical signals.', ex: 'Neurons connect at synapses.' },
        { w: 'control group', ar: 'المجموعة الضابطة', d: 'The group in an experiment that does not get the treatment, used for comparison.', ex: 'The control group received a placebo.' },
        { w: 'placebo', ar: 'دوا وهمي', d: 'A fake treatment with no active medicine.', ex: 'Some patients felt better even on the placebo.' },
        { w: 'chronic', ar: 'مزمن', d: 'Lasting a long time. Opposite: acute (sudden and short).', ex: 'Diabetes is a chronic disease.' }
      ],
      items: [
        { t: 'mc', q: '**Nephritis** means inflammation of the…', o: ['kidney', 'heart', 'liver', 'skin'], a: 0, why: '**nephr** = kidney, **-itis** = inflammation.' },
        { t: 'mc', q: '**Hepatology** is the study of the…', o: ['liver', 'heart', 'stomach', 'bones'], a: 0 },
        { t: 'mc', q: 'A **gastrectomy** is…', o: ['surgical removal of (part of) the stomach', 'inflammation of the stomach', 'a stomach doctor', 'a stomach X-ray'], a: 0 },
        { t: 'mc', q: '**Hyperthermia** means body temperature that is…', o: ['too high', 'too low', 'normal', 'changing'], a: 0 },
        { t: 'mc', q: '**Hypoglycemia** means…', o: ['low blood sugar', 'high blood sugar', 'low blood pressure', 'high heart rate'], a: 0 },
        { t: 'mc', q: '**Osteoporosis** affects the…', o: ['bones', 'kidneys', 'skin', 'nerves'], a: 0 },
        { t: 'mc', q: 'The body keeping a stable inner temperature is an example of…', o: ['homeostasis', 'inflammation', 'causation', 'a placebo'], a: 0 },
        { t: 'mc', q: 'An **enzyme** works as a…', o: ['biological catalyst', 'type of fat', 'hormone receptor', 'blood cell'], a: 0 },
        { t: 'mc', q: 'Ice cream sales and drowning both rise in summer. This shows…', o: ['correlation, not necessarily causation', 'that ice cream causes drowning', 'homeostasis', 'a control group'], a: 0, why: 'Both are caused by a third factor: hot weather.' },
        { t: 'mc', q: 'In an experiment testing a new drug, the group that receives a sugar pill is the…', o: ['control group', 'independent variable', 'catalyst', 'hypothesis'], a: 0 },
        { t: 'mc', q: 'Researchers change the dose of a drug and measure blood pressure. Blood pressure is the…', o: ['dependent variable', 'independent variable', 'control group', 'placebo'], a: 0 },
        { t: 'mc', q: 'The opposite of **chronic** is…', o: ['acute', 'renal', 'cardiac', 'empirical'], a: 0 },
        { t: 'fill', q: '**Cardi** means heart, so a heart doctor is a ___logist.', a: ['cardio', 'cardiologist'] },
        { t: 'listen', say: 'hypertension', o: ['hypertension', 'hypotension', 'hyperventilation', 'tension'], a: 0 }
      ]
    },
    {
      id: 'L6U3', kind: 'reading', title: 'CARS Practice: Humanities', ar: 'تدريب CARS: إنسانيات',
      lesson: [
        { p: 'This is a full CARS-style passage. Give yourself **10 minutes** for the passage and all its questions. Use the 4-step method: read actively, find the author\'s voice, predict, eliminate.' },
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
      id: 'L6U4', kind: 'reading', title: 'CARS Practice: Social Science', ar: 'تدريب CARS: علوم اجتماعية',
      lesson: [
        { p: 'A second full passage. This one is about medicine and society, a common CARS topic. Again, about **10 minutes**. Watch for where the author agrees and disagrees with others.' },
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
        'Hypertension and hypoglycemia require careful monitoring.',
        'The control group received a placebo instead of the medication.'
      ],
      write: [
        { task: '**CARS reflection:** In 5–6 sentences, explain the author\'s argument in "Choosing for Patients" and say whether you agree. Use at least two transition words (however, therefore, nevertheless…).', ar: 'في ٥-٦ جمل اشرحي رأي الكاتب وقولي انتي موافقة ولا لأ. استخدمي كلمتين ربط على الأقل.' }
      ]
    }
  ],
  test: [
    { t: 'mc', q: 'An author writes: "While the policy has flaws, abandoning it would be worse." The author most likely:', o: ['supports keeping the policy despite its problems', 'wants to abandon the policy', 'thinks the policy is perfect', 'has no opinion'], a: 0 },
    { t: 'mc', q: '**Pericarditis** is inflammation around the…', o: ['heart', 'liver', 'kidney', 'stomach'], a: 0, why: '**peri** = around, **card** = heart, **itis** = inflammation.' }
  ]
});
