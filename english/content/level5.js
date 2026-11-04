window.SEKKA_LEVELS = window.SEKKA_LEVELS || [];
window.SEKKA_LEVELS.push({
  id: 'L5', n: 5, title: 'College English', ar: 'إنجليزي الجامعة', grade: 'College, year 1', cefr: 'CEFR B2+ / C1',
  units: [
    {
      id: 'L5U1', kind: 'grammar', title: 'Sentence Traps: Agreement, Parallelism, Modifiers', ar: 'فخاخ الجملة',
      lesson: [
        { p: 'College writing and exams test the same few grammar traps again and again. Learn to spot them and your writing will look professional.' },
        { h: '1. Subject–verb agreement across distance' },
        { p: 'Find the **real subject**. Ignore phrases in the middle like "of the students" or "along with her friends".' },
        { ex: ['The **box** of old letters **is** in the attic.', 'The **results** of the study **were** surprising.', '**Each** of the nurses **has** a badge.', 'The **teacher**, along with her students, **is** going.'] },
        { tip: '**each, every, everyone, neither, either** are singular. **Data** can be plural in science writing: the data **are**.' },
        { h: '2. Parallel structure' },
        { p: 'Items in a list or comparison must have the **same grammatical form**.' },
        { table: [['Not parallel', 'Parallel'], ['She likes cooking, to read, and swim.', 'She likes **cooking, reading, and swimming**.'], ['The job requires patience and being careful.', 'The job requires **patience and care**.'], ['It is better to give than receiving.', 'It is better **to give than to receive**.']] },
        { h: '3. Misplaced and dangling modifiers' },
        { p: 'A describing phrase must be **next to** the thing it describes. If not, the sentence says something silly.' },
        { table: [['Wrong', 'Why', 'Fixed'], ['Walking to work, the rain started.', 'The rain was not walking!', 'Walking to work, **I** got caught in the rain.'], ['She served soup to the guests in plastic bowls.', 'Were the guests in bowls?', 'She served **soup in plastic bowls** to the guests.']] },
        { h: '4. Pronoun clarity' },
        { p: 'Every pronoun (he, she, it, they, this) must point clearly to one noun.' },
        { ex: ['Unclear: When Mona met Sara, **she** was nervous. (who?)', 'Clear: Mona was nervous when she met Sara.'] },
        { ar: 'الأخطاء دي بتيجي كتير في امتحانات الجامعة. أهم حاجة: دوري على **الفاعل الحقيقي** للفعل، وخلي الحاجات اللي في القائمة **بنفس الشكل**، والوصف يبقى **جنب** الحاجة اللي بيوصفها.' }
      ],
      items: [
        { t: 'mc', q: 'The list of required books ___ on the website.', o: ['is', 'are'], a: 0, why: 'The subject is **list** (singular), not books.' },
        { t: 'mc', q: 'Each of the patients ___ a private room.', o: ['has', 'have'], a: 0, why: '**Each** is singular.' },
        { t: 'mc', q: 'The causes of the disease ___ still unknown.', o: ['are', 'is'], a: 0, why: 'The subject is **causes** (plural).' },
        { t: 'mc', q: 'The director, together with her assistants, ___ arriving at noon.', o: ['is', 'are'], a: 0, why: '"together with her assistants" is extra; the subject is **director**.' },
        { t: 'mc', q: 'Neither of the answers ___ correct.', o: ['is', 'are'], a: 0 },
        { t: 'mc', q: 'Which sentence is parallel?', o: ['The course teaches reading, writing, and speaking.', 'The course teaches reading, to write, and speaking.', 'The course teaches to read, writing, and to speak.', 'The course teaches reading, writes, and speaks.'], a: 0 },
        { t: 'mc', q: 'Which sentence is parallel?', o: ['She is smart, kind, and works hard.', 'She is smart, kind, and hardworking.', 'She is smart, being kind, and hardworking.', 'She smart, kind, and hardworking.'], a: 1 },
        { t: 'mc', q: 'Which sentence has a **dangling modifier**?', o: ['Running for the bus, my bag fell open.', 'Running for the bus, I dropped my bag.', 'I dropped my bag while running for the bus.', 'My bag fell open while I was running.'], a: 0, why: 'The bag was not running. "I" must follow the comma.' },
        { t: 'mc', q: 'Choose the clearest sentence.', o: ['After reviewing the chart, the doctor changed the dose.', 'After reviewing the chart, the dose was changed by the doctor.', 'The dose, after reviewing the chart, the doctor changed.', 'Reviewing the chart, the dose changed.'], a: 0 },
        { t: 'mc', q: 'Which sentence has an **unclear pronoun**?', o: ['When the nurse spoke to the patient, she smiled.', 'The nurse smiled when she spoke to the patient.', 'The patient smiled at the nurse.', 'Smiling, the nurse spoke to the patient.'], a: 0, why: 'Who smiled, the nurse or the patient? We cannot tell.' },
        { t: 'mc', q: 'Fix: "I almost ate the whole cake." What does it mean?', o: ['I ate most of the cake.', 'I did not eat any cake.', 'I ate the cake very fast.', 'I ate two cakes.'], a: 0, why: 'The position of **almost** matters. "I almost ate" vs "I ate almost the whole cake" are different in careful English.' },
        { t: 'fill', q: 'The data from the three hospitals ___ (show) the same trend. (present, plural)', a: ['show'] },
        { t: 'tf', q: '"Everyone in the class have finished" is correct.', a: false, why: '**Everyone** is singular: Everyone **has** finished.' },
        { t: 'order', a: 'The results of the experiment were surprising' }
      ]
    },
    {
      id: 'L5U2', kind: 'vocab', title: 'Academic Words 2 and Transitions', ar: 'كلمات أكاديمية ٢ وكلمات الربط',
      lesson: [
        { p: 'Transition words show the **logic** between ideas. In college reading and at work, they are road signs: they tell you if the next idea agrees, disagrees, or results from the last one.' },
        { table: [['Logic', 'Words'], ['Adds more', 'furthermore, moreover, in addition'], ['Contrast', 'however, nevertheless, whereas, although, albeit'], ['Result', 'consequently, therefore, thus, thereby'], ['Example', 'for instance, namely'], ['Concession (admit, then argue)', 'admittedly, granted, even though']] },
        { ar: 'كلمات الربط زي إشارات المرور: **however** يعني «بس / لكن» والفكرة الجاية عكس اللي فاتت. **therefore** يعني «علشان كده» والفكرة الجاية نتيجة.' }
      ],
      words: [
        { w: 'consequently', ar: 'وبالتالي / نتيجةً لذلك', d: 'As a result.', ex: 'He missed the bus; consequently, he was late.' },
        { w: 'nevertheless', ar: 'ومع ذلك', d: 'In spite of that.', ex: 'The task was hard. Nevertheless, she finished it.' },
        { w: 'furthermore', ar: 'علاوة على ذلك', d: 'In addition; also.', ex: 'The plan is cheap. Furthermore, it is fast.' },
        { w: 'whereas', ar: 'في حين أن', d: 'While on the other hand (shows contrast).', ex: 'I like tea, whereas my son prefers coffee.' },
        { w: 'albeit', ar: 'رغم أنه / ولو إنه', d: 'Although (used before a short phrase).', ex: 'It was a success, albeit a small one.' },
        { w: 'thereby', ar: 'وبذلك', d: 'By doing that.', ex: 'She saved money, thereby avoiding debt.' },
        { w: 'hypothesis', ar: 'فرضية', d: 'A testable idea that might explain something. Plural: hypotheses.', ex: 'The experiment tested the hypothesis.' },
        { w: 'phenomenon', ar: 'ظاهرة', d: 'Something that happens and can be observed. Plural: phenomena.', ex: 'Rainbows are a natural phenomenon.' },
        { w: 'inherent', ar: 'متأصّل / جزء أساسي من', d: 'Existing as a natural, basic part of something.', ex: 'There is inherent risk in surgery.' },
        { w: 'mitigate', ar: 'يخفّف (من ضرر)', d: 'To make something bad less serious.', ex: 'Trees mitigate the effects of heat.' },
        { w: 'plausible', ar: 'معقول / ممكن يتصدّق', d: 'Seeming reasonable or possibly true.', ex: 'That is a plausible explanation.' },
        { w: 'ambiguous', ar: 'غامض / ليه أكتر من معنى', d: 'Having more than one possible meaning.', ex: 'The question was ambiguous.' },
        { w: 'empirical', ar: 'تجريبي / قائم على الملاحظة', d: 'Based on observation or experiment, not only theory.', ex: 'We need empirical evidence.' },
        { w: 'implication', ar: 'دلالة / نتيجة ضمنية', d: 'A possible result, or something suggested but not said.', ex: 'The implications of the study are serious.' },
        { w: 'substantiate', ar: 'يثبت بالدليل', d: 'To prove with evidence.', ex: 'Can you substantiate your claim?' },
        { w: 'undermine', ar: 'يضعف / يهدم (بالتدريج)', d: 'To weaken something, often slowly.', ex: 'Lack of sleep undermines your health.' },
        { w: 'coherent', ar: 'مترابط / منطقي', d: 'Clear, logical, and well organized.', ex: 'Her essay was coherent and convincing.' },
        { w: 'paradigm', ar: 'نموذج / إطار فكري', d: 'A model or typical way of thinking about something.', ex: 'The discovery changed the paradigm of medicine.' }
      ],
      items: [
        { t: 'mc', q: 'The roads were icy; ___, many schools closed.', o: ['consequently', 'whereas', 'albeit', 'nevertheless'], a: 0, why: 'School closing is a **result** of the ice.' },
        { t: 'mc', q: 'The medicine has side effects. ___, doctors still recommend it.', o: ['Nevertheless', 'Consequently', 'Furthermore', 'Thereby'], a: 0, why: 'A **contrast**: in spite of side effects.' },
        { t: 'mc', q: 'City life is fast, ___ village life is slow.', o: ['whereas', 'therefore', 'furthermore', 'thereby'], a: 0 },
        { t: 'mc', q: 'The new apartment is close to work. ___, it has a garden.', o: ['Furthermore', 'Nevertheless', 'Whereas', 'Albeit'], a: 0 },
        { t: 'mc', q: 'An **ambiguous** sentence…', o: ['can be understood in more than one way', 'is very short', 'is always wrong', 'has strong evidence'], a: 0 },
        { t: 'mc', q: '**Empirical** evidence comes from…', o: ['observation and experiments', 'opinions', 'stories', 'dreams'], a: 0 },
        { t: 'mc', q: 'If a claim is **plausible**, it is…', o: ['reasonable and possibly true', 'definitely false', 'proven beyond doubt', 'confusing'], a: 0 },
        { t: 'mc', q: 'Seat belts ___ the risk of serious injury.', o: ['mitigate', 'substantiate', 'undermine', 'imply'], a: 0 },
        { t: 'mc', q: 'Constant criticism can ___ a child\'s confidence.', o: ['undermine', 'mitigate', 'substantiate', 'establish'], a: 0 },
        { t: 'mc', q: 'The plural of **phenomenon** is:', o: ['phenomena', 'phenomenons', 'phenomenas', 'phenomenes'], a: 0 },
        { t: 'mc', q: 'A scientist forms a ___ and then tests it.', o: ['hypothesis', 'paradigm', 'implication', 'phenomenon'], a: 0 },
        { t: 'mc', q: 'An essay that is **coherent** is…', o: ['logical and well organized', 'very long', 'full of mistakes', 'ambiguous'], a: 0 },
        { t: 'fill', q: 'You must ___ your claim with evidence. (prove)', a: ['substantiate'] },
        { t: 'tf', q: '"The plan worked, albeit slowly" means the plan worked, but slowly.', a: true },
        { t: 'listen', say: 'The hypothesis was not supported by empirical evidence.', o: ['The hypothesis was not supported by empirical evidence.', 'The hypothesis was supported by imperial evidence.', 'The hypotheses were not supported by experience.', 'The hypothesis was not sported by evident.'], a: 0 }
      ]
    },
    {
      id: 'L5U3', kind: 'reading', title: 'Reading Like a College Student', ar: 'نقرا زي طالب جامعة',
      lesson: [
        { p: 'College reading asks harder questions. Not just "what does it say?" but "**how** does the author argue, and **is the argument strong?**"' },
        { table: [['Question type', 'What it asks'], ['Function', 'Why did the author include this paragraph or example?'], ['Assumption', 'What must be true for the argument to work, even if not said?'], ['Strengthen / weaken', 'Which new fact would make the argument stronger or weaker?'], ['Tone / attitude', 'What is the author\'s feeling toward the topic?']] },
        { tip: 'Before you look at the answers, say the author\'s main point to yourself in one sentence.' },
        { ar: 'قبل ما تبصي على الاختيارات، قولي لنفسك فكرة الكاتب الأساسية في جملة واحدة. ده بيخليكي متتلخبطيش من الاختيارات الغلط.' }
      ],
      passages: [
        { title: 'The Myth of Multitasking', text: 'Many people are proud of their ability to multitask: answering emails during meetings, texting while cooking, or listening to podcasts while studying. Yet a large body of research suggests that what we call multitasking is largely an illusion.\n\nThe human brain, it turns out, cannot focus on two demanding tasks at the same time. Instead, it switches rapidly between them. Each switch has a cost. In laboratory studies, people who switch between tasks take longer and make more errors than people who complete one task before starting the next. Some researchers estimate that frequent switching can reduce productivity by as much as 40 percent.\n\nThe effects may extend beyond efficiency. In one well-known study at Stanford University, participants who reported heavy media multitasking performed worse on tests of attention and memory than light multitaskers. The heavy multitaskers were more easily distracted by irrelevant information, the very skill they believed they had mastered.\n\nAdmittedly, not all combinations are equally harmful. Walking while talking, for example, is easy because walking requires little conscious attention. The problem arises when both tasks require thought. Nevertheless, the lesson is clear: if a task matters, it deserves our full attention.' },
        { title: 'In Praise of Failure', text: 'We tell children that failure is bad. Schools grade it in red ink, and résumés hide it completely. Yet nearly every meaningful achievement in history rests on a pile of failures that we rarely discuss.\n\nThomas Edison tested thousands of materials before finding a filament that would make a practical light bulb. Asked about his many unsuccessful attempts, he is often quoted as saying that he had not failed; he had simply found ways that would not work. Whether or not he used those exact words, the attitude they describe is essential to discovery.\n\nThe value of failure is not that it feels good. It does not. Its value is that it provides information that success cannot. A successful experiment confirms what we hoped; a failed one shows us where our understanding is incomplete. Scientists, engineers, and artists who treat failure as data, rather than as a judgment of their worth, tend to improve faster.\n\nThis does not mean that all failure is useful. Failure that teaches nothing, because no one examines it, is merely loss. The goal, then, is not to fail more but to fail better: to fail on purpose in small, safe ways, and to ask each time what the failure reveals.' }
      ],
      items: [
        { t: 'mc', p: 0, q: 'The author\'s main point is that:', o: ['what people call multitasking usually makes them less effective.', 'multitasking is a skill everyone should learn.', 'Stanford is a famous university.', 'walking while talking is dangerous.'], a: 0 },
        { t: 'mc', p: 0, q: 'The Stanford study is mentioned in order to:', o: ['show that multitasking may harm attention and memory, not only speed', 'prove that walking is easy', 'argue that media is useful', 'describe how memory works'], a: 0, why: 'This is a **function** question. The study supports the idea that effects "extend beyond efficiency."' },
        { t: 'mc', p: 0, q: 'Why does the author mention "walking while talking"?', o: ['To admit that some task combinations are not harmful', 'To give the strongest evidence against multitasking', 'To change the topic', 'To criticize the Stanford study'], a: 0, why: 'The word **Admittedly** signals a **concession**.' },
        { t: 'mc', p: 0, q: 'Which finding would most **weaken** the author\'s argument?', o: ['A study showing heavy multitaskers perform two thinking tasks as well as people doing one at a time', 'A study showing people make errors when switching tasks', 'A survey showing many people multitask', 'A report that walking is healthy'], a: 0 },
        { t: 'mc', p: 0, q: 'The word "illusion" in paragraph 1 most nearly means:', o: ['something that seems real but is not', 'a difficult skill', 'a type of illness', 'a proven fact'], a: 0 },
        { t: 'mc', p: 0, q: 'What is ironic about the heavy multitaskers in the study?', o: ['They were worse at the very skill they thought they were good at.', 'They were faster than everyone.', 'They did not use media.', 'They refused to take the test.'], a: 0 },
        { t: 'mc', p: 1, q: 'The author\'s attitude toward failure is best described as:', o: ['balanced: it is valuable when we learn from it', 'completely negative', 'completely positive in every case', 'uninterested'], a: 0, why: 'The last paragraph adds a limit: failure that teaches nothing "is merely loss."' },
        { t: 'mc', p: 1, q: 'Why does the author write "Whether or not he used those exact words"?', o: ['To show honesty that the quote may not be exact, while keeping its point', 'To prove Edison was lying', 'To say the quote is unimportant', 'To introduce a new inventor'], a: 0 },
        { t: 'mc', p: 1, q: 'According to the passage, failure is valuable because it:', o: ['shows where our understanding is incomplete', 'feels good', 'is graded in red ink', 'confirms what we hoped'], a: 0 },
        { t: 'mc', p: 1, q: 'What does "fail better" mean in the last paragraph?', o: ['Fail in small, safe ways and learn from each failure', 'Never try anything difficult', 'Hide your failures on your résumé', 'Fail as often as possible'], a: 0 },
        { t: 'mc', p: 1, q: 'Which is an **assumption** the author makes?', o: ['People can change how they think about failure.', 'Edison invented the telephone.', 'All failures are equally useful.', 'Schools should stop grading.'], a: 0, why: 'The advice to "fail better" only works if people can change their attitude.' },
        { t: 'tf', p: 1, q: 'The author believes that all failure is useful.', a: false }
      ]
    },
    {
      id: 'L5U4', kind: 'speaking', title: 'Academic Writing and Formal Speaking', ar: 'الكتابة الأكاديمية',
      lesson: [
        { h: 'The thesis statement' },
        { p: 'A thesis is **one sentence** that states your main argument. It is specific and can be argued.' },
        { table: [['Weak thesis', 'Strong thesis'], ['Social media is bad.', 'Social media harms teenagers\' sleep and self-esteem, so schools should teach healthy phone habits.'], ['This essay is about recycling.', 'Cities should require recycling because it reduces waste, saves money, and creates jobs.']] },
        { h: 'Summarize vs. paraphrase' },
        { p: 'A **summary** gives only the main ideas, much shorter than the original. A **paraphrase** restates one idea in your own words at about the same length. Both must be in **your own words**, and you must say where the idea came from.' },
        { h: 'Formal register' },
        { table: [['Informal', 'Formal'], ['a lot of', 'many / a great deal of'], ['get', 'obtain / receive / become'], ['show', 'demonstrate / indicate'], ['think about', 'consider'], ['find out', 'discover / determine'], ['big', 'significant / substantial'], ['I think…', 'The evidence suggests…']] },
        { ar: 'في الكتابة الأكاديمية بنستخدم كلمات رسمية أكتر، ومنكتبش «I think» كتير. بدل كده: «The evidence suggests». ومنستخدمش اختصارات زي don\'t، نكتبها do not.' },
        { tip: 'Avoid contractions (don\'t → do not), slang, and exclamation marks in academic writing.' }
      ],
      speak: [
        'The evidence suggests that sleep plays a significant role in memory.',
        'Nevertheless, further research is required to substantiate this hypothesis.',
        'The implications of these findings are considerable.',
        'Whereas the first study was small, the second included thousands of participants.',
        'Consequently, the researchers revised their original theory.'
      ],
      write: [
        { task: '**Summary:** In 4–5 sentences, summarize "The Myth of Multitasking" in your own words.', ar: 'لخصي مقال The Myth of Multitasking في ٤-٥ جمل بأسلوبك.', hint: 'Start: "In \'The Myth of Multitasking,\' the author argues that…"' },
        { task: '**Essay (300–400 words):** Is it better to study one subject deeply or many subjects broadly? Write an introduction with a thesis, two body paragraphs, and a conclusion.', ar: 'مقال: الأحسن نذاكر مادة واحدة بعمق ولا مواد كتير؟ مقدمة فيها رأيك، فقرتين، وخاتمة.' }
      ],
      items: [
        { t: 'mc', q: 'Which is the strongest thesis?', o: ['Hospitals should hire more nurses because nurse shortages increase patient errors and staff burnout.', 'Nurses are important.', 'This essay is about nurses.', 'I like nurses a lot.'], a: 0 },
        { t: 'mc', q: 'A **summary** is…', o: ['a short version with only the main ideas', 'a copy of the original', 'your opinion about the text', 'a list of hard words'], a: 0 },
        { t: 'mc', q: 'Which is the most formal?', o: ['The results demonstrate a substantial increase.', 'The results show a big jump.', 'The results are, like, way higher.', 'The results got a lot bigger!'], a: 0 },
        { t: 'mc', q: 'Formal replacement for "find out":', o: ['determine', 'get', 'look', 'say'], a: 0 },
        { t: 'mc', q: 'Formal replacement for "a lot of":', o: ['a great deal of', 'tons of', 'lots and lots', 'loads of'], a: 0 },
        { t: 'mc', q: 'Which sentence is best for an academic essay?', o: ['The data do not support this conclusion.', 'The data don\'t support this!', 'I think the data are kinda wrong.', 'This conclusion is so bad.'], a: 0 },
        { t: 'mc', q: 'Paraphrasing means:', o: ['restating an idea in your own words and citing the source', 'copying the words exactly', 'changing one or two words only', 'adding your own opinion'], a: 0 },
        { t: 'say', text: 'The evidence suggests that sleep plays a significant role in memory.' },
        { t: 'say', text: 'Consequently, the researchers revised their original theory.' }
      ]
    }
  ]
});
