window.SEKKA_LEVELS = window.SEKKA_LEVELS || [];
window.SEKKA_LEVELS.push({
  id: 'L3', n: 3, title: 'Growing Stronger', ar: 'بنكبر وبنقوى', grade: 'Grades 8–9', cefr: 'CEFR B1',
  units: [
    {
      id: 'L3U1', kind: 'grammar', title: 'Present Perfect, Comparisons, and the Future', ar: 'المضارع التام والمقارنة والمستقبل',
      lesson: [
        { h: 'Present perfect: have / has + past participle' },
        { p: 'Use the present perfect for (1) life experiences with no exact time, (2) things that started in the past and **continue now**, and (3) recent news.' },
        { ex: ['I have lived in America for ten years.', 'She has never seen snow.', 'Have you ever eaten sushi?', 'We have just finished dinner.'] },
        { ar: '«I **have lived** here for ten years» يعني لسه عايشة هنا لحد دلوقتي. لكن «I **lived** in Cairo for ten years» يعني خلاص مبقتيش عايشة هناك.' },
        { table: [['Past simple (finished time)', 'Present perfect (no finished time)'], ['I saw him **yesterday**.', 'I **have seen** him before.'], ['She worked there **in 2010**.', 'She **has worked** there **since** 2010.'], ['We ate **at 7**.', 'We **have** already **eaten**.']] },
        { tip: '**for** + a length of time (for two years). **since** + a starting point (since 2015, since Monday).' },
        { h: 'Comparatives and superlatives' },
        { table: [['Word', 'Comparing 2', 'The most (3+)'], ['short: tall', 'taller than', 'the tallest'], ['ends in y: easy', 'easier than', 'the easiest'], ['long: beautiful', 'more beautiful than', 'the most beautiful'], ['good', 'better than', 'the best'], ['bad', 'worse than', 'the worst']] },
        { ar: 'متقوليش «more better». يا إما **better** يا إما **more** + كلمة طويلة: more expensive.' },
        { h: 'Future: will and going to' },
        { p: '**going to** = a plan you already made. **will** = a decision right now, a promise, or a prediction.' },
        { ex: ['I am going to visit Egypt in June. (plan)', 'The phone is ringing. I will answer it! (decision now)', 'I will always love you. (promise)'] }
      ],
      items: [
        { t: 'mc', q: 'I ___ in this house since 2012.', o: ['have lived', 'lived', 'live', 'am living'], a: 0, why: '**since 2012** + still true now → present perfect.' },
        { t: 'mc', q: 'She ___ to Paris last year.', o: ['went', 'has gone', 'has went', 'goes'], a: 0, why: '**last year** is a finished time → past simple.' },
        { t: 'mc', q: '___ you ever ___ a camel?', o: ['Have / ridden', 'Did / rode', 'Have / rode', 'Do / ride'], a: 0, why: '**ever** = life experience → have + past participle (ridden).' },
        { t: 'mc', q: 'We have known them ___ fifteen years.', o: ['for', 'since', 'ago', 'from'], a: 0, why: '**for** + length of time.' },
        { t: 'mc', q: 'He has worked here ___ January.', o: ['since', 'for', 'ago', 'during'], a: 0, why: '**since** + starting point.' },
        { t: 'fill', q: 'They have already ___ (eat) lunch.', a: ['eaten'] },
        { t: 'fill', q: 'This book is ___ (easy) than that one.', a: ['easier'] },
        { t: 'fill', q: 'This is the ___ (good) cake I have ever eaten!', a: ['best'] },
        { t: 'mc', q: 'Which is correct?', o: ['My car is more expensive than yours.', 'My car is expensiver than yours.', 'My car is more expensiver than yours.', 'My car is the expensive than yours.'], a: 0 },
        { t: 'mc', q: 'Which is correct?', o: ['Today is worse than yesterday.', 'Today is more bad than yesterday.', 'Today is badder than yesterday.', 'Today is worst than yesterday.'], a: 0 },
        { t: 'mc', q: 'I bought the tickets. I ___ fly to Cairo next month.', o: ['am going to', 'will', 'have', 'went to'], a: 0, why: 'A plan already made → **going to**.' },
        { t: 'mc', q: '"It\'s cold in here." "I ___ close the window."', o: ['will', 'am going to', 'have', 'did'], a: 0, why: 'A decision made right now → **will**.' },
        { t: 'order', a: 'She has never been to Canada' },
        { t: 'order', a: 'This is the most important day of my life' },
        { t: 'tf', q: '"I have seen him yesterday" is correct.', a: false, why: '**yesterday** is finished time → **I saw him yesterday**.' }
      ]
    },
    {
      id: 'L3U2', kind: 'vocab', title: 'Word Roots: Unlock Thousands of Words', ar: 'جذور الكلمات',
      lesson: [
        { p: 'Many English words are built from small Latin and Greek parts. If you know the parts, you can guess the meaning of words you have never seen. This skill is very important for college and the MCAT.' },
        { table: [['Part', 'Meaning', 'Examples'], ['un-, dis-, in-, im-', 'not', 'unhappy, disagree, impossible'], ['re-', 'again / back', 'rewrite, return'], ['pre-', 'before', 'preview, prepare'], ['mis-', 'wrongly', 'misunderstand'], ['-ful', 'full of', 'careful, hopeful'], ['-less', 'without', 'careless, hopeless'], ['-able / -ible', 'can be done', 'readable, visible'], ['port', 'carry', 'transport, portable'], ['dict', 'say', 'predict, dictionary'], ['spect', 'look', 'inspect, respect'], ['bio', 'life', 'biology'], ['graph', 'write', 'autograph, paragraph'], ['tele', 'far', 'telephone, television']] },
        { ar: 'الكلمات الإنجليزي الطويلة غالباً مبنية من حتت صغيرة. لو عرفتي إن **pre** يعني «قبل» و **dict** يعني «يقول»، هتفهمي إن **predict** يعني «يقول قبل ما يحصل» = يتنبّأ.' },
        { ex: ['pre + dict = predict: to say before it happens.', 'in + spect = inspect: to look into carefully.', 'bio + logy = biology: the study of life.'] }
      ],
      words: [
        { w: 'predict', ar: 'يتوقّع / يتنبّأ', d: 'To say what will happen before it happens. (pre = before, dict = say)', ex: 'They predict rain tomorrow.' },
        { w: 'inspect', ar: 'يفحص', d: 'To look at something carefully. (spect = look)', ex: 'The mechanic inspected my brakes.' },
        { w: 'respect', ar: 'احترام / يحترم', d: 'To admire someone and treat them well.', ex: 'I respect my teachers.' },
        { w: 'transport', ar: 'ينقل / مواصلات', d: 'To carry from one place to another. (trans = across, port = carry)', ex: 'Trucks transport food to stores.' },
        { w: 'portable', ar: 'محمول / سهل الشيل', d: 'Easy to carry.', ex: 'A portable fan is useful in summer.' },
        { w: 'biology', ar: 'علم الأحياء', d: 'The study of living things. (bio = life, logy = study of)', ex: 'Biology is a big part of the MCAT.' },
        { w: 'autograph', ar: 'توقيع (لشخص مشهور)', d: 'A famous person\'s signature. (auto = self, graph = write)', ex: 'He asked the singer for an autograph.' },
        { w: 'misunderstand', ar: 'يفهم غلط', d: 'To understand wrongly. (mis = wrongly)', ex: 'Sorry, I misunderstood your question.' },
        { w: 'careless', ar: 'مهمل / مش واخد باله', d: 'Not careful. (less = without)', ex: 'A careless driver caused the accident.' },
        { w: 'hopeful', ar: 'متفائل / عنده أمل', d: 'Full of hope. (ful = full of)', ex: 'I am hopeful about the future.' },
        { w: 'reliable', ar: 'يُعتمد عليه', d: 'Can be trusted to do what is expected. (able = can be)', ex: 'My old car is still reliable.' },
        { w: 'visible', ar: 'باين / ممكن يتشاف', d: 'Can be seen. (vis = see, ible = can be)', ex: 'The moon is visible tonight.' },
        { w: 'disagree', ar: 'يختلف في الرأي', d: 'To not agree.', ex: 'We disagree, but we respect each other.' },
        { w: 'review', ar: 'يراجع', d: 'To look at again. (re = again, view = see)', ex: 'Review your notes before the test.' }
      ],
      items: [
        { t: 'mc', q: 'The prefix **pre-** means:', o: ['before', 'after', 'not', 'again'], a: 0 },
        { t: 'mc', q: 'The root **spect** means:', o: ['look', 'carry', 'write', 'life'], a: 0 },
        { t: 'mc', q: 'The root **port** means:', o: ['carry', 'say', 'look', 'far'], a: 0 },
        { t: 'mc', q: 'What does **hopeless** mean?', o: ['without hope', 'full of hope', 'hope again', 'before hope'], a: 0 },
        { t: 'mc', q: 'Use the roots: **telescope** is a tool to…', o: ['see far things', 'write letters', 'carry heavy things', 'study life'], a: 0, why: '**tele** = far, **scope** = look at. A telescope lets you see far away.' },
        { t: 'mc', q: 'Use the roots: **import** means to…', o: ['carry goods into a country', 'look at goods', 'write about goods', 'say no to goods'], a: 0, why: '**im** = in, **port** = carry.' },
        { t: 'mc', q: 'Use the roots: **biography** is…', o: ['a written story of someone\'s life', 'the study of plants', 'a photo of a person', 'a type of medicine'], a: 0, why: '**bio** = life, **graph** = write.' },
        { t: 'mc', q: 'The weather report tries to ___ tomorrow\'s weather.', o: ['predict', 'inspect', 'transport', 'disagree'], a: 0 },
        { t: 'mc', q: 'A ___ friend always keeps her promises.', o: ['reliable', 'careless', 'visible', 'portable'], a: 0 },
        { t: 'fill', q: 'To read again = ___read', a: ['re', 'reread'], why: '**re-** means again.' },
        { t: 'fill', q: 'Not possible = ___possible', a: ['im', 'impossible'] },
        { t: 'mc', q: 'Which word means "can be seen"?', o: ['visible', 'invisible', 'vision', 'revise'], a: 0 },
        { t: 'tf', q: '**Dictionary** comes from **dict** (say), because it tells you how words are said and what they mean.', a: true },
        { t: 'listen', say: 'misunderstand', o: ['misunderstand', 'understand', 'misstand', 'mistake'], a: 0 }
      ]
    },
    {
      id: 'L3U3', kind: 'reading', title: 'Reading Between the Lines', ar: 'نقرا اللي بين السطور',
      lesson: [
        { h: 'Context clues' },
        { p: 'When you see a hard word, don\'t stop. Look at the words around it. Writers often give a **definition**, an **example**, or an **opposite** nearby.' },
        { ex: ['The road was **treacherous**, or very dangerous, after the storm. (definition)', 'She is **frugal**; she never buys anything she does not need. (example)', 'Unlike his **timid** brother, Omar was bold. (opposite)'] },
        { h: 'Inference' },
        { p: 'An **inference** is a smart guess based on clues in the text plus what you already know. The author does not say it directly.' },
        { ar: 'الاستنتاج (inference) يعني تفهمي حاجة الكاتب مقالهاش بشكل مباشر، بس الأدلة في النص بتقول عليها.' },
        { h: 'Author\'s purpose' },
        { p: 'Why did the author write this? To **inform** (teach facts), to **persuade** (change your mind), or to **entertain** (tell a story).' }
      ],
      passages: [
        { title: 'Why Your Brain Needs Sleep', text: 'Most adults need seven to nine hours of sleep each night, but nearly one in three adults gets less. Many people think of sleep as wasted time. Scientists disagree. Sleep is when the body does some of its most important work.\n\nDuring deep sleep, the brain sorts the day\'s memories. It strengthens the important ones and discards the rest, the way you might throw away old papers you no longer need. This is why students who sleep after studying often remember more than students who stay up all night.\n\nSleep also cleans the brain. Researchers have found that while we sleep, fluid washes through the brain and removes waste that builds up during the day. Without enough sleep, this waste stays behind.\n\nThe effects of poor sleep are easy to see. People who sleep too little are more likely to get sick, gain weight, and make mistakes. So the next time you feel guilty about going to bed early, remember: your brain is not resting. It is working.' },
        { title: 'The Woman Who Would Not Stop Learning', text: 'When Fatma arrived in New York at forty-two, she knew about twenty words of English. She could say "hello," "thank you," and "how much?" At the supermarket, she pointed at things. At her children\'s school meetings, she sat quietly and nodded, even when she did not understand.\n\nOne evening, her youngest daughter brought home a note from the teacher. Fatma could not read it. Her daughter, only eight, read it aloud and translated. Fatma smiled and said thank you, but that night she could not sleep.\n\nThe next week, she signed up for a free English class at the public library. She practiced with the radio while she cooked. She wrote new words on small cards and taped them to the kitchen cabinets. Her children laughed at first. Then they started quizzing her.\n\nFive years later, Fatma stood in front of a room of new immigrants. She was the class volunteer now. "I know how you feel," she told them slowly and clearly. "I was sitting in that chair."' }
      ],
      items: [
        { t: 'mc', p: 0, q: 'What is the author\'s main purpose?', o: ['To inform readers that sleep does important work for the brain', 'To entertain readers with a story', 'To sell a sleeping pill', 'To describe a dream'], a: 0 },
        { t: 'mc', p: 0, q: 'In paragraph 2, "discards" most likely means:', o: ['throws away', 'remembers', 'repeats', 'writes down'], a: 0, why: 'The clue: "the way you might **throw away** old papers."' },
        { t: 'mc', p: 0, q: 'According to the passage, what happens to waste in the brain during sleep?', o: ['Fluid washes it away.', 'It turns into memories.', 'It grows larger.', 'It moves to the stomach.'], a: 0 },
        { t: 'mc', p: 0, q: 'Which statement would the author most likely agree with?', o: ['Sleeping after studying can help you remember.', 'Sleep is mostly wasted time.', 'Six hours of sleep is enough for everyone.', 'Feeling guilty helps you sleep.'], a: 0 },
        { t: 'mc', p: 0, q: 'The author compares the sleeping brain to…', o: ['someone sorting and throwing away old papers', 'a car engine', 'a computer game', 'a quiet library'], a: 0 },
        { t: 'tf', p: 0, q: 'The passage says most adults need seven to nine hours of sleep.', a: true },
        { t: 'mc', p: 1, q: 'Why could Fatma not sleep that night?', o: ['She felt bad that she could not read her daughter\'s note.', 'She was sick.', 'The radio was loud.', 'She had a test the next day.'], a: 0, why: 'This is an **inference**. The text does not say it directly, but the clues show it.' },
        { t: 'mc', p: 1, q: 'Why did Fatma tape cards to the kitchen cabinets?', o: ['To see and practice new words often', 'To decorate the kitchen', 'To help her children', 'To remember recipes'], a: 0 },
        { t: 'mc', p: 1, q: 'How did her children\'s attitude change?', o: ['They laughed at first, then they helped her.', 'They were angry, then they left.', 'They did not notice.', 'They took her class.'], a: 0 },
        { t: 'mc', p: 1, q: 'What does the last line, "I was sitting in that chair," mean?', o: ['She was once a beginner student just like them.', 'She was tired.', 'The chair was hers.', 'She wanted to sit down.'], a: 0 },
        { t: 'mc', p: 1, q: 'Which word best describes Fatma?', o: ['determined', 'lazy', 'careless', 'rude'], a: 0, why: '**Determined** means she did not give up.' },
        { t: 'mc', q: 'Context clue: "Unlike his **timid** brother, Omar was bold." Timid means:', o: ['shy and not brave', 'very tall', 'loud', 'smart'], a: 0, why: '**Unlike** signals an opposite. The opposite of bold is shy.' }
      ]
    },
    {
      id: 'L3U4', kind: 'speaking', title: 'Clusters, Linking, and Your First Paragraph', ar: 'الحروف المتجمعة والفقرة',
      lesson: [
        { h: 'Consonant clusters: no extra vowels' },
        { p: 'Arabic words do not start with two consonants together, so Arabic speakers often add a vowel: "istreet" or "sitreet" for **street**, "isbring" for **spring**. Start directly with the first consonant.' },
        { ar: 'في العربي مفيش كلمة بتبدأ بحرفين ساكنين، فبنزوّد «إ» من غير ما ناخد بالنا: «إستريت». في الإنجليزي ابدئي على طول بحرف الـ S: **street**، **school**، **spring**.' },
        { pairs: [['street', 'sit'], ['school', 'skull'], ['spring', 'sprint'], ['three', 'tree'], ['plate', 'play'], ['brown', 'bring']] },
        { h: 'Linking words together' },
        { p: 'Native speakers connect words. When a word ends in a consonant and the next starts with a vowel, they join: **an apple** sounds like "a-napple". **Turn it on** sounds like "tur-ni-ton".' },
        { ex: ['Pick it up.', 'Not at all.', 'Come on in.', 'An hour ago.'] },
        { h: 'Writing a paragraph' },
        { p: 'A good paragraph has: (1) a **topic sentence** that gives the main idea, (2) **three supporting details** with examples, and (3) a **concluding sentence** that repeats the idea in new words.' },
        { tip: 'Use linking words: **First, Also, In addition, For example, However, Finally, In conclusion**.' }
      ],
      speak: [
        'The street near my school is very straight.',
        'In spring, the strong wind blows through the trees.',
        'Please pick it up and put it on the table.',
        'I have lived here for twelve years.',
        'This is the best breakfast I have ever had.',
        'Not at all. Come on in and sit down.'
      ],
      write: [
        { task: 'Write one paragraph (7–10 sentences): **Should children learn two languages?** Give your opinion and three reasons.', ar: 'اكتبي فقرة: هل لازم الأطفال يتعلموا لغتين؟ قولي رأيك وتلات أسباب.', hint: 'Start: "I believe children should learn two languages for three reasons." End: "In conclusion, …"' }
      ],
      items: [
        { t: 'mc', q: 'How should you say "street"?', o: ['street (start with S)', 'istreet', 'sitreet', 'estreet'], a: 0 },
        { t: 'listen', say: 'spring', o: ['spring', 'sipring', 'string', 'bring'], a: 0 },
        { t: 'listen', say: 'plate', o: ['plate', 'play', 'blade', 'late'], a: 0 },
        { t: 'mc', q: 'In a paragraph, the **topic sentence**…', o: ['gives the main idea', 'is always the last sentence', 'gives one small example', 'asks a question only'], a: 0 },
        { t: 'mc', q: 'Which is the best topic sentence for a paragraph about exercise?', o: ['Walking every day has many health benefits.', 'I walked yesterday.', 'My shoes are blue.', 'Some people run.'], a: 0, why: 'It states a main idea that the details can support.' },
        { t: 'mc', q: 'Which word introduces an example?', o: ['For example', 'In conclusion', 'However', 'Finally'], a: 0 },
        { t: 'mc', q: 'Which word shows a contrast (a different idea)?', o: ['However', 'Also', 'In addition', 'First'], a: 0 },
        { t: 'mc', q: '"An apple" usually sounds like:', o: ['a-napple', 'an — apple (with a stop)', 'a-pple', 'ann-ep'], a: 0 },
        { t: 'say', text: 'The street near my school is very straight.' },
        { t: 'say', text: 'This is the best breakfast I have ever had.' }
      ]
    }
  ]
});
