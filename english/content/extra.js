/* Extra practice items, added to existing units by id. Loaded after level and talk files, before app.js. */
(function () {
  const EXTRA = {
    L1U1: [
      { t: 'mc', q: 'They ___ from Egypt.', o: ['are', 'is', 'am', 'be'], a: 0 },
      { t: 'mc', q: 'It ___ very hot today.', o: ['is', 'are', 'am', 'be'], a: 0 },
      { t: 'fill', q: 'My daughter ___ (watch) cartoons on Saturday.', a: ['watches'], why: '-ch → **-es**: watches.' },
      { t: 'fill', q: 'He ___ (fix) cars at a garage.', a: ['fixes'], why: '-x → **-es**: fixes.' },
      { t: 'fill', q: 'The baby ___ (cry) when she is hungry.', a: ['cries'], why: 'consonant + y → **-ies**.' },
      { t: 'fill', q: 'She ___ (play) with her friends.', a: ['plays'], why: 'vowel + y → just add **-s**: plays (not plaies).' },
      { t: 'mc', q: '___ they work on Sundays?', o: ['Do', 'Does', 'Are', 'Is'], a: 0 },
      { t: 'mc', q: 'My manager ___ like loud music.', o: ["doesn't", "don't", "isn't", "not"], a: 0 },
      { t: 'mc', q: 'Which sentence is correct?', o: ['My sister lives in Texas.', 'My sister live in Texas.', 'My sister living in Texas.', 'My sister is live in Texas.'], a: 0 },
      { t: 'mc', q: 'Which sentence is correct?', o: ['I am not hungry.', 'I not hungry.', 'I no am hungry.', 'I don\'t hungry.'], a: 0, why: 'With **be**, put **not** after the verb: I am not…' },
      { t: 'mc', q: '"Is he a nurse?" "Yes, ___."', o: ['he is', 'he does', 'he are', 'is he'], a: 0 },
      { t: 'order', a: 'Does your husband work at night' },
      { t: 'order', a: 'My son studies English every day' },
      { t: 'dict', say: 'He doesn\'t drive to work.' }
    ],
    L1U2: [
      { t: 'mc', q: 'I can\'t come to the party. I\'m too ___ this week.', o: ['busy', 'cheap', 'healthy', 'early'], a: 0 },
      { t: 'mc', q: 'Fruit and vegetables are ___.', o: ['healthy', 'tired', 'late', 'expensive'], a: 0 },
      { t: 'mc', q: 'The bus came at 8:30, but it usually comes at 8:00. It was ___.', o: ['late', 'early', 'cheap', 'busy'], a: 0 },
      { t: 'mc', q: 'You give the pharmacist your ___.', o: ['prescription', 'neighbor', 'schedule', 'bill'], a: 0 },
      { t: 'mc', q: 'You want to return a shirt. The store asks for your ___.', o: ['receipt', 'prescription', 'appointment', 'neighbor'], a: 0 },
      { t: 'mc', q: 'I worked twelve hours today. I am very ___.', o: ['tired', 'cheap', 'early', 'healthy'], a: 0 },
      { t: 'mc', q: 'Check the train ___ to see what time it leaves.', o: ['schedule', 'receipt', 'bill', 'pharmacy'], a: 0 },
      { t: 'fill', q: 'This bag was only two dollars. It was very ___.', a: ['cheap'] },
      { t: 'fill', q: 'I need to make an ___ with the doctor.', a: ['appointment'] },
      { t: 'tf', q: '"Borrow" and "lend" mean the same thing.', a: false, why: 'You **borrow from** someone. Someone **lends to** you.' },
      { t: 'listen', say: 'appointment', o: ['appointment', 'apartment', 'department', 'payment'], a: 0 },
      { t: 'listen', say: 'neighbor', o: ['neighbor', 'number', 'labor', 'nature'], a: 0 }
    ],
    L1U3: [
      { t: 'mc', p: 0, q: 'What time does Mona wake up?', o: ['At six o\'clock', 'At seven o\'clock', 'At noon', 'At eight o\'clock'], a: 0 },
      { t: 'mc', p: 0, q: 'What do customers love?', o: ['Her date cookies', 'Her bread', 'Her tea', 'Her cakes'], a: 0 },
      { t: 'mc', p: 0, q: 'How does Mona go to work?', o: ['By train', 'By bus', 'By car', 'She walks'], a: 0 },
      { t: 'mc', p: 0, q: 'How does Mona feel when her manager says yes?', o: ['Happy', 'Angry', 'Sad', 'Nervous'], a: 0 },
      { t: 'mc', p: 1, q: 'What did Samir choose at the library?', o: ['Two easy books and a cooking book', 'One long novel', 'A newspaper', 'Three dictionaries'], a: 0 },
      { t: 'mc', p: 1, q: 'How long does Samir read every night?', o: ['Twenty minutes', 'Two hours', 'Five minutes', 'One hour'], a: 0 },
      { t: 'mc', p: 1, q: 'When does Samir go to the library now?', o: ['Every Saturday', 'Every day', 'Once a year', 'Every Monday'], a: 0 },
      { t: 'tf', p: 1, q: 'Samir paid money for his library card.', a: false, why: 'The text says "The card is free."' }
    ],
    L1U4: [
      { t: 'listen', say: 'pay', o: ['pay', 'bay'], a: 0 },
      { t: 'listen', say: 'cab', o: ['cap', 'cab'], a: 1 },
      { t: 'listen', say: 'view', o: ['few', 'view'], a: 1 },
      { t: 'listen', say: 'safe', o: ['safe', 'save'], a: 0 },
      { t: 'listen', say: 'feel', o: ['fill', 'feel'], a: 1 },
      { t: 'listen', say: 'hit', o: ['hit', 'heat'], a: 0 },
      { t: 'mc', q: 'Why do many Arabic speakers say "Beebsi" for Pepsi?', o: ['Arabic has no P sound, so they use B.', 'Pepsi is spelled with B.', 'It is the American accent.', 'P is silent in English.'], a: 0 },
      { t: 'mc', q: 'To say **sheep** (long ee), your lips…', o: ['spread a little, like a smile', 'make a circle', 'close completely', 'stay relaxed and short'], a: 0 },
      { t: 'say', text: 'Peter puts the paper in the bag.' },
      { t: 'say', text: 'I live here. I will leave tomorrow.' }
    ],
    L1T: [
      { t: 'mc', q: 'A coworker says, "How are you today?" You answer:', o: ['I\'m good, thanks. And you?', 'I am 45.', 'Yes, today.', 'I go to work.'], a: 0 },
      { t: 'mc', q: 'You want to know how to write a word. You say:', o: ['How do you spell that?', 'Write it!', 'Spell is what?', 'Letters, please.'], a: 0 },
      { t: 'mc', q: 'It\'s your first day. You meet your manager. You say:', o: ['Hi, I\'m Mona. Nice to meet you.', 'Hello, what is your salary?', 'Who are you?', 'I am new, give me work.'], a: 0 },
      { t: 'mc', q: 'At the end of the day, a coworker says "See you tomorrow!" You say:', o: ['See you tomorrow!', 'Nice to meet you.', 'Good morning!', 'You\'re welcome.'], a: 0 },
      { t: 'mc', q: 'Which is a good small talk question on Monday?', o: ['Did you have a nice weekend?', 'How old are you?', 'Are you married?', 'How much is your rent?'], a: 0 },
      { t: 'order', a: 'How do you spell that' },
      { t: 'listen', say: 'Could you speak a little more slowly, please?', o: ['Could you speak a little more slowly, please?', 'Could you sleep a little more, please?', 'Could you speak a little more loudly, please?', 'Could you seek a little more, please?'], a: 0 },
      { t: 'dict', say: 'How was your weekend?' }
    ],
    L2U1: [
      { t: 'fill', q: 'I ___ (see) my cousin at the wedding.', a: ['saw'] },
      { t: 'fill', q: 'She ___ (make) a cake for her son\'s birthday.', a: ['made'] },
      { t: 'fill', q: 'We ___ (plan) the party last week.', a: ['planned'], why: 'Short verb ending consonant-vowel-consonant: double the last letter: plan**ned**.' },
      { t: 'fill', q: 'He ___ (tell) me the news.', a: ['told'] },
      { t: 'fill', q: 'They ___ (live) in Cairo for ten years.', a: ['lived'] },
      { t: 'mc', q: 'Where ___ you go yesterday?', o: ['did', 'do', 'were', 'went'], a: 0 },
      { t: 'mc', q: 'I ___ my keys this morning. Where are they?', o: ['lost', 'lose', 'losed', 'loses'], a: 0 },
      { t: 'mc', q: 'She didn\'t ___ the bus.', o: ['take', 'took', 'takes', 'taken'], a: 0 },
      { t: 'mc', q: 'There is ___ apple and ___ banana on the table.', o: ['an / a', 'a / an', 'a / a', 'an / an'], a: 0 },
      { t: 'mc', q: 'Can you open ___ window, please? (the one in this room)', o: ['the', 'a', 'an', '(nothing)'], a: 0 },
      { t: 'mc', q: 'Which sentence is correct?', o: ['She is a nurse.', 'She is nurse.', 'She nurse.', 'She is the nurse job.'], a: 0, why: 'Jobs need **a / an** in English.' },
      { t: 'mc', q: 'Which sentence is correct?', o: ['Children need love.', 'The children need the love.', 'A children need love.', 'Children need the love.'], a: 0, why: 'Talking in general: no **the**.' },
      { t: 'order', a: 'What did you eat for breakfast' },
      { t: 'dict', say: 'I didn\'t see her yesterday.' }
    ],
    L2U2: [
      { t: 'mc', q: 'I don\'t understand these directions. I\'m ___.', o: ['confused', 'grateful', 'proud', 'honest'], a: 0 },
      { t: 'mc', q: 'It takes ___ people to start a new life in a new country.', o: ['brave', 'nervous', 'confused', 'tired'], a: 0 },
      { t: 'mc', q: 'Could you ___ some milk on your way home?', o: ['pick up', 'give up', 'run out of', 'turn down'], a: 0 },
      { t: 'mc', q: 'My son is always asking questions. He is very ___.', o: ['curious', 'proud', 'grateful', 'brave'], a: 0 },
      { t: 'mc', q: 'The music is too loud. Please ___ it ___.', o: ['turn / down', 'give / up', 'look / for', 'find / out'], a: 0 },
      { t: 'mc', q: 'Our printer ___ paper again!', o: ['ran out of', 'got along with', 'looked for', 'took care of'], a: 0 },
      { t: 'fill', q: 'I am ___ for your help. Thank you! (thankful)', a: ['grateful'] },
      { t: 'fill', q: 'Can you find ___ what time the store opens? (learn the information)', a: ['out'] },
      { t: 'tf', q: '"I gave up smoking" means I stopped smoking.', a: true },
      { t: 'listen', say: 'She takes care of her mother.', o: ['She takes care of her mother.', 'She takes a car to her mother.', 'She takes her mother\'s car.', 'She takes cards to her mother.'], a: 0 }
    ],
    L2U3: [
      { t: 'mc', p: 0, q: 'How long is the Nile?', o: ['About 6,650 kilometers', 'About 665 kilometers', 'About 66 kilometers', 'About 66,500 kilometers'], a: 0 },
      { t: 'mc', p: 0, q: 'What did farmers grow in the rich soil?', o: ['Wheat, beans, and flax', 'Rice and corn', 'Apples and grapes', 'Cotton only'], a: 0 },
      { t: 'mc', p: 0, q: 'When did Egypt finish the Aswan High Dam?', o: ['1970', '1907', '1950', '2000'], a: 0 },
      { t: 'mc', p: 0, q: 'The word "However" in the last paragraph shows…', o: ['a contrast: a bad effect after good ones', 'an example', 'the time order', 'a reason'], a: 0 },
      { t: 'mc', p: 1, q: 'Where did Teta grow up?', o: ['In Asyut', 'In Cairo', 'In Alexandria', 'In America'], a: 0 },
      { t: 'mc', p: 1, q: 'What did Samia share with Teta?', o: ['Her bread', 'Her pencil', 'Her toys', 'Her book'], a: 0 },
      { t: 'mc', p: 1, q: 'Where did Teta put Nour\'s picture?', o: ['On her refrigerator', 'In her purse', 'On the wall at church', 'In a frame by her bed'], a: 0 },
      { t: 'mc', p: 1, q: 'What is the purpose of the letter?', o: ['To encourage Nour and share a memory', 'To ask for money', 'To complain about school', 'To give news about a trip'], a: 0 }
    ],
    L2U4: [
      { t: 'listen', say: 'thank', o: ['thank', 'tank'], a: 0 },
      { t: 'listen', say: 'then', o: ['then', 'zen'], a: 0 },
      { t: 'listen', say: 'tree', o: ['three', 'tree'], a: 1 },
      { t: 'mc', q: 'How many syllables does "needed" have?', o: ['Two: need-ed', 'One: needd', 'Three'], a: 0 },
      { t: 'mc', q: 'How many syllables does "cleaned" have?', o: ['One: cleand', 'Two: clean-ed', 'Three'], a: 0 },
      { t: 'mc', q: 'How does "washed" end?', o: ['/t/: washt', '/id/: wash-id', '/d/: washd'], a: 0 },
      { t: 'mc', q: 'Where is the stress in "banana"?', o: ['ba-NA-na', 'BA-na-na', 'ba-na-NA'], a: 0 },
      { t: 'mc', q: 'The TH in "mother" sounds like the Arabic letter…', o: ['ذ', 'ث', 'ز', 'د'], a: 0 },
      { t: 'say', text: 'This is my mother and that is my brother.' },
      { t: 'say', text: 'We wanted to visit, but we needed more time.' }
    ],
    L2T: [
      { t: 'mc', q: 'You don\'t know how to use the copy machine. You ask a coworker:', o: ['Could you show me how to use the copy machine?', 'Copy machine, how?', 'You do it for me.', 'Why is this machine so hard?'], a: 0 },
      { t: 'mc', q: 'You need to leave work early for a doctor\'s appointment. You ask:', o: ['Would it be okay if I left at three today? I have a doctor\'s appointment.', 'I leave at three.', 'Bye at three.', 'Doctor today, I go.'], a: 0 },
      { t: 'mc', q: 'A coworker helped you. You say:', o: ['Thanks so much for your help. I really appreciate it.', 'OK.', 'Finally.', 'That\'s your job.'], a: 0 },
      { t: 'mc', q: 'The coffee machine is broken. You tell your manager:', o: ['Just so you know, the coffee machine isn\'t working.', 'Coffee broken!', 'Fix the coffee.', 'Who broke it?'], a: 0 },
      { t: 'mc', q: '"Would you mind closing the door?" means:', o: ['Please close the door.', 'Do you hate the door?', 'Don\'t close the door.', 'Is the door closed?'], a: 0 },
      { t: 'fill', q: 'I\'m not feeling ___ today, so I can\'t come in. (healthy)', a: ['well', 'good'] },
      { t: 'order', a: 'Would you mind showing me how to do this' },
      { t: 'dict', say: 'I have a problem with my computer.' }
    ]
  };
  (window.SEKKA_LEVELS || []).forEach(L => L.units.forEach(u => {
    const extra = EXTRA[u.id];
    if (extra && !u._extra) { u.items = (u.items || []).concat(extra); u._extra = true; }
  }));
})();
