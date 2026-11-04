window.SEKKA_LEVELS = window.SEKKA_LEVELS || [];
window.SEKKA_LEVELS.push({
  id: 'L4', n: 4, title: 'High School Ready', ar: 'جاهزة للثانوي', grade: 'Grades 10–12', cefr: 'CEFR B2',
  units: [
    {
      id: 'L4U1', kind: 'grammar', title: 'Passive Voice, Relative Clauses, Conditionals', ar: 'المبني للمجهول والشرط',
      lesson: [
        { h: 'Passive voice' },
        { p: 'Use the passive when the **action** or the **receiver** is more important than who did it. Form: **be + past participle**.' },
        { table: [['Active', 'Passive'], ['The nurse **gives** the medicine.', 'The medicine **is given** (by the nurse).'], ['Someone **stole** my bag.', 'My bag **was stolen**.'], ['They **have built** a new hospital.', 'A new hospital **has been built**.'], ['They **will announce** the results.', 'The results **will be announced**.']] },
        { ar: 'المبني للمجهول = لما مش مهم مين اللي عمل الحاجة. «اتسرقت شنطتي» = My bag **was stolen**. علمي كتير بيستخدمه: The samples **were tested**.' },
        { h: 'Relative clauses: who, which, that, whose, where' },
        { p: 'A **relative clause** is a part of a sentence that gives more information about a noun. It starts with **who, which, that, whose,** or **where**.' },
        { ex: ['The doctor **who** treated me was kind. (people)', 'The book **which / that** I borrowed is long. (things)', 'The woman **whose** son is a pilot lives here. (possession)', 'This is the town **where** I was born. (place)'] },
        { tip: 'Do not repeat the subject. Wrong: *The man who he called me.* Right: **The man who called me.**' },
        { ar: 'في العربي بنقول «الراجل اللي **هو** كلّمني». في الإنجليزي منقولش **he** تاني: The man **who** called me.' },
        { h: 'Conditionals (if sentences)' },
        { table: [['Type', 'Use', 'Form', 'Example'], ['Zero', 'always true', 'If + present, present', 'If you heat ice, it melts.'], ['First', 'real future', 'If + present, will', 'If it rains, I will stay home.'], ['Second', 'imaginary now', 'If + past, would', 'If I had wings, I would fly.'], ['Third', 'imaginary past', 'If + had + p.p., would have + p.p.', 'If I had studied, I would have passed.']] },
        { tip: 'In the second conditional, use **were** for all persons in formal English: If I **were** you, I would rest.' }
      ],
      items: [
        { t: 'mc', q: 'Choose the passive: "The chef cooks the meals."', o: ['The meals are cooked by the chef.', 'The meals cooked the chef.', 'The meals is cooking by the chef.', 'The chef is cooked by the meals.'], a: 0 },
        { t: 'fill', q: 'The letter ___ (send) yesterday. (passive)', a: ['was sent'] },
        { t: 'fill', q: 'English ___ (speak) in many countries. (passive, present)', a: ['is spoken'] },
        { t: 'mc', q: 'The pyramids ___ more than 4,000 years ago.', o: ['were built', 'built', 'are built', 'have built'], a: 0 },
        { t: 'mc', q: 'The woman ___ lives next door is a nurse.', o: ['who', 'which', 'whose', 'where'], a: 0 },
        { t: 'mc', q: 'That\'s the man ___ car was stolen.', o: ['whose', 'who', 'which', 'that'], a: 0 },
        { t: 'mc', q: 'This is the hospital ___ my grandson was born.', o: ['where', 'which', 'who', 'whose'], a: 0 },
        { t: 'mc', q: 'Which sentence is correct?', o: ['The teacher who she helped me is retired.', 'The teacher who helped me is retired.', 'The teacher which helped me is retired.', 'The teacher whose helped me is retired.'], a: 1 },
        { t: 'mc', q: 'If you mix red and white, you ___ pink.', o: ['get', 'will got', 'would get', 'got'], a: 0, why: 'Always true → zero conditional: present + present.' },
        { t: 'mc', q: 'If she studies hard, she ___ the exam.', o: ['will pass', 'would pass', 'passed', 'would have passed'], a: 0 },
        { t: 'mc', q: 'If I ___ rich, I would buy a house by the sea.', o: ['were', 'am', 'will be', 'had been'], a: 0 },
        { t: 'mc', q: 'If we had left earlier, we ___ the train.', o: ['would have caught', 'will catch', 'would catch', 'caught'], a: 0, why: 'Imaginary past → third conditional: would have + past participle.' },
        { t: 'fill', q: 'If I ___ (be) you, I would call the doctor.', a: ['were'] },
        { t: 'order', a: 'The results will be announced tomorrow' },
        { t: 'tf', q: '"The samples were tested in the lab" is passive voice.', a: true }
      ]
    },
    {
      id: 'L4U2', kind: 'vocab', title: 'Academic Words 1', ar: 'كلمات أكاديمية ١',
      lesson: [
        { p: 'These words come from the **Academic Word List**: the words that appear most often in textbooks, research, and exams in every subject. Learning them is one of the fastest ways to read at a college level.' },
        { ar: 'الكلمات دي بتيجي كتير جداً في كتب الجامعة والامتحانات في كل المواد. لو حفظتيها قراءتك هتتحسن بسرعة.' },
        { tip: 'Many academic words have a **word family**: analyze (verb), analysis (noun), analytical (adjective). Learn the family together.' }
      ],
      words: [
        { w: 'analyze', ar: 'يحلّل', d: 'To study something closely to understand it. Noun: analysis.', ex: 'Scientists analyze the data.' },
        { w: 'approach', ar: 'طريقة / أسلوب', d: 'A way of dealing with a problem.', ex: 'We need a new approach to this problem.' },
        { w: 'assume', ar: 'يفترض', d: 'To believe something is true without proof. Noun: assumption.', ex: 'Don\'t assume the answer is easy.' },
        { w: 'benefit', ar: 'فايدة / ميزة', d: 'A good result or advantage.', ex: 'Exercise has many benefits.' },
        { w: 'concept', ar: 'مفهوم / فكرة', d: 'An idea.', ex: 'Gravity is a difficult concept.' },
        { w: 'consist of', ar: 'يتكوّن من', d: 'To be made of.', ex: 'Water consists of hydrogen and oxygen.' },
        { w: 'context', ar: 'سياق', d: 'The situation or words around something that help explain it.', ex: 'Use the context to guess the word.' },
        { w: 'data', ar: 'بيانات', d: 'Facts and numbers collected for study.', ex: 'The data show a clear pattern.' },
        { w: 'define', ar: 'يعرّف (يحدد المعنى)', d: 'To explain the exact meaning. Noun: definition.', ex: 'Please define this term.' },
        { w: 'establish', ar: 'يأسّس / يثبت', d: 'To start something, or to prove something is true.', ex: 'The school was established in 1950.' },
        { w: 'evidence', ar: 'دليل', d: 'Facts that show something is true.', ex: 'There is strong evidence for this idea.' },
        { w: 'factor', ar: 'عامل', d: 'One thing that causes or influences a result.', ex: 'Diet is a major factor in health.' },
        { w: 'interpret', ar: 'يفسّر', d: 'To explain the meaning of something.', ex: 'How do you interpret this poem?' },
        { w: 'method', ar: 'طريقة / منهج', d: 'A planned way of doing something.', ex: 'This method works well.' },
        { w: 'significant', ar: 'مهم / ملحوظ', d: 'Important or large enough to notice.', ex: 'There was a significant change.' },
        { w: 'theory', ar: 'نظرية', d: 'An idea that explains facts, tested by evidence.', ex: 'Darwin\'s theory explains evolution.' },
        { w: 'vary', ar: 'يختلف / يتنوّع', d: 'To be different. Noun: variety; adjective: various.', ex: 'Prices vary from store to store.' },
        { w: 'indicate', ar: 'يشير إلى / يدل على', d: 'To show or point to.', ex: 'The results indicate a problem.' }
      ],
      items: [
        { t: 'mc', q: 'The scientists collected ___ from 500 patients.', o: ['data', 'concept', 'approach', 'theory'], a: 0 },
        { t: 'mc', q: 'A healthy diet is one important ___ in preventing heart disease.', o: ['factor', 'context', 'definition', 'assume'], a: 0 },
        { t: 'mc', q: 'There is no ___ that the man stole the money.', o: ['evidence', 'benefit', 'method', 'vary'], a: 0 },
        { t: 'mc', q: 'Salaries ___ depending on experience.', o: ['vary', 'define', 'consist', 'establish'], a: 0 },
        { t: 'mc', q: 'The test results ___ that she is healthy.', o: ['indicate', 'assume', 'consist', 'approach'], a: 0 },
        { t: 'mc', q: 'A team ___ of five players.', o: ['consists', 'indicates', 'varies', 'defines'], a: 0 },
        { t: 'mc', q: 'One ___ of learning English is getting a better job.', o: ['benefit', 'factor', 'theory', 'data'], a: 0 },
        { t: 'mc', q: 'If you **assume** something, you…', o: ['believe it without proof', 'prove it with data', 'write it down', 'forget it'], a: 0 },
        { t: 'mc', q: 'The noun form of **analyze** is:', o: ['analysis', 'analyzer', 'analytic', 'analyzing'], a: 0 },
        { t: 'mc', q: 'A **significant** increase is…', o: ['large and important', 'very small', 'impossible', 'unclear'], a: 0 },
        { t: 'mc', q: 'To guess a word\'s meaning, look at the ___.', o: ['context', 'factor', 'benefit', 'data'], a: 0 },
        { t: 'fill', q: 'The hospital was ___ in 1985. (started)', a: ['established'] },
        { t: 'tf', q: 'A **theory** in science is just a random guess.', a: false, why: 'A scientific theory is an explanation **supported by evidence**.' },
        { t: 'listen', say: 'The data indicate a significant change.', o: ['The data indicate a significant change.', 'The date indicates a signal change.', 'The data dedicate a significant chance.', 'They dated a significant change.'], a: 0 }
      ]
    },
    {
      id: 'L4U3', kind: 'reading', title: 'Arguments and Evidence', ar: 'الحجة والدليل',
      lesson: [
        { p: 'At this level, many texts make an **argument**. Your job is to find:' },
        { table: [['Part', 'Question to ask'], ['**Claim**', 'What does the author want me to believe?'], ['**Evidence**', 'What facts, numbers, or examples support it?'], ['**Counterargument**', 'What does the other side say?'], ['**Rebuttal**', 'How does the author answer the other side?'], ['**Tone**', 'How does the author feel? (hopeful, critical, neutral…)']] },
        { ar: 'المقالات اللي بتدافع عن رأي فيها: **ادعاء** (الكاتب عايز يقنعك بإيه)، **دليل** (أرقام أو أمثلة)، و**الرأي التاني** والرد عليه.' },
        { tip: 'Words like **however, although, critics argue, some people believe** often introduce the other side.' }
      ],
      passages: [
        { title: 'Should Cities Close Their Centers to Cars?', text: 'In 2019, the city of Oslo, Norway, removed almost all parking spaces from its downtown area. Many shop owners were furious. They predicted that customers would stop coming and businesses would close. Instead, the opposite happened. Foot traffic increased, new cafés opened, and not a single pedestrian died in traffic that year.\n\nOslo is not alone. Cities from Madrid to Seoul have turned busy roads into walkways and bike lanes. The benefits are significant. Air pollution drops, streets become quieter, and people walk more, which improves public health. Research also indicates that people on foot tend to visit more shops than drivers, who usually go to a single store and leave.\n\nCritics argue that car-free zones hurt older people and people with disabilities, who may not be able to walk long distances. This concern is real, and it must not be ignored. However, the solution is not to give the streets back to cars. Cities can provide free shuttle buses, allow delivery vehicles at certain hours, and keep special parking for those who need it.\n\nThe question is not whether cities can live without cars downtown. Oslo has already answered that. The question is whether other cities have the courage to try.' },
        { title: 'A Lucky Accident', text: 'In September 1928, the Scottish scientist Alexander Fleming returned to his London laboratory after a two-week vacation. He was not known for keeping a tidy workspace. Dishes of bacteria that he had left on a bench were now covered in mold.\n\nAs he began to clean up, Fleming noticed something strange. Around one patch of mold, the bacteria had died, leaving a clear ring. Many scientists would have thrown the dish away. Fleming, however, was curious. He grew more of the mold and discovered that it produced a substance that killed many kinds of harmful bacteria. He called it penicillin.\n\nFleming published his findings in 1929, but few people paid attention. The substance was hard to produce in large amounts. More than ten years later, Howard Florey and Ernst Chain, working in Oxford, found a way to purify and mass-produce it. By the end of World War II, penicillin was saving thousands of soldiers from infected wounds.\n\nIn 1945, Fleming, Florey, and Chain shared the Nobel Prize. Fleming later said, "One sometimes finds what one is not looking for." His story shows that discovery requires more than luck. It requires a mind ready to notice.' }
      ],
      items: [
        { t: 'mc', p: 0, q: 'What is the author\'s main claim?', o: ['Cities should try closing their centers to cars.', 'Oslo is the best city in Europe.', 'Shop owners are always wrong.', 'Cars should be banned everywhere.'], a: 0 },
        { t: 'mc', p: 0, q: 'Which is the strongest **evidence** for the claim?', o: ['In Oslo, foot traffic increased and no pedestrians died that year.', 'Shop owners were furious.', 'Seoul is a big city.', 'Some people like cafés.'], a: 0 },
        { t: 'mc', p: 0, q: 'What **counterargument** does the author mention?', o: ['Car-free zones may hurt older and disabled people.', 'Bikes are dangerous.', 'Pollution is not a problem.', 'Cafés are too expensive.'], a: 0 },
        { t: 'mc', p: 0, q: 'How does the author respond to the critics?', o: ['By suggesting shuttles, delivery hours, and special parking', 'By saying they are wrong and should be ignored', 'By agreeing to bring back cars', 'By changing the subject'], a: 0 },
        { t: 'mc', p: 0, q: 'In paragraph 1, "furious" most likely means:', o: ['very angry', 'very happy', 'confused', 'tired'], a: 0 },
        { t: 'mc', p: 0, q: 'The tone of the final paragraph is best described as:', o: ['challenging and confident', 'sad and hopeless', 'funny', 'neutral and uncertain'], a: 0 },
        { t: 'mc', p: 1, q: 'What is the main idea of the passage?', o: ['Penicillin was discovered by chance, but it took a curious mind and later work to make it useful.', 'Fleming had a messy laboratory.', 'World War II was long.', 'Scientists should take long vacations.'], a: 0 },
        { t: 'mc', p: 1, q: 'What did Fleming notice around the mold?', o: ['A clear ring where bacteria had died', 'The mold was growing faster', 'The dish was broken', 'New bacteria were growing'], a: 0 },
        { t: 'mc', p: 1, q: 'Why did few people pay attention to Fleming\'s findings at first?', o: ['Penicillin was hard to produce in large amounts.', 'Fleming did not publish them.', 'The war had ended.', 'He lost the dish.'], a: 0 },
        { t: 'mc', p: 1, q: 'The passage suggests that Florey and Chain were important because they…', o: ['made penicillin possible to produce on a large scale', 'found the mold first', 'cleaned Fleming\'s lab', 'wrote the first article'], a: 0 },
        { t: 'mc', p: 1, q: 'What does Fleming\'s quote, "One sometimes finds what one is not looking for," mean?', o: ['Important discoveries can happen by surprise.', 'It is easy to lose things.', 'You should never look for anything.', 'Science is always planned.'], a: 0 },
        { t: 'tf', p: 1, q: 'Fleming won the Nobel Prize alone.', a: false, why: 'He shared it with Florey and Chain.' }
      ]
    },
    {
      id: 'L4U4', kind: 'speaking', title: 'Punctuation, Sentence Power, and Reading Aloud', ar: 'علامات الترقيم والجملة',
      lesson: [
        { h: 'Fragments and run-ons' },
        { p: 'A **sentence** needs a subject and a verb and must be a complete thought. A **fragment** is missing something. A **run-on** joins two sentences with no correct punctuation.' },
        { table: [['Problem', 'Example', 'Fix'], ['Fragment', 'Because I was tired.', 'I went to bed early because I was tired.'], ['Run-on', 'I was tired I went to bed.', 'I was tired, **so** I went to bed. / I was tired**;** I went to bed.'], ['Comma splice', 'I was tired, I went to bed.', 'I was tired**.** I went to bed.']] },
        { ar: 'في العربي ممكن نكتب جمل طويلة جداً موصولة بـ «و» و «،». في الإنجليزي الكلام ده بيبقى غلط (run-on). كل جملة كاملة تاخد نقطة، أو نوصلهم بـ and / but / so.' },
        { h: 'Commas' },
        { ex: ['After an opening phrase: **After dinner,** we watched a movie.', 'Before and, but, or, so (joining two sentences): I called, **but** she did not answer.', 'In a list: I bought eggs, milk, and bread.', 'Around extra information: My son, **who lives in Boston,** is a doctor.'] },
        { h: 'Semicolons and colons' },
        { p: 'A **semicolon (;)** joins two closely related complete sentences. A **colon (:)** introduces a list or an explanation.' },
        { ex: ['The test was hard; I studied for weeks.', 'Bring three things: a pencil, an eraser, and your ID.'] },
        { h: 'Reading a paragraph aloud' },
        { p: 'Pause briefly at commas and longer at periods. Stress the important words (nouns, main verbs, numbers). Let your voice go down at the end of a statement.' }
      ],
      speak: [
        'After dinner, we watched a movie, but my husband fell asleep.',
        'The medicine is taken twice a day, with food.',
        'If I had known earlier, I would have called you.',
        'The doctor who treated my mother was patient and kind.',
        'Research indicates that people on foot visit more shops.',
        'One sometimes finds what one is not looking for.'
      ],
      write: [
        { task: 'Write a **persuasive paragraph** (150–200 words): Should public transportation be free? Include a **claim**, **two pieces of evidence or examples**, a **counterargument**, and your **rebuttal**.', ar: 'اكتبي فقرة إقناعية: هل المواصلات العامة لازم تبقى ببلاش؟ رأيك + دليلين + الرأي التاني + ردّك عليه.', hint: 'Useful phrases: "I strongly believe…", "For example…", "Some people argue that…", "However, …", "Therefore, …"' }
      ],
      items: [
        { t: 'mc', q: 'Which is a **fragment**?', o: ['Because the store was closed.', 'The store was closed.', 'The store was closed, so we went home.', 'We went home.'], a: 0 },
        { t: 'mc', q: 'Which is a **run-on**?', o: ['It was late we went home.', 'It was late, so we went home.', 'It was late; we went home.', 'It was late. We went home.'], a: 0 },
        { t: 'mc', q: 'Choose the correct punctuation.', o: ['I called her, but she did not answer.', 'I called her but, she did not answer.', 'I called her, she did not answer.', 'I called her; but she did not answer.'], a: 0 },
        { t: 'mc', q: 'Choose the correct sentence.', o: ['My sister, who is a nurse, works nights.', 'My sister who is a nurse, works nights.', 'My sister, who is a nurse works nights.', 'My sister who, is a nurse works nights.'], a: 0, why: 'Put commas on **both sides** of the extra information.' },
        { t: 'mc', q: 'Where does the colon go correctly?', o: ['You need three things: flour, sugar, and eggs.', 'You need: three things flour, sugar, and eggs.', 'You: need three things.', 'You need three: things.'], a: 0 },
        { t: 'mc', q: 'Which sentence uses a semicolon correctly?', o: ['She loves reading; she reads every night.', 'She loves; reading every night.', 'She loves reading; and books.', 'She; loves reading.'], a: 0, why: 'A semicolon joins **two complete sentences**.' },
        { t: 'mc', q: 'Fix this: "After the meeting we went to lunch."', o: ['After the meeting, we went to lunch.', 'After, the meeting we went to lunch.', 'After the meeting we, went to lunch.', 'After the meeting we went, to lunch.'], a: 0 },
        { t: 'tf', q: '"I was hungry, I ate a sandwich." is correct.', a: false, why: 'This is a **comma splice**. Use a period, a semicolon, or add "so".' },
        { t: 'say', text: 'After dinner, we watched a movie, but my husband fell asleep.' },
        { t: 'say', text: 'The doctor who treated my mother was patient and kind.' }
      ]
    }
  ]
});
