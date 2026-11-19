/* Harf content, part 1: the alphabet (Level 1) and vowel marks, special letters, numbers (Level 2). */
window.HARF = window.HARF || { levels: [] };
(function () {
  // joins: whether the letter connects to the NEXT letter (to its left)
  const L = [
    { c: 'ا', name: 'ألف', en: 'alef', tr: 'aa', sound: 'A long "aa". It also carries the hamza (أ, إ).', joins: false, ex: { ar: 'أَكْل', en: 'food', tr: 'akl' } },
    { c: 'ب', name: 'باء', en: 'baa', tr: 'b', sound: '"b" as in "bed".', joins: true, ex: { ar: 'بَيْت', en: 'house', tr: 'beit' } },
    { c: 'ت', name: 'تاء', en: 'taa', tr: 't', sound: '"t" as in "ten".', joins: true, ex: { ar: 'تُفّاح', en: 'apples', tr: 'tuffaaḥ' } },
    { c: 'ث', name: 'ثاء', en: 'thaa', tr: 'th', sound: '"th" as in "think". In Egypt it is usually said "t" or "s".', egy: 'ثلج is written with ث but Egyptians say "talg".', joins: true, ex: { ar: 'ثَلْج', en: 'ice', tr: 'talg' } },
    { c: 'ج', name: 'جيم', en: 'geem', tr: 'g', sound: 'In Egypt a hard "g" as in "go". Other Arabs say "j".', joins: true, ex: { ar: 'جِبْنَة', en: 'cheese', tr: 'gebna' } },
    { c: 'ح', name: 'حاء', en: 'ḥaa', tr: 'ḥ', sound: 'A strong breathy "h" from the throat, as in حب (ḥobb).', joins: true, ex: { ar: 'حُبّ', en: 'love', tr: 'ḥobb' } },
    { c: 'خ', name: 'خاء', en: 'khaa', tr: 'kh', sound: 'A scratchy "kh", like clearing your throat.', joins: true, ex: { ar: 'خِيار', en: 'cucumber', tr: 'khiyaar' } },
    { c: 'د', name: 'دال', en: 'daal', tr: 'd', sound: '"d" as in "door".', joins: false, ex: { ar: 'دُكْتور', en: 'doctor', tr: 'doktoor' } },
    { c: 'ذ', name: 'ذال', en: 'dhaal', tr: 'dh', sound: '"th" as in "this". In Egypt usually said "d" or "z".', egy: 'ذهب is written with ذ but Egyptians say "dahab".', joins: false, ex: { ar: 'ذَهَب', en: 'gold', tr: 'dahab' } },
    { c: 'ر', name: 'راء', en: 'raa', tr: 'r', sound: 'A rolled "r".', joins: false, ex: { ar: 'رُزّ', en: 'rice', tr: 'rozz' } },
    { c: 'ز', name: 'زين', en: 'zein', tr: 'z', sound: '"z" as in "zoo".', joins: false, ex: { ar: 'زَيْت', en: 'oil', tr: 'zeit' } },
    { c: 'س', name: 'سين', en: 'seen', tr: 's', sound: '"s" as in "sun".', joins: true, ex: { ar: 'سَمَك', en: 'fish', tr: 'samak' } },
    { c: 'ش', name: 'شين', en: 'sheen', tr: 'sh', sound: '"sh" as in "she".', joins: true, ex: { ar: 'شاي', en: 'tea', tr: 'shaay' } },
    { c: 'ص', name: 'صاد', en: 'ṣaad', tr: 'ṣ', sound: 'A heavy "s", said with the tongue low, as in صباح.', joins: true, ex: { ar: 'صَباح', en: 'morning', tr: 'ṣabaaḥ' } },
    { c: 'ض', name: 'ضاد', en: 'ḍaad', tr: 'ḍ', sound: 'A heavy "d", as in ضيف.', joins: true, ex: { ar: 'ضَيْف', en: 'guest', tr: 'ḍeif' } },
    { c: 'ط', name: 'طاء', en: 'ṭaa', tr: 'ṭ', sound: 'A heavy "t", as in طماطم.', joins: true, ex: { ar: 'طَماطِم', en: 'tomatoes', tr: 'ṭamaaṭem' } },
    { c: 'ظ', name: 'ظاء', en: 'ẓaa', tr: 'ẓ', sound: 'A heavy "dh". In Egypt usually a heavy "z".', egy: 'ظرف is written with ظ and Egyptians say "zarf".', joins: true, ex: { ar: 'ظَرْف', en: 'envelope', tr: 'ẓarf' } },
    { c: 'ع', name: 'عين', en: 'ʿein', tr: 'ʿ', sound: 'The deep throat sound you already make in عيش. English has no letter for it.', joins: true, ex: { ar: 'عِيش', en: 'bread', tr: 'ʿeish' } },
    { c: 'غ', name: 'غين', en: 'ghein', tr: 'gh', sound: 'A gargled "gh", like a French "r".', joins: true, ex: { ar: 'غَدا', en: 'lunch', tr: 'ghada' } },
    { c: 'ف', name: 'فاء', en: 'faa', tr: 'f', sound: '"f" as in "food".', joins: true, ex: { ar: 'فول', en: 'fava beans', tr: 'fuul' } },
    { c: 'ق', name: 'قاف', en: 'qaaf', tr: 'q / ʾ', sound: 'A deep "q". In Cairo it is usually a stop in the throat, like the break in "uh-oh".', egy: 'قلب is written with ق but Cairenes say "ʾalb".', joins: true, ex: { ar: 'قَلْب', en: 'heart', tr: 'ʾalb' } },
    { c: 'ك', name: 'كاف', en: 'kaaf', tr: 'k', sound: '"k" as in "kite".', joins: true, ex: { ar: 'كَنيسَة', en: 'church', tr: 'keniisa' } },
    { c: 'ل', name: 'لام', en: 'laam', tr: 'l', sound: '"l" as in "love".', joins: true, ex: { ar: 'لَبَن', en: 'milk', tr: 'laban' } },
    { c: 'م', name: 'ميم', en: 'meem', tr: 'm', sound: '"m" as in "mom".', joins: true, ex: { ar: 'مَيَّة', en: 'water', tr: 'mayya' } },
    { c: 'ن', name: 'نون', en: 'noon', tr: 'n', sound: '"n" as in "no".', joins: true, ex: { ar: 'نور', en: 'light', tr: 'nuur' } },
    { c: 'ه', name: 'هاء', en: 'haa', tr: 'h', sound: 'A soft "h" as in "hat".', joins: true, ex: { ar: 'هَوا', en: 'air', tr: 'hawa' } },
    { c: 'و', name: 'واو', en: 'waaw', tr: 'w / oo', sound: '"w" as in "wow", or a long "oo".', joins: false, ex: { ar: 'وَرْد', en: 'flowers', tr: 'ward' } },
    { c: 'ي', name: 'ياء', en: 'yaa', tr: 'y / ee', sound: '"y" as in "yes", or a long "ee".', joins: true, ex: { ar: 'يوم', en: 'day', tr: 'yoom' } }
  ];
  window.HARF.letters = L;
  const by = {}; L.forEach(x => by[x.c] = x);
  window.HARF.letter = by;

  const unit = (id, title, ar, letters, extra) => Object.assign({ id, kind: 'letters', title, ar, letters, trace: letters }, extra || {});

  window.HARF.levels.push({
    id: 'A1', n: 1, title: 'The Letters', ar: 'الحروف', desc: 'All 28 letters: their sounds, their shapes, and how to write them.',
    units: [
      unit('A1U1', 'The first letters: ا ب ت ث', 'أ ب ت ث', ['ا', 'ب', 'ت', 'ث'], { intro: [
        { p: 'Arabic is written and read from **right to left**. Most letters connect to the letter after them, so each letter changes shape a little depending on where it is in a word.' },
        { tip: 'ب ت ث have the **same shape**. Only the dots are different: one dot below (ب), two dots above (ت), three dots above (ث). Dots matter in Arabic!' }
      ] }),
      unit('A1U2', 'Three cups: ج ح خ', 'ج ح خ', ['ج', 'ح', 'خ'], { intro: [
        { tip: 'Same shape again, different dots: dot inside below (ج), no dot (ح), dot on top (خ). You already say all three sounds every day.' }
      ] }),
      unit('A1U3', 'Letters that don\'t join after: د ذ ر ز', 'د ذ ر ز', ['د', 'ذ', 'ر', 'ز'], { intro: [
        { p: 'These four letters **never connect to the letter after them**. When you see a small gap inside a word, one of these letters (or ا or و) is often the reason.' },
        { tip: 'د and ذ: the same, plus a dot. ر and ز: the same, plus a dot. ر sits lower than د.' }
      ] }),
      unit('A1U4', 'Teeth and loops: س ش ص ض', 'س ش ص ض', ['س', 'ش', 'ص', 'ض'], { intro: [
        { tip: 'س looks like three little teeth. ش is the same with three dots on top. ص and ض have a loop instead of teeth; ض has one dot.' }
      ] }),
      unit('A1U5', 'Heavy letters and the throat: ط ظ ع غ', 'ط ظ ع غ', ['ط', 'ظ', 'ع', 'غ'], { intro: [
        { tip: 'ط and ظ look like a loop with a tall stick. ع and غ look like a small open mouth; غ has a dot on top.' }
      ] }),
      unit('A1U6', 'ف ق ك ل', 'ف ق ك ل', ['ف', 'ق', 'ك', 'ل'], { intro: [
        { tip: 'ف (one dot) and ق (two dots) have a round head. ك has a little mark inside. ل is a tall stick with a hook at the bottom.' }
      ] }),
      unit('A1U7', 'The last letters: م ن ه و ي', 'م ن ه و ي', ['م', 'ن', 'ه', 'و', 'ي'], { intro: [
        { tip: 'و and ي are also long vowels: و can be "oo" (فول) and ي can be "ee" (عيش). You will learn this more in Level 2.' }
      ] }),
      {
        id: 'A1U8', kind: 'joining', title: 'Joining letters into words', ar: 'توصيل الحروف',
        intro: [
          { p: 'Every letter has up to **four shapes**: alone, at the start of a word, in the middle, and at the end. The core shape stays the same; the letter just gets a short "tail" to hold hands with its neighbors.' },
          { forms: ['ب', 'ع', 'ه', 'ي', 'ك'] },
          { p: 'Six letters **never join to the next letter**: ا د ذ ر ز و. After them, the next letter starts fresh.' },
          { ex: [{ ar: 'دار', tr: 'daar', en: 'house (old word)' }, { ar: 'ورد', tr: 'ward', en: 'flowers' }, { ar: 'زر', tr: 'zorr', en: 'button' }] },
          { p: 'One special pair: ل followed by ا is written **لا** (laa). It means "no".' },
          { ex: [{ ar: 'لا', tr: 'laa', en: 'no' }, { ar: 'سلام', tr: 'salaam', en: 'peace / hello' }] }
        ],
        trace: ['بيت', 'لا', 'سلام'],
        spell: [{ ar: 'بيت', en: 'house' }, { ar: 'باب', en: 'door' }, { ar: 'نور', en: 'light' }, { ar: 'فول', en: 'fava beans' }, { ar: 'سمك', en: 'fish' }, { ar: 'شاي', en: 'tea' }, { ar: 'لبن', en: 'milk' }, { ar: 'ورد', en: 'flowers' }],
        items: [
          { t: 'mc', q: 'Which of these letters does NOT join to the letter after it?', o: ['ر', 'ب', 'س', 'م'], a: 0, why: 'ا د ذ ر ز و never join to the next letter.' },
          { t: 'mc', q: 'Which of these letters does NOT join to the letter after it?', o: ['و', 'ل', 'ك', 'ن'], a: 0 },
          { t: 'mc', q: 'How is ل + ا written together?', o: ['لا', 'ال', 'لو', 'ىل'], a: 0, why: 'ل followed by ا becomes the special shape لا.' },
          { t: 'mc', big: 'ـبـ', q: 'This is the middle shape of which letter?', o: ['ب', 'ن', 'ي', 'ت'], a: 0, why: 'One dot below: ب.' },
          { t: 'mc', big: 'ـع', q: 'This is the end shape of which letter?', o: ['ع', 'غ', 'ح', 'ه'], a: 0 },
          { t: 'mc', big: 'هـ', q: 'This is the start shape of which letter?', o: ['ه', 'ة', 'و', 'م'], a: 0 }
        ]
      }
    ]
  });

  window.HARF.levels.push({
    id: 'A2', n: 2, title: 'Vowels and Special Marks', ar: 'التشكيل',
    desc: 'The little marks that show vowels, long vowels, doubled letters, ة, hamza, "the", and Arabic numbers.',
    units: [
      {
        id: 'A2U1', kind: 'marks', title: 'Short vowels: َ ِ ُ ْ', ar: 'الفتحة والكسرة والضمة',
        intro: [
          { p: 'Short vowels are small marks written **above or below** a letter. Children\'s books, the Bible, and lessons use them. Newspapers, signs, and phones usually leave them out, and you guess from the word (you already know the words!).' },
          { table: [['Mark', 'Name', 'Sound', 'Example'], ['بَ', 'fatḥa (line above)', 'a', 'ba'], ['بِ', 'kasra (line below)', 'e / i', 'be'], ['بُ', 'ḍamma (small و above)', 'o / u', 'bo'], ['بْ', 'sukuun (small circle)', 'no vowel', 'b']] },
          { tip: 'In Egyptian speech, kasra often sounds like "e" (بِنْت = bent) and ḍamma often like "o" (رُزّ = rozz).' },
          { ex: [{ ar: 'بِنْت', tr: 'bent', en: 'girl' }, { ar: 'قَلْب', tr: 'ʾalb', en: 'heart' }, { ar: 'سَمَك', tr: 'samak', en: 'fish' }] }
        ],
        syllables: ['بَ', 'بِ', 'بُ', 'تَ', 'تِ', 'تُ', 'سَ', 'سِ', 'سُ', 'مَ', 'مِ', 'مُ', 'نَ', 'نِ', 'نُ'],
        items: [
          { t: 'mc', big: 'بَ', q: 'How do you say this?', o: ['ba', 'be', 'bo', 'b'], a: 0, why: 'A line above (fatḥa) is "a".' },
          { t: 'mc', big: 'سِ', q: 'How do you say this?', o: ['se', 'sa', 'so', 's'], a: 0, why: 'A line below (kasra) is "e / i".' },
          { t: 'mc', big: 'مُ', q: 'How do you say this?', o: ['mo', 'ma', 'me', 'm'], a: 0, why: 'A small و above (ḍamma) is "o / u".' },
          { t: 'mc', big: 'نْ', q: 'What does the small circle (sukuun) mean?', o: ['no vowel: just "n"', 'a long "aa"', 'say it twice', '"en" at the end'], a: 0 },
          { t: 'mc', q: 'Which mark is a fatḥa ("a")?', o: ['بَ', 'بِ', 'بُ', 'بْ'], a: 0 },
          { t: 'mc', big: 'قَلْب', q: 'This word is "ʾalb" (heart). Which letter has no vowel?', o: ['ل', 'ق', 'ب', 'none'], a: 0, why: 'ل has a sukuun: qa-l-b, ʾa-l-b.' }
        ]
      },
      {
        id: 'A2U2', kind: 'marks', title: 'Long vowels: ا و ي', ar: 'حروف المد',
        intro: [
          { p: 'Three letters also work as **long vowels**: ا = "aa", و = "oo" or "ou", ي = "ee" or "ei". Most Egyptian words you know use them.' },
          { ex: [{ ar: 'باب', tr: 'baab', en: 'door' }, { ar: 'نور', tr: 'nuur', en: 'light' }, { ar: 'فول', tr: 'fuul', en: 'fava beans' }, { ar: 'عيش', tr: 'ʿeish', en: 'bread' }, { ar: 'بيت', tr: 'beit', en: 'house' }, { ar: 'يوم', tr: 'yoom', en: 'day' }] },
          { tip: 'In Egyptian, و often sounds like "oo" or "oh" (يوم = yoom) and ي like "ee" or "ei" (بيت = beit). The spelling is the same.' }
        ],
        items: [
          { t: 'mc', big: 'باب', q: 'Which letter makes the long "aa" here?', o: ['ا', 'ب', 'none', 'و'], a: 0 },
          { t: 'mc', big: 'فول', q: 'Which letter makes the long "oo" here?', o: ['و', 'ف', 'ل', 'ي'], a: 0 },
          { t: 'mc', big: 'عيش', q: 'Which letter makes the long "ee/ei" sound here?', o: ['ي', 'ع', 'ش', 'و'], a: 0 },
          { t: 'listen', say: 'نُور', q: 'Which word do you hear?', o: ['نور', 'نار', 'نير', 'نر'], a: 0 }
        ],
        spell: [{ ar: 'باب', en: 'door' }, { ar: 'نور', en: 'light' }, { ar: 'عيش', en: 'bread' }, { ar: 'يوم', en: 'day' }, { ar: 'فول', en: 'fava beans' }, { ar: 'بيت', en: 'house' }]
      },
      {
        id: 'A2U3', kind: 'marks', title: 'Doubled letters and endings: ّ ً', ar: 'الشدة والتنوين',
        intro: [
          { p: 'The **shadda** ( ّ ) looks like a small "w" on top of a letter. It means the letter is **doubled**: you hold it a little longer.' },
          { ex: [{ ar: 'مَيَّة', tr: 'mayya', en: 'water' }, { ar: 'رُزّ', tr: 'rozz', en: 'rice' }, { ar: 'سُكَّر', tr: 'sokkar', en: 'sugar' }, { ar: 'حُبّ', tr: 'ḥobb', en: 'love' }] },
          { p: 'The **tanween** is a doubled vowel mark at the end of a word that adds an "n" sound. In Egyptian you mostly see it as **ـاً** = "-an".' },
          { ex: [{ ar: 'شُكْراً', tr: 'shokran', en: 'thank you' }, { ar: 'أَهْلاً', tr: 'ahlan', en: 'welcome' }, { ar: 'جِدّاً', tr: 'geddan', en: 'very' }] }
        ],
        items: [
          { t: 'mc', big: 'رُزّ', q: 'What does the small "w" (shadda) on ز mean?', o: ['say the letter twice / longer', 'no vowel', 'add an "n"', 'a long "oo"'], a: 0 },
          { t: 'mc', big: 'شُكْراً', q: 'How do you say this?', o: ['shokran', 'shokra', 'shokr', 'shakir'], a: 0, why: 'ـاً at the end = "-an".' },
          { t: 'listen', say: 'أَهْلاً', q: 'Which word do you hear?', o: ['أهلاً', 'أهل', 'هلا', 'أهلي'], a: 0 },
          { t: 'mc', big: 'مَيَّة', q: 'This word is "mayya" (water). Which letter is doubled?', o: ['ي', 'م', 'ة', 'none'], a: 0 }
        ]
      },
      {
        id: 'A2U4', kind: 'marks', title: 'Special letters: ة ى ء أ', ar: 'التاء المربوطة والهمزة',
        intro: [
          { p: '**ة** (taa marbuuṭa) looks like ه with two dots. It only comes at the **end** of a word and usually sounds like **"-a"**. Many words for women and things end with it.' },
          { ex: [{ ar: 'جِبْنَة', tr: 'gebna', en: 'cheese' }, { ar: 'كَنيسَة', tr: 'keniisa', en: 'church' }, { ar: 'مَدْرَسَة', tr: 'madrasa', en: 'school' }] },
          { p: '**ى** (alef maqṣuura) looks like ي without dots, at the end of a word. It sounds like "a".' },
          { ex: [{ ar: 'عَلى', tr: 'ʿala', en: 'on' }, { ar: 'مُسْتَشْفى', tr: 'mostashfa', en: 'hospital' }] },
          { p: '**ء** (hamza) is a small "stop" sound, like the start of "uh-oh". It often sits on a seat: أ (on alef, top), إ (below), ؤ (on و), ئ (on ي).' },
          { ex: [{ ar: 'أَنا', tr: 'ana', en: 'I' }, { ar: 'إِيد', tr: 'eid', en: 'hand' }, { ar: 'سُؤال', tr: 'soʾaal', en: 'question' }] },
          { tip: 'آ (alef with a wave) is a long "aa" at the start, as in آمين (aamiin).' }
        ],
        items: [
          { t: 'mc', big: 'ة', q: 'How does ة usually sound at the end of a word?', o: ['"-a"', '"-t"', '"-h" only', '"-ee"'], a: 0 },
          { t: 'mc', q: 'Which word ends in taa marbuuṭa (ة)?', o: ['جبنة', 'بيت', 'شاي', 'فول'], a: 0 },
          { t: 'mc', q: 'Which letter is a hamza on an alef?', o: ['أ', 'ا', 'ى', 'ة'], a: 0 },
          { t: 'mc', big: 'على', q: 'The last letter here looks like ي without dots. It sounds like…', o: ['"a"', '"ee"', '"n"', '"t"'], a: 0 },
          { t: 'listen', say: 'كَنيسَة', q: 'Which word do you hear?', o: ['كنيسة', 'كنيس', 'كتاب', 'كبيرة'], a: 0 }
        ]
      },
      {
        id: 'A2U5', kind: 'marks', title: '"The": ال and the sun letters', ar: 'أل الشمسية والقمرية',
        intro: [
          { p: '**ال** at the start of a word means **"the"**, like Egyptian "el-". بيت = a house, البيت = the house (el-beit).' },
          { p: 'Before some letters, the ل is written but **not said**: the next letter is doubled instead. These are called "sun letters" because الشمس (the sun) is said "esh-shams", not "el-shams".' },
          { ex: [{ ar: 'البيت', tr: 'el-beit', en: 'the house (moon letter: say the ل)' }, { ar: 'الشمس', tr: 'esh-shams', en: 'the sun (sun letter: skip the ل)' }, { ar: 'الرز', tr: 'er-rozz', en: 'the rice (sun letter)' }, { ar: 'القمر', tr: 'el-ʾamar', en: 'the moon (moon letter)' }] },
          { tip: 'You already do this when you speak! Just remember: the ل is always written, even when you don\'t say it.' }
        ],
        items: [
          { t: 'mc', q: 'What does ال mean at the start of a word?', o: ['the', 'and', 'in', 'my'], a: 0 },
          { t: 'mc', big: 'الشاي', q: 'How do you say "the tea"?', o: ['esh-shaay', 'el-shaay', 'al-shaay-l', 'shaay-el'], a: 0, why: 'ش is a sun letter: the ل is silent and ش is doubled.' },
          { t: 'mc', big: 'الباب', q: 'How do you say "the door"?', o: ['el-baab', 'eb-baab', 'baab-el', 'al-aab'], a: 0, why: 'ب is a moon letter: say the ل.' },
          { t: 'mc', big: 'البيت', q: 'What does this mean?', o: ['the house', 'a house', 'my house', 'houses'], a: 0 }
        ]
      },
      {
        id: 'A2U6', kind: 'numbers', title: 'Arabic numbers ٠–٩', ar: 'الأرقام',
        intro: [
          { p: 'Egypt uses these number shapes on prices, phones, buses, and IDs. Unlike letters, **numbers are written left to right**, just like English.' },
          { numtable: true },
          { tip: 'Watch out: ٥ (5) looks like a small circle, and ٠ (0) is just a dot. ٦ (6) looks like a 7 upside down, and ٧ (7) looks like a V.' },
          { ex: [{ ar: '١٥', tr: '15', en: 'fifteen' }, { ar: '٢٠٢٦', tr: '2026', en: 'a year' }, { ar: '٠١٠٠١٢٣٤٥٦٧', tr: '01001234567', en: 'a phone number' }] }
        ]
      }
    ]
  });
})();
