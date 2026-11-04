window.SEKKA_LEVELS = window.SEKKA_LEVELS || [];
window.SEKKA_LEVELS.push({
  id: 'L1', n: 1, title: 'Strong Roots', ar: 'الأساس القوي', grade: 'Grades 4–6', cefr: 'CEFR A2',
  units: [
    {
      id: 'L1U1', kind: 'grammar', title: 'Be, Do, and the -s Rule', ar: 'فعل to be، وdo، وحرف s',
      lesson: [
        { p: 'English sentences **always need a verb**. In Arabic we can say "أنا تعبانة" with no verb. In English we must say **I am tired**.' },
        { ar: 'في العربي بنقول «هي دكتورة» من غير فعل. في الإنجليزي لازم نحط **am / is / are**: She **is** a doctor.' },
        { h: 'The verb "to be"' },
        { table: [['Person', 'Verb', 'Example'], ['I', 'am', 'I am happy.'], ['he / she / it', 'is', 'She is at home.'], ['you / we / they', 'are', 'They are my children.']] },
        { ex: ['I am a mother.', 'My son is a student.', 'We are ready.'] },
        { tip: 'Negative: add **not**. I am **not** late. He **is not** (isn\'t) here. They **are not** (aren\'t) busy.' },
        { h: 'Present simple and the -s rule' },
        { p: 'For things we do every day, we use the present simple. With **he, she, it** (one person or thing), add **-s** to the verb.' },
        { ex: ['I cook dinner every day.', 'She cooks dinner every day.', 'My husband works at night.', 'The bus leaves at eight.'] },
        { ar: 'مع **he / she / it** لازم نزوّد **s** في آخر الفعل: She work**s**. ده أكتر غلط بيقع فيه الناس، فركّزي عليه.' },
        { table: [['Verb ending', 'Add', 'Example'], ['most verbs', '-s', 'work → works'], ['-sh, -ch, -s, -x, -o', '-es', 'wash → washes, go → goes'], ['consonant + y', '-ies', 'study → studies'], ['have', 'has', 'She has two sons.']] },
        { h: 'Questions and negatives with do / does' },
        { p: 'Use **do** with I, you, we, they. Use **does** with he, she, it. After **does**, the verb has **no -s**.' },
        { ex: ['Do you like tea?', 'Does she speak English?', 'I do not (don\'t) drive.', 'He does not (doesn\'t) eat meat.'] },
        { ar: 'لما نستخدم **does** الـ s بتروح من الفعل: Does she **work**? مش Does she works.' }
      ],
      items: [
        { t: 'mc', q: 'My mother ___ a teacher.', o: ['is', 'are', 'am', 'be'], a: 0, why: 'One person (she) uses **is**.' },
        { t: 'mc', q: 'We ___ very happy today.', o: ['are', 'is', 'am', 'be'], a: 0, why: '**We** uses **are**.' },
        { t: 'fill', q: 'She ___ (work) at a hospital.', a: ['works'], why: 'He / she / it + verb**s**: she works.' },
        { t: 'fill', q: 'My son ___ (study) every night.', a: ['studies'], why: 'Consonant + y → **-ies**: study → studies.' },
        { t: 'fill', q: 'He ___ (go) to church on Sunday.', a: ['goes'], why: 'Verbs ending in **-o** add **-es**: goes.' },
        { t: 'mc', q: 'Which sentence is correct?', o: ['She have a big family.', 'She has a big family.', 'She haves a big family.', 'She having a big family.'], a: 1, why: '**have** becomes **has** with he / she / it.' },
        { t: 'mc', q: '___ your daughter live in Cairo?', o: ['Does', 'Do', 'Is', 'Are'], a: 0, why: 'Your daughter = she, so use **Does**.' },
        { t: 'mc', q: 'Which question is correct?', o: ['Does he works here?', 'Do he work here?', 'Does he work here?', 'He work here?'], a: 2, why: 'After **does**, the verb has no -s: Does he **work**?' },
        { t: 'fill', q: 'I ___ like coffee. (negative, short form)', a: ["don't", 'do not'], why: 'I + **don\'t** + verb.' },
        { t: 'fill', q: 'My husband ___ drive. (negative, short form)', a: ["doesn't", 'does not'], why: 'He + **doesn\'t** + verb.' },
        { t: 'order', a: 'She is not at home now', why: 'Subject + is + not + place.' },
        { t: 'order', a: 'Do you speak English', why: 'Questions start with **Do** + subject + verb.' },
        { t: 'tf', q: '"The children is in the garden." This sentence is correct.', a: false, why: 'Children is plural, so it should be **are**: The children are in the garden.' },
        { t: 'mc', q: 'Choose the correct sentence.', o: ['I tired.', 'I am tired.', 'I is tired.', 'I are tired.'], a: 1, why: 'English needs a verb: I **am** tired.' },
        { t: 'dict', say: 'She works every day.', why: 'Did you hear the **s** in works?' }
      ]
    },
    {
      id: 'L1U2', kind: 'vocab', title: 'Everyday Words', ar: 'كلمات كل يوم',
      lesson: [
        { p: 'These are words you use at the doctor, the store, the bank, and at home. Listen to each word, say it out loud, and read the example.' },
        { tip: 'A good way to learn a word: hear it, say it, then use it in your own sentence about your life.' },
        { ar: 'اسمعي الكلمة، قوليها بصوت عالي، وبعدين اعملي بيها جملة عن حياتك انتي. كده هتفتكريها أكتر.' }
      ],
      words: [
        { w: 'appointment', ar: 'ميعاد (عند الدكتور مثلاً)', d: 'A time you agree to meet someone, like a doctor.', ex: 'I have a doctor\'s appointment on Monday.' },
        { w: 'prescription', ar: 'روشتة', d: 'A paper from a doctor that tells you which medicine to get.', ex: 'The pharmacist read my prescription.' },
        { w: 'pharmacy', ar: 'صيدلية', d: 'A store where you buy medicine.', ex: 'The pharmacy closes at nine.' },
        { w: 'neighbor', ar: 'جار / جارة', d: 'A person who lives near you.', ex: 'My neighbor gave us mangoes.' },
        { w: 'receipt', ar: 'إيصال / فاتورة الشراء', d: 'A paper that shows what you paid. (The p is silent: re-SEET.)', ex: 'Keep the receipt in case you return the shirt.' },
        { w: 'bill', ar: 'فاتورة (كهربا، ميه…)', d: 'A paper that says how much money you must pay.', ex: 'The electric bill is high this month.' },
        { w: 'schedule', ar: 'جدول مواعيد', d: 'A plan of times for things to happen.', ex: 'The bus schedule changed.' },
        { w: 'borrow', ar: 'يستلف', d: 'To take something and give it back later.', ex: 'Can I borrow your pen?' },
        { w: 'lend', ar: 'يسلّف', d: 'To give something to someone for a short time.', ex: 'I can lend you my car.' },
        { w: 'cheap', ar: 'رخيص', d: 'It does not cost much money.', ex: 'Tomatoes are cheap in summer.' },
        { w: 'expensive', ar: 'غالي', d: 'It costs a lot of money.', ex: 'This phone is too expensive.' },
        { w: 'healthy', ar: 'صحي', d: 'Good for your body; not sick.', ex: 'Vegetables are healthy.' },
        { w: 'tired', ar: 'تعبان', d: 'Needing rest or sleep.', ex: 'I am tired after work.' },
        { w: 'busy', ar: 'مشغول', d: 'Having a lot to do.', ex: 'Mondays are very busy.' },
        { w: 'early', ar: 'بدري', d: 'Before the usual or planned time.', ex: 'She wakes up early.' },
        { w: 'late', ar: 'متأخر', d: 'After the usual or planned time.', ex: 'Sorry I am late.' }
      ],
      items: [
        { t: 'mc', q: 'The doctor gave me a ___ for medicine.', o: ['prescription', 'receipt', 'schedule', 'neighbor'], a: 0, why: 'A **prescription** tells the pharmacy which medicine to give you.' },
        { t: 'mc', q: 'I buy medicine at the ___.', o: ['pharmacy', 'bill', 'appointment', 'library'], a: 0, why: 'A **pharmacy** sells medicine.' },
        { t: 'mc', q: 'Can I ___ your umbrella? I will give it back tomorrow.', o: ['borrow', 'lend', 'pay', 'cost'], a: 0, why: 'You **borrow** from someone. They **lend** to you.' },
        { t: 'mc', q: 'My sister can ___ me some money.', o: ['lend', 'borrow', 'receipt', 'spend'], a: 0, why: 'The giver **lends**.' },
        { t: 'mc', q: 'The opposite of **cheap** is:', o: ['expensive', 'healthy', 'early', 'busy'], a: 0 },
        { t: 'mc', q: 'The opposite of **early** is:', o: ['late', 'tired', 'cheap', 'busy'], a: 0 },
        { t: 'mc', q: 'I paid the electric ___ yesterday.', o: ['bill', 'prescription', 'neighbor', 'schedule'], a: 0 },
        { t: 'fill', q: 'I have an ___ with the dentist at 3:00.', a: ['appointment'], why: 'A planned meeting time is an **appointment**.' },
        { t: 'fill', q: 'The woman next door is my ___.', a: ['neighbor', 'neighbour'] },
        { t: 'mc', q: 'Which word has a silent letter?', o: ['receipt', 'busy', 'bill', 'late'], a: 0, why: 'In **receipt** the **p** is silent: re-SEET.' },
        { t: 'listen', say: 'expensive', o: ['expensive', 'extensive', 'expense', 'explain'], a: 0 },
        { t: 'listen', say: 'schedule', o: ['schedule', 'school', 'scale', 'shuttle'], a: 0 },
        { t: 'tf', q: '"I am very busy" means I have a lot to do.', a: true },
        { t: 'dict', say: 'Keep the receipt.' }
      ]
    },
    {
      id: 'L1U3', kind: 'reading', title: 'Short Stories, Big Ideas', ar: 'قصص قصيرة',
      lesson: [
        { p: 'Good readers ask three questions: **Who** is this about? **What** happens? **Why** does it matter? This is called finding the **main idea**.' },
        { tip: 'Read the whole story once without stopping. Then read it again slowly and look at the questions.' },
        { ar: 'اقري القصة مرة كاملة من غير ما تقفي عند الكلمات الصعبة. بعدين اقريها تاني بالراحة. الفكرة الأساسية هي «القصة دي عن إيه بالظبط؟»' }
      ],
      passages: [
        { title: 'Mona\'s Busy Morning', text: 'Mona wakes up at six o\'clock every morning. First, she makes tea and prepares breakfast for her family. Her son eats quickly because his bus comes at seven.\n\nAfter breakfast, Mona takes the train to work. She works at a bakery. She bakes bread and sweet cakes. Customers love her date cookies.\n\nToday is different. Mona has a doctor\'s appointment at noon, so she asks her manager to leave early. Her manager says yes. Mona is happy because she does not want to miss her appointment.' },
        { title: 'The Library Card', text: 'Samir is fifty years old. He wants to read better in English, so he goes to the public library. The librarian is friendly. She helps him fill out a form for a library card. The card is free.\n\nSamir chooses two easy books with pictures. He also finds a book about cooking. The librarian tells him he can keep the books for three weeks.\n\nAt home, Samir reads for twenty minutes every night. After one month, he reads faster. He feels proud. Now he goes to the library every Saturday.' }
      ],
      items: [
        { t: 'mc', p: 0, q: 'What is the story mostly about?', o: ['A woman\'s morning routine and a special day', 'How to bake cookies', 'A boy who misses his bus', 'A manager at a bakery'], a: 0, why: 'Most of the story describes Mona\'s morning and what is different today.' },
        { t: 'mc', p: 0, q: 'Where does Mona work?', o: ['At a bakery', 'At a hospital', 'At a school', 'On a train'], a: 0 },
        { t: 'mc', p: 0, q: 'Why does Mona ask to leave early?', o: ['She has a doctor\'s appointment.', 'She is tired.', 'Her son is sick.', 'The bakery closes.'], a: 0 },
        { t: 'mc', p: 0, q: 'What does Mona do **first** in the morning?', o: ['She makes tea.', 'She takes the train.', 'She bakes bread.', 'She calls her manager.'], a: 0, why: 'The word **First** tells you the order.' },
        { t: 'tf', p: 0, q: 'Mona\'s son eats slowly.', a: false, why: 'He eats **quickly** because his bus comes at seven.' },
        { t: 'mc', p: 1, q: 'Why does Samir go to the library?', o: ['He wants to read better in English.', 'He wants a job.', 'He needs a cooking class.', 'His friend works there.'], a: 0 },
        { t: 'mc', p: 1, q: 'How much does the library card cost?', o: ['Nothing, it is free', 'Three dollars', 'Twenty dollars', 'The story does not say'], a: 0 },
        { t: 'mc', p: 1, q: 'How does Samir feel after one month?', o: ['Proud', 'Angry', 'Bored', 'Worried'], a: 0 },
        { t: 'mc', p: 1, q: 'What is the main lesson of the story?', o: ['Reading a little every day helps you improve.', 'Libraries are only for children.', 'Cooking books are the best books.', 'Saturdays are busy.'], a: 0, why: 'Samir reads 20 minutes every night and gets better. That is the big idea.' },
        { t: 'mc', p: 1, q: 'In the story, "friendly" means:', o: ['kind and nice', 'very busy', 'angry', 'quiet'], a: 0 },
        { t: 'tf', p: 1, q: 'Samir can keep the books for three weeks.', a: true }
      ]
    },
    {
      id: 'L1U4', kind: 'speaking', title: 'P and B, F and V, Short Vowels', ar: 'أصوات بتتلخبط',
      lesson: [
        { p: 'Arabic does not have the sounds **P** and **V**. Many Arabic speakers say "Beebsi" for Pepsi or "Fery" for very. These sounds are easy to fix with practice.' },
        { h: 'P vs B' },
        { p: 'Put your hand in front of your mouth. Say **P**: you should feel a little puff of air. **B** uses your voice and has almost no air.' },
        { ar: 'حطي إيدك قدام بقك. لما تقولي **P** لازم تحسي بنفخة هوا. حرف **B** فيه صوت ومفيهوش هوا. جربي: pen - Ben.' },
        { pairs: [['pen', 'Ben'], ['pear', 'bear'], ['park', 'bark'], ['pay', 'bay'], ['cap', 'cab'], ['pie', 'buy']] },
        { h: 'F vs V' },
        { p: 'For both sounds, your top teeth touch your bottom lip. **F** is only air. **V** adds your voice, so your lip buzzes.' },
        { ar: 'سنانك اللي فوق تلمس شفايفك اللي تحت. **F** هوا بس. **V** نفس الحركة بس بصوت، فتحسي بزنّة في شفايفك.' },
        { pairs: [['fan', 'van'], ['fine', 'vine'], ['ferry', 'very'], ['safe', 'save'], ['leaf', 'leave'], ['few', 'view']] },
        { h: 'Short i vs long ee' },
        { p: '**ship** has a short, relaxed sound. **sheep** has a long sound with a smile. The meaning changes!' },
        { pairs: [['ship', 'sheep'], ['live', 'leave'], ['sit', 'seat'], ['fill', 'feel'], ['bit', 'beat'], ['hit', 'heat']] },
        { ar: 'الـ i القصيرة في ship صوت قصير ومرتاح. الـ ee في sheep طويلة وكأنك بتبتسمي. لو قلتي غلط المعنى بيتغير!' }
      ],
      speak: [
        'Please pass the pepper.',
        'Peter puts the paper in the bag.',
        'I have a very valuable van.',
        'We visit our family every Friday.',
        'The ship is big, but the sheep is small.',
        'I live here. I will leave tomorrow.',
        'Five brave people drive a big blue bus.'
      ],
      write: [
        { task: 'Write 5 sentences about your family. Use **is**, **are**, and at least two verbs with **-s** (like works, lives, likes).', ar: 'اكتبي ٥ جمل عن عيلتك. استخدمي is و are وفعلين على الأقل بحرف s.', hint: 'Example: My son lives in New Jersey. He works at a bank.' }
      ],
      items: [
        { t: 'listen', say: 'pen', o: ['pen', 'Ben'], a: 0, why: 'Did you hear the puff of air? That is **P**.' },
        { t: 'listen', say: 'bear', o: ['pear', 'bear'], a: 1 },
        { t: 'listen', say: 'park', o: ['park', 'bark'], a: 0 },
        { t: 'listen', say: 'very', o: ['ferry', 'very'], a: 1 },
        { t: 'listen', say: 'fan', o: ['fan', 'van'], a: 0 },
        { t: 'listen', say: 'leave', o: ['leaf', 'leave'], a: 1 },
        { t: 'listen', say: 'sheep', o: ['ship', 'sheep'], a: 1 },
        { t: 'listen', say: 'sit', o: ['sit', 'seat'], a: 0 },
        { t: 'listen', say: 'live', o: ['live', 'leave'], a: 0 },
        { t: 'mc', q: 'When you say **P**, you should feel…', o: ['a puff of air on your hand', 'your lip buzzing', 'your tongue between your teeth', 'nothing at all'], a: 0 },
        { t: 'mc', q: 'For **V**, your top teeth touch your bottom lip and…', o: ['your voice buzzes', 'you push air with no voice', 'your lips close', 'your tongue goes up'], a: 0 },
        { t: 'say', text: 'Please pass the pepper.' },
        { t: 'say', text: 'We visit our family every Friday.' }
      ]
    }
  ],
  test: [
    { t: 'mc', q: 'My children ___ at school now.', o: ['are', 'is', 'am', 'be'], a: 0 },
    { t: 'fill', q: 'She ___ (watch) TV every evening.', a: ['watches'], why: 'Verbs ending in **-ch** add **-es**.' },
    { t: 'mc', q: '___ he have a car?', o: ['Does', 'Do', 'Is', 'Has'], a: 0 }
  ]
});
