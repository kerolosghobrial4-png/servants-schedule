/* Harf content, part 2: words you already know (Level 3), Egyptian sentences and messages (Level 4), formal Arabic (Level 5). */
(function () {
  const W = (ar, en, tr) => ({ ar, en, tr });
  const S = (ar, en, tr) => ({ ar, en, tr });

  window.HARF.levels.push({
    id: 'A3', n: 3, title: 'Reading Words You Know', ar: 'كلمات تعرفها',
    desc: 'Everyday Egyptian words, first with vowel marks, then without, the way you will see them in real life.',
    units: [
      { id: 'A3U1', kind: 'words', title: 'Family and people', ar: 'العيلة والناس', words: [
        W('أَب', 'father', 'ab'), W('أُمّ', 'mother', 'omm'), W('أَخ', 'brother', 'akh'), W('أُخْت', 'sister', 'okht'),
        W('اِبْن', 'son', 'ebn'), W('بِنْت', 'daughter / girl', 'bent'), W('جوز', 'husband', 'gooz'), W('عيلَة', 'family', 'ʿeila'),
        W('صاحِب', 'friend', 'ṣaaḥeb'), W('جار', 'neighbor', 'gaar'), W('طِفْل', 'child', 'ṭefl'), W('راجِل', 'man', 'raagel')
      ] },
      { id: 'A3U2', kind: 'words', title: 'Food and drink', ar: 'الأكل والشرب', words: [
        W('عيش', 'bread', 'ʿeish'), W('مَيَّة', 'water', 'mayya'), W('شاي', 'tea', 'shaay'), W('قَهْوَة', 'coffee', 'ʾahwa'),
        W('لَبَن', 'milk', 'laban'), W('جِبْنَة', 'cheese', 'gebna'), W('فول', 'fava beans', 'fuul'), W('رُزّ', 'rice', 'rozz'),
        W('لَحْمَة', 'meat', 'laḥma'), W('فِراخ', 'chicken', 'feraakh'), W('سُكَّر', 'sugar', 'sokkar'), W('مِلْح', 'salt', 'malḥ')
      ] },
      { id: 'A3U3', kind: 'words', title: 'Home and places', ar: 'البيت والأماكن', words: [
        W('بيت', 'house', 'beit'), W('باب', 'door', 'baab'), W('أوضَة', 'room', 'ooḍa'), W('مَطْبَخ', 'kitchen', 'maṭbakh'),
        W('شارِع', 'street', 'shaareʿ'), W('كَنيسَة', 'church', 'keniisa'), W('مَدْرَسَة', 'school', 'madrasa'), W('شُغْل', 'work', 'shoghl'),
        W('سوق', 'market', 'suuʾ'), W('مُسْتَشْفى', 'hospital', 'mostashfa'), W('عَرَبِيَّة', 'car', 'ʿarabeyya'), W('مَحَطَّة', 'station', 'maḥaṭṭa')
      ] },
      { id: 'A3U4', kind: 'words', title: 'Time and everyday words', ar: 'كلمات كل يوم', words: [
        W('صَباح', 'morning', 'ṣabaaḥ'), W('ليل', 'night', 'leil'), W('يوم', 'day', 'yoom'), W('النَّهارْدَه', 'today', 'en-naharda'),
        W('بُكْرَة', 'tomorrow', 'bokra'), W('إِمْبارِح', 'yesterday', 'embaareḥ'), W('دِلْوَقْتي', 'now', 'delwaʾti'), W('أَيْوَه', 'yes', 'aywa'),
        W('لأ', 'no', 'laʾ'), W('شُكْراً', 'thank you', 'shokran'), W('سَلام', 'peace / hello', 'salaam'), W('حاضِر', 'okay, sure', 'ḥaaḍer')
      ] },
      { id: 'A3U5', kind: 'words', title: 'Reading without vowel marks', ar: 'من غير تشكيل', plain: true,
        intro: [
          { p: 'In real life (signs, phones, newspapers) the vowel marks are left out. You read the letters and your knowledge of Egyptian fills in the vowels. You can do this: you already know these words.' },
          { tip: 'Read the consonants, then ask yourself: "Which word that I know has these letters?"' }
        ],
        words: [
          W('عيلة', 'family', 'ʿeila'), W('صاحب', 'friend', 'ṣaaḥeb'), W('قهوة', 'coffee', 'ʾahwa'), W('جبنة', 'cheese', 'gebna'),
          W('مطبخ', 'kitchen', 'maṭbakh'), W('شارع', 'street', 'shaareʿ'), W('مدرسة', 'school', 'madrasa'), W('عربية', 'car', 'ʿarabeyya'),
          W('النهارده', 'today', 'en-naharda'), W('بكرة', 'tomorrow', 'bokra'), W('دلوقتي', 'now', 'delwaʾti'), W('امبارح', 'yesterday', 'embaareḥ')
        ] }
    ]
  });

  window.HARF.levels.push({
    id: 'A4', n: 4, title: 'Egyptian Sentences and Messages', ar: 'جمل ورسايل',
    desc: 'Read and write the Egyptian you speak: greetings, everyday needs, WhatsApp messages, and signs.',
    units: [
      { id: 'A4U1', kind: 'sentences', title: 'Greetings', ar: 'التحية', sentences: [
        S('صباح الخير', 'Good morning', 'ṣabaaḥ el-kheir'), S('إزيك؟', 'How are you?', 'ezzayyak?'), S('أنا كويس، الحمد لله', 'I\'m fine, thank God', 'ana kwayyes, el-ḥamdu lellaah'),
        S('اسمك إيه؟', 'What is your name?', 'esmak eih?'), S('اسمي كيرلس', 'My name is Kirollos', 'esmi kerollos'), S('تشرفنا', 'Nice to meet you', 'tasharrafna'),
        S('مع السلامة', 'Goodbye', 'maʿa s-salaama'), S('تصبح على خير', 'Good night', 'teṣbaḥ ʿala kheir')
      ] },
      { id: 'A4U2', kind: 'sentences', title: 'Wants and needs', ar: 'عايز إيه', sentences: [
        S('أنا عايز أشرب شاي', 'I want to drink tea', 'ana ʿaayez ashrab shaay'), S('عايز مية لو سمحت', 'I want water, please', 'ʿaayez mayya law samaḥt'), S('أنا مش عايز', 'I don\'t want (it)', 'ana mesh ʿaayez'),
        S('فين الحمام؟', 'Where is the bathroom?', 'fein el-ḥammaam?'), S('بكام ده؟', 'How much is this?', 'bekaam da?'), S('أنا جعان', 'I am hungry', 'ana gaʿaan'),
        S('أنا تعبان شوية', 'I am a little tired', 'ana taʿbaan shwayya'), S('ممكن تساعدني؟', 'Can you help me?', 'momken tesaʿedni?')
      ] },
      { id: 'A4U3', kind: 'sentences', title: 'WhatsApp messages', ar: 'رسايل واتساب',
        intro: [
          { p: 'Texts in Egyptian are written the way people speak. Spelling is relaxed, and vowel marks are almost never used. These are messages you might send or get every day.' }
        ],
        sentences: [
          S('أنا في الطريق', 'I\'m on the way', 'ana fe ṭ-ṭarii\''), S('هتأخر شوية', 'I\'ll be a little late', 'hatʾakhkhar shwayya'), S('كلمني لما تفضى', 'Call me when you\'re free', 'kallemni lamma tefḍa'),
          S('تمام', 'Okay / all good', 'tamaam'), S('ماشي', 'Okay / fine', 'maashi'), S('ربنا معاك', 'God be with you', 'rabbena maʿaak'),
          S('كل سنة وانت طيب', 'Happy holidays / many happy returns', 'koll sana w enta ṭayyeb'), S('وحشتني', 'I miss you', 'waḥashtini')
        ] },
      { id: 'A4U4', kind: 'words', title: 'Signs and menus', ar: 'لافتات ومنيو', plain: true,
        intro: [
          { p: 'Signs often use formal words. Many of them you have heard but never seen written. Read each one, then check your guess.' }
        ],
        words: [
          W('دخول', 'entrance', 'dukhuul'), W('خروج', 'exit', 'khuruug'), W('مغلق', 'closed', 'moghlaq'), W('مفتوح', 'open', 'maftuuḥ'),
          W('صيدلية', 'pharmacy', 'ṣaydaleyya'), W('سيدات', 'women (restroom)', 'sayyedaat'), W('رجال', 'men (restroom)', 'regaal'), W('ممنوع', 'forbidden', 'mamnuuʿ'),
          W('مخبز', 'bakery', 'makhbaz'), W('مطعم', 'restaurant', 'maṭʿam'), W('عصير', 'juice', 'ʿaṣiir'), W('حلويات', 'sweets', 'ḥalaweyyaat')
        ] }
    ]
  });

  window.HARF.levels.push({
    id: 'A5', n: 5, title: 'Formal Arabic (Fusha)', ar: 'الفصحى',
    desc: 'The written language of books, news, signs, and church: how it differs from Egyptian, and reading real texts.',
    units: [
      { id: 'A5U1', kind: 'words', title: 'Egyptian sounds vs. Fusha sounds', ar: 'النطق في الفصحى',
        intro: [
          { p: 'Fusha (formal Arabic) is written with the same letters, but a few letters are said differently than in Cairo. When you read aloud in a formal setting (like church), people use the Fusha sounds.' },
          { table: [['Letter', 'Egyptian', 'Fusha', 'Example'], ['ق', 'ʾ (stop)', 'q (deep k)', 'قلب: ʾalb → qalb'], ['ج', 'g', 'j', 'جميل: gamiil → jamiil'], ['ث', 't / s', 'th (think)', 'ثلاثة: talaata → thalaatha'], ['ذ', 'd / z', 'dh (this)', 'ذهب: dahab → dhahab']] },
          { tip: 'The spelling never changes. Only how you say it changes.' }
        ],
        words: [
          W('قَلْب', 'heart (Fusha: qalb)', 'qalb'), W('جَميل', 'beautiful (Fusha: jamiil)', 'jamiil'), W('ثَلاثَة', 'three (Fusha: thalaatha)', 'thalaatha'), W('ذَهَب', 'gold (Fusha: dhahab)', 'dhahab'),
          W('قَمَر', 'moon (Fusha: qamar)', 'qamar'), W('جَبَل', 'mountain (Fusha: jabal)', 'jabal'), W('ثَوْب', 'garment (Fusha: thawb)', 'thawb'), W('هٰذا', 'this (Fusha: haadha)', 'haadha')
        ] },
      { id: 'A5U2', kind: 'words', title: 'Common Fusha words', ar: 'كلمات فصحى',
        intro: [
          { p: 'Many everyday ideas have a different word in Fusha. You have heard most of them in church, on TV, or in songs.' },
          { table: [['Fusha', 'Egyptian', 'Meaning'], ['ماذا', 'إيه', 'what'], ['لماذا', 'ليه', 'why'], ['أين', 'فين', 'where'], ['متى', 'إمتى', 'when'], ['كيف', 'إزاي', 'how'], ['الآن', 'دلوقتي', 'now'], ['هذا / هذه', 'ده / دي', 'this'], ['نعم', 'أيوه', 'yes'], ['جداً', 'قوي', 'very'], ['ليس', 'مش', 'not']] }
        ],
        words: [
          W('ماذا', 'what (Egyptian: إيه)', 'maadha'), W('لِماذا', 'why (Egyptian: ليه)', 'limaadha'), W('أَيْن', 'where (Egyptian: فين)', 'ayna'), W('مَتى', 'when (Egyptian: إمتى)', 'mata'),
          W('كَيْف', 'how (Egyptian: إزاي)', 'kayfa'), W('الآن', 'now (Egyptian: دلوقتي)', 'al-aan'), W('نَعَم', 'yes (Egyptian: أيوه)', 'naʿam'), W('جِدّاً', 'very (Egyptian: قوي)', 'jiddan'),
          W('لَيْسَ', 'not (Egyptian: مش)', 'laysa'), W('يُريد', 'he wants (Egyptian: عايز)', 'yuriid'), W('كَثير', 'a lot (Egyptian: كتير)', 'kathiir'), W('صَغير', 'small (Egyptian: صغير)', 'ṣaghiir')
        ] },
      { id: 'A5U3', kind: 'sentences', title: 'Reading real texts: the Lord\'s Prayer', ar: 'الصلاة الربانية',
        intro: [
          { p: 'A text you may already know by heart. Reading something you know is one of the best ways to practice: your memory helps your eyes. Read each line, listen, then read it aloud.' }
        ],
        sentences: [
          S('أبانا الذي في السماوات', 'Our Father who art in heaven', 'abaana alladhi fi s-samawaat'), S('ليتقدس اسمك', 'Hallowed be thy name', 'liyataqaddas ismuk'),
          S('ليأت ملكوتك', 'Thy kingdom come', 'liyaʾti malakuutuk'), S('لتكن مشيئتك', 'Thy will be done', 'litakun mashiʾatuk'),
          S('كما في السماء كذلك على الأرض', 'On earth as it is in heaven', 'kamaa fi s-samaaʾ kadhaalika ʿala l-arḍ'), S('خبزنا الذي للغد أعطنا اليوم', 'Give us this day our daily bread', 'khubzana alladhi lil-ghad aʿṭina l-yawm'),
          S('واغفر لنا ذنوبنا', 'And forgive us our trespasses', 'waghfir lana dhunuubana'), S('كما نغفر نحن أيضاً للمذنبين إلينا', 'As we forgive those who trespass against us', 'kamaa naghfir naḥnu ayḍan lil-mudhnibiina ilayna'),
          S('ولا تدخلنا في تجربة', 'And lead us not into temptation', 'wa laa tudkhilna fi tajriba'), S('لكن نجنا من الشرير', 'But deliver us from evil', 'laakin najjina mina sh-shirriir')
        ] }
    ]
  });
})();
