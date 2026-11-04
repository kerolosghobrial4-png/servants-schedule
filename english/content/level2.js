window.SEKKA_LEVELS = window.SEKKA_LEVELS || [];
window.SEKKA_LEVELS.push({
  id: 'L2', n: 2, title: 'Building Blocks', ar: 'نبني خطوة بخطوة', grade: 'Grades 6–7', cefr: 'CEFR A2+',
  units: [
    {
      id: 'L2U1', kind: 'grammar', title: 'The Past and the Little Words (a, an, the)', ar: 'الماضي وأدوات التعريف',
      lesson: [
        { h: 'Past simple: regular verbs' },
        { p: 'For finished actions in the past, add **-ed** to most verbs. It is the same for every person: I, she, they.' },
        { ex: ['I cooked rice yesterday.', 'She called her sister last night.', 'We walked to the park.'] },
        { table: [['Rule', 'Example'], ['most verbs + ed', 'work → worked'], ['ends in e + d', 'live → lived'], ['consonant + y → ied', 'study → studied, cry → cried'], ['short verb: double the last letter', 'stop → stopped, plan → planned']] },
        { h: 'Irregular verbs' },
        { p: 'Many common verbs are irregular. You must learn them by heart. Here are the most important ones.' },
        { table: [['Now', 'Past', 'Now', 'Past'], ['go', 'went', 'eat', 'ate'], ['have', 'had', 'see', 'saw'], ['make', 'made', 'take', 'took'], ['come', 'came', 'give', 'gave'], ['buy', 'bought', 'think', 'thought'], ['say', 'said', 'tell', 'told'], ['get', 'got', 'know', 'knew'], ['write', 'wrote', 'speak', 'spoke']] },
        { h: 'Questions and negatives: did' },
        { p: 'Use **did** for past questions and negatives. After **did**, use the normal verb (no -ed).' },
        { ex: ['Did you eat breakfast?', 'I did not (didn\'t) go to work.', 'Where did she buy that dress?'] },
        { ar: 'بعد **did** الفعل بيرجع لأصله: Did you **go**? مش Did you went. وفي النفي: I didn\'t **see** him.' },
        { h: 'A, an, and the' },
        { p: 'Use **a / an** for one thing that is new or not specific. Use **an** before a vowel **sound** (a, e, i, o, u). Use **the** for something specific that we both know.' },
        { ex: ['I saw a cat. The cat was black.', 'She is an engineer.', 'It takes an hour.', 'Please close the door.'] },
        { ar: 'في العربي بنقول «أنا بحب القهوة» بـ «الـ». في الإنجليزي لما نتكلم عن حاجة **بشكل عام** مبنحطش the: I love **coffee**. وكمان مع الوظايف لازم a/an: She is **a** nurse.' },
        { tip: '**an hour** (the h is silent, so the sound starts with a vowel). **a university** (it starts with a "you" sound).' }
      ],
      items: [
        { t: 'fill', q: 'Yesterday I ___ (visit) my aunt.', a: ['visited'] },
        { t: 'fill', q: 'We ___ (go) to Alexandria last summer.', a: ['went'], why: '**go** is irregular: go → **went**.' },
        { t: 'fill', q: 'She ___ (buy) new shoes on Friday.', a: ['bought'] },
        { t: 'fill', q: 'The baby ___ (cry) all night.', a: ['cried'], why: 'Consonant + y → **-ied**.' },
        { t: 'fill', q: 'He ___ (stop) the car.', a: ['stopped'], why: 'Short verbs like stop double the last letter: stop**ped**.' },
        { t: 'mc', q: 'Which question is correct?', o: ['Did you went to church?', 'Did you go to church?', 'You did go to church?', 'Do you went to church?'], a: 1, why: 'After **did**, use the base verb: go.' },
        { t: 'mc', q: 'I ___ see the movie. (negative)', o: ["didn't", "don't", "wasn't", "not"], a: 0 },
        { t: 'mc', q: 'She is ___ honest woman.', o: ['an', 'a', 'the', '(nothing)'], a: 0, why: '**honest** starts with a vowel sound (the h is silent), so use **an**.' },
        { t: 'mc', q: 'My daughter wants to go to ___ university.', o: ['a', 'an', 'the', '(nothing)'], a: 0, why: '**university** starts with a "you" sound, so use **a**.' },
        { t: 'mc', q: 'Which sentence is correct?', o: ['I love the tea.', 'I love tea.', 'I love a tea.', 'I love an tea.'], a: 1, why: 'Talking about tea in general: no article.' },
        { t: 'mc', q: 'I bought a dress and a scarf. ___ dress was blue.', o: ['The', 'A', 'An', '(nothing)'], a: 0, why: 'Now we both know which dress: **the** dress.' },
        { t: 'mc', q: 'My husband is ___ engineer.', o: ['an', 'a', 'the', '(nothing)'], a: 0 },
        { t: 'order', a: 'Where did you buy this bread', why: 'Question word + did + subject + verb.' },
        { t: 'order', a: 'I did not sleep well last night' },
        { t: 'tf', q: '"She speaked to the teacher" is correct.', a: false, why: '**speak** is irregular: she **spoke**.' },
        { t: 'dict', say: 'We ate dinner at home.' }
      ]
    },
    {
      id: 'L2U2', kind: 'vocab', title: 'Feelings and Phrasal Verbs', ar: 'المشاعر والأفعال المركّبة',
      lesson: [
        { p: '**Phrasal verbs** are a verb + a small word (up, out, for, on). Together they have a new meaning. English speakers use them all the time.' },
        { ex: ['I am looking for my keys.', 'Please pick up the children at three.', 'We ran out of milk.'] },
        { ar: 'الفعل المركّب = فعل + كلمة صغيرة، والمعنى بيتغير خالص. مثلاً **give** يعني يدّي، بس **give up** يعني يستسلم.' },
        { tip: 'Learn phrasal verbs inside a sentence, not alone. The sentence helps you remember.' }
      ],
      words: [
        { w: 'look for', ar: 'يدوّر على', d: 'To try to find something.', ex: 'I am looking for my glasses.' },
        { w: 'find out', ar: 'يعرف / يكتشف', d: 'To learn information you did not know.', ex: 'I found out the store is closed on Sunday.' },
        { w: 'give up', ar: 'يستسلم / يبطّل', d: 'To stop trying.', ex: 'Don\'t give up. You are learning fast.' },
        { w: 'pick up', ar: 'يجيب حد / يلم حاجة', d: 'To go and get someone or something.', ex: 'I pick up my grandson from school.' },
        { w: 'run out of', ar: 'يخلص منه', d: 'To have no more of something.', ex: 'We ran out of sugar.' },
        { w: 'take care of', ar: 'ياخد باله من / يرعى', d: 'To look after someone or something.', ex: 'She takes care of her mother.' },
        { w: 'get along with', ar: 'يتفاهم مع / مرتاح مع', d: 'To have a friendly relationship.', ex: 'I get along with my neighbors.' },
        { w: 'turn down', ar: 'يرفض / يوطّي الصوت', d: 'To say no to an offer, or to make quieter.', ex: 'Please turn down the TV.' },
        { w: 'grateful', ar: 'ممتنّة / شاكرة', d: 'Thankful for something.', ex: 'I am grateful for my family.' },
        { w: 'nervous', ar: 'متوتّر', d: 'Worried and a little afraid.', ex: 'I was nervous before the interview.' },
        { w: 'proud', ar: 'فخورة', d: 'Happy about what you or someone did.', ex: 'I am proud of my son.' },
        { w: 'patient', ar: 'صبور', d: 'Able to wait calmly. (Also: a person a doctor treats.)', ex: 'Be patient. Learning takes time.' },
        { w: 'confused', ar: 'متلخبط / مش فاهم', d: 'Not able to understand clearly.', ex: 'The directions confused me.' },
        { w: 'curious', ar: 'فضولي / عايز يعرف', d: 'Wanting to know or learn more.', ex: 'Children are curious about everything.' },
        { w: 'honest', ar: 'أمين / صادق', d: 'Telling the truth.', ex: 'He is an honest man.' },
        { w: 'brave', ar: 'شجاع', d: 'Not afraid to do something hard.', ex: 'It is brave to learn a new language.' }
      ],
      items: [
        { t: 'mc', q: 'I can\'t find my phone. Can you help me ___ it?', o: ['look for', 'give up', 'turn down', 'run out of'], a: 0 },
        { t: 'mc', q: 'We ___ bread. Please buy some.', o: ['ran out of', 'picked up', 'found out', 'took care of'], a: 0 },
        { t: 'mc', q: 'Learning is hard, but don\'t ___!', o: ['give up', 'pick up', 'look for', 'get along'], a: 0 },
        { t: 'mc', q: 'Who will ___ the baby while you are at work?', o: ['take care of', 'run out of', 'turn down', 'find out'], a: 0 },
        { t: 'mc', q: 'I just ___ that my cousin is getting married!', o: ['found out', 'gave up', 'looked for', 'ran out of'], a: 0 },
        { t: 'mc', q: 'They offered her the job, but she ___ it ___ because it was too far.', o: ['turned / down', 'picked / up', 'gave / up', 'found / out'], a: 0 },
        { t: 'mc', q: 'Before the test, I felt ___. My hands were shaking.', o: ['nervous', 'grateful', 'proud', 'honest'], a: 0 },
        { t: 'mc', q: 'My daughter graduated. I am so ___ of her.', o: ['proud', 'confused', 'nervous', 'curious'], a: 0 },
        { t: 'mc', q: 'Thank you for your help. I am very ___.', o: ['grateful', 'brave', 'curious', 'patient'], a: 0 },
        { t: 'mc', q: 'A ___ person always tells the truth.', o: ['honest', 'nervous', 'confused', 'busy'], a: 0 },
        { t: 'mc', q: '"Patient" can mean calm when waiting, or…', o: ['a person who sees a doctor', 'a type of medicine', 'a hospital room', 'a nurse'], a: 0 },
        { t: 'fill', q: 'I ___ ___ ___ my neighbors. We are friends. (3 words: get…)', a: ['get along with'] },
        { t: 'tf', q: '"Curious" means you want to learn more.', a: true },
        { t: 'listen', say: 'I am grateful for my family.', o: ['I am grateful for my family.', 'I am great for my family.', 'I am hateful of my family.', 'I am graceful with my family.'], a: 0 }
      ]
    },
    {
      id: 'L2U3', kind: 'reading', title: 'Facts and Feelings', ar: 'معلومات ومشاعر',
      lesson: [
        { p: 'Some texts give **information** (facts). Some texts tell a **story** or share **feelings**. Knowing the type helps you understand it.' },
        { h: 'Cause and effect' },
        { p: 'A **cause** is why something happens. An **effect** is what happens. Look for signal words: **because, so, as a result, that is why**.' },
        { ex: ['It rained, **so** the street was wet.', 'She was late **because** the train stopped.'] },
        { ar: 'السبب = ليه حصل كده. النتيجة = إيه اللي حصل. دوري على كلمات زي because (عشان) و so (فـ / علشان كده).' }
      ],
      passages: [
        { title: 'The Gift of the Nile', text: 'The Nile is one of the longest rivers in the world. It flows north for about 6,650 kilometers through eleven countries before it reaches the Mediterranean Sea.\n\nFor thousands of years, the Nile flooded every summer. The flood was not a disaster. It was a gift. The water left behind rich black soil, and farmers grew wheat, beans, and flax in it. Because of this soil, ancient Egypt had enough food to grow into a great civilization. The Greek writer Herodotus called Egypt "the gift of the Nile."\n\nIn 1970, Egypt finished building the Aswan High Dam. The dam stopped the yearly floods. As a result, farmers could plant crops all year, and the dam made electricity for millions of homes. However, the rich soil no longer reached the fields, so today farmers must use fertilizer.' },
        { title: 'A Letter from Grandmother', text: 'Dear Nour,\n\nThank you for the photos of your new school. You look so grown up in your uniform! I put the picture on my refrigerator so I can see it every morning.\n\nI remember my first day of school in Asyut. I was very nervous. I held my mother\'s hand so tightly that she laughed. But then I met a girl named Samia. She shared her bread with me, and we became best friends. We are still friends today, sixty years later.\n\nSo don\'t worry if you feel shy. Be kind, smile, and say hello. Friends will come.\n\nWith all my love,\nTeta' }
      ],
      items: [
        { t: 'mc', p: 0, q: 'What is the main idea of the passage?', o: ['The Nile has shaped life in Egypt, through floods and the dam.', 'The Aswan Dam makes electricity.', 'Herodotus was a Greek writer.', 'Farmers grow wheat and beans.'], a: 0, why: 'The other answers are details. The main idea covers the whole passage.' },
        { t: 'mc', p: 0, q: 'Why was the flood called "a gift"?', o: ['It left rich soil for farming.', 'It made electricity.', 'It brought fish.', 'It stopped wars.'], a: 0 },
        { t: 'mc', p: 0, q: 'What was one **effect** of the Aswan High Dam?', o: ['Farmers could plant all year.', 'The floods got bigger.', 'The soil got richer.', 'The river got longer.'], a: 0 },
        { t: 'mc', p: 0, q: 'Why do farmers use fertilizer today?', o: ['The rich soil no longer reaches the fields.', 'The river is too long.', 'It is cheaper.', 'Herodotus said so.'], a: 0 },
        { t: 'mc', p: 0, q: 'In the passage, "disaster" means:', o: ['something very bad that causes damage', 'a type of farm', 'a big celebration', 'a river'], a: 0, why: 'The text says the flood was **not** a disaster, it was a gift. So disaster is the opposite of a gift.' },
        { t: 'tf', p: 0, q: 'The Nile flows south.', a: false, why: 'It flows **north** to the Mediterranean.' },
        { t: 'mc', p: 1, q: 'Who wrote the letter?', o: ['Nour\'s grandmother', 'Nour', 'Samia', 'Nour\'s teacher'], a: 0, why: '"Teta" means grandmother, and she writes "Dear Nour."' },
        { t: 'mc', p: 1, q: 'Why did Teta\'s mother laugh?', o: ['Teta held her hand very tightly.', 'Teta told a joke.', 'Samia was funny.', 'The school was small.'], a: 0 },
        { t: 'mc', p: 1, q: 'How does Nour probably feel about her new school?', o: ['a little shy or worried', 'angry', 'bored', 'very sleepy'], a: 0, why: 'Teta says "don\'t worry if you feel shy." We can **infer** (guess from clues) that Nour is a bit worried.' },
        { t: 'mc', p: 1, q: 'What advice does Teta give?', o: ['Be kind, smile, and say hello.', 'Study every night.', 'Bring extra bread.', 'Hold your mother\'s hand.'], a: 0 },
        { t: 'tf', p: 1, q: 'Teta and Samia are still friends.', a: true }
      ]
    },
    {
      id: 'L2U4', kind: 'speaking', title: 'The TH Sound and -ed Endings', ar: 'صوت TH ونهاية ed',
      lesson: [
        { h: 'TH has two sounds' },
        { p: 'Put the tip of your tongue **between your teeth** and blow. **think, three, thank** have air only (like ث). **this, that, mother** add your voice (like ذ).' },
        { ar: 'الـ **th** زي حرف **ث** في think و thank، وزي حرف **ذ** في this و mother. طلّعي طرف لسانك بين سنانك. متقوليهاش «س» أو «ز» أو «ت».' },
        { pairs: [['think', 'sink'], ['three', 'tree'], ['thank', 'tank'], ['they', 'day'], ['then', 'zen'], ['mouth', 'mouse']] },
        { h: 'Three ways to say -ed' },
        { tip: 'A **syllable** is one beat in a word. Clap it: **cook** (1 clap), **cook-ing** (2 claps), **ba-na-na** (3 claps).' },
        { table: [['Sound', 'When', 'Examples'], ['/t/', 'after p, k, s, sh, ch, f', 'helped, cooked, washed'], ['/d/', 'after most voiced sounds', 'played, lived, cleaned'], ['/id/ (extra syllable)', 'after t or d', 'wanted, needed, visited']] },
        { ex: ['I cooked dinner.', 'She cleaned the house.', 'We wanted to help.'] },
        { ar: 'متقوليش «كوكيد» في cooked. قوليها «كوكت». الـ ed بتبقى مقطع زيادة (إد) بس بعد حرف t أو d زي wanted و needed.' },
        { h: 'Word stress' },
        { p: 'In English, one part of a long word is **louder and longer**. Say: **DOC**-tor, **TEA**-cher, ho-**TEL**, ba-**NA**-na, com-**PU**-ter.' }
      ],
      speak: [
        'Thank you for the three thick books.',
        'This is my mother and that is my brother.',
        'I think they are together.',
        'She cooked and cleaned all morning.',
        'We wanted to visit, but we needed more time.',
        'The doctor and the teacher walked to the hotel.'
      ],
      write: [
        { task: 'Write about the best day of your life in 8 sentences or more. Use the **past simple** (went, saw, felt, had…).', ar: 'اكتبي عن أحلى يوم في حياتك، ٨ جمل أو أكتر، بالماضي.', hint: 'Answer: When was it? Where were you? Who was there? What happened? How did you feel?' }
      ],
      items: [
        { t: 'listen', say: 'think', o: ['think', 'sink'], a: 0 },
        { t: 'listen', say: 'three', o: ['three', 'tree'], a: 0 },
        { t: 'listen', say: 'they', o: ['they', 'day'], a: 0 },
        { t: 'listen', say: 'mouth', o: ['mouse', 'mouth'], a: 1 },
        { t: 'mc', q: 'How does "cooked" end?', o: ['with a /t/ sound: cookt', 'with /id/: cook-id', 'with /d/: cookd'], a: 0 },
        { t: 'mc', q: 'Which word has an **extra syllable** (/id/)?', o: ['wanted', 'played', 'washed', 'lived'], a: 0, why: 'After **t** or **d**, -ed sounds like /id/: want-id.' },
        { t: 'mc', q: 'Which word ends with a /d/ sound?', o: ['played', 'helped', 'needed', 'cooked'], a: 0 },
        { t: 'mc', q: 'Where is the stress in "computer"?', o: ['com-PU-ter', 'COM-pu-ter', 'com-pu-TER'], a: 0 },
        { t: 'mc', q: 'To make the TH sound, your tongue should be…', o: ['between your teeth', 'behind your bottom teeth', 'touching the roof of your mouth', 'pulled back'], a: 0 },
        { t: 'say', text: 'Thank you for the three thick books.' },
        { t: 'say', text: 'She cooked and cleaned all morning.' }
      ]
    }
  ],
  test: [
    { t: 'fill', q: 'They ___ (take) a taxi to the airport.', a: ['took'] },
    { t: 'mc', q: 'Did she ___ the email?', o: ['write', 'wrote', 'writes', 'written'], a: 0 }
  ]
});
