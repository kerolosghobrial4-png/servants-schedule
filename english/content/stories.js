/* Story library: short graded readings for daily extensive reading.
   Each story: id, lvl (1-6), title, text (paragraphs split by blank lines), qs (quick check questions). */
window.SEKKA_STORIES = [
  {
    id: 's1-job', lvl: 1, title: 'The First Day',
    text: 'Hana is nervous. Today is her first day at a new job. She works at a big grocery store. She puts on her new blue shirt and takes the bus.\n\nHer manager is a tall man named Carlos. He shows her the store. "This is the bakery," he says. "And this is the cash register. You will work here."\n\nAt lunch, a woman sits next to Hana. "Hi, I\'m Lucy," she says. "Are you new?" Hana smiles. "Yes, I am. I\'m Hana." They eat together and talk about their children.\n\nAt five o\'clock, Hana goes home. She is tired, but she is happy. She has a new job, and she has a new friend.',
    qs: [
      { t: 'mc', q: 'Where does Hana work?', o: ['At a grocery store', 'At a bank', 'At a school', 'At a hospital'], a: 0 },
      { t: 'mc', q: 'Who is Carlos?', o: ['Her manager', 'Her husband', 'A customer', 'Her son'], a: 0 },
      { t: 'mc', q: 'How does Hana feel at the end of the day?', o: ['Tired but happy', 'Angry', 'Sick', 'Bored'], a: 0 }
    ]
  },
  {
    id: 's1-pharmacy', lvl: 1, title: 'At the Pharmacy',
    text: 'Samira has a cold. She has a sore throat and a headache. She goes to the pharmacy near her house.\n\n"Good morning. Can I help you?" the pharmacist asks.\n\n"Yes, please. I have a cold. My throat hurts," Samira says.\n\nThe pharmacist gives her a small box. "Take one pill two times a day, with food. Drink a lot of water and rest."\n\n"How much is it?" Samira asks.\n\n"It\'s eight dollars."\n\nSamira pays and says, "Thank you very much." At home, she makes hot tea with honey and lemon, like her mother did in Egypt. The next day, she feels better.',
    qs: [
      { t: 'mc', q: 'What is wrong with Samira?', o: ['She has a cold.', 'She broke her arm.', 'She lost her job.', 'She is hungry.'], a: 0 },
      { t: 'mc', q: 'How often should she take the pill?', o: ['Two times a day', 'One time a week', 'Every hour', 'Only at night'], a: 0 },
      { t: 'mc', q: 'What does Samira drink at home?', o: ['Hot tea with honey and lemon', 'Coffee', 'Cold juice', 'Milk'], a: 0 }
    ]
  },
  {
    id: 's1-school', lvl: 1, title: 'A Call from School',
    text: 'Amal is at work when her phone rings. It is her son\'s school.\n\n"Hello, is this Mrs. Hassan?" a woman asks.\n\n"Yes, it is."\n\n"This is the school nurse. Your son Adam has a fever. Can you pick him up?"\n\nAmal is worried. She talks to her manager. "I\'m sorry, my son is sick. Can I leave early today?"\n\n"Of course," her manager says. "Family comes first. I hope he feels better."\n\nAmal drives to the school. Adam is in the nurse\'s office. He is sleepy, but he smiles when he sees his mother. At home, she gives him medicine and soup. That night, his fever goes down.',
    qs: [
      { t: 'mc', q: 'Who calls Amal?', o: ['The school nurse', 'Her husband', 'Her manager', 'A doctor'], a: 0 },
      { t: 'mc', q: 'What does Amal ask her manager?', o: ['To leave early', 'For more money', 'For a day off next week', 'To work late'], a: 0 },
      { t: 'tf', q: 'The manager says no.', a: false }
    ]
  },
  {
    id: 's1-market', lvl: 1, title: 'The Saturday Market',
    text: 'Every Saturday, Nadia goes to the farmers market with her husband. The market is in a big parking lot near the park.\n\nThere are many tables. People sell fruit, vegetables, bread, flowers, and honey. Nadia likes the tomatoes. They are red and sweet, like the tomatoes in her village in Egypt.\n\nShe buys tomatoes, cucumbers, and a big bag of green beans. Her husband buys fresh bread. The man at the bread table knows them. "Good morning! The usual?" he asks. Nadia laughs. "Yes, the usual, please."\n\nAt home, Nadia cooks green beans with tomato sauce. The whole family eats together.',
    qs: [
      { t: 'mc', q: 'When does Nadia go to the market?', o: ['Every Saturday', 'Every Monday', 'Every day', 'Once a month'], a: 0 },
      { t: 'mc', q: 'Why does Nadia like the tomatoes?', o: ['They are like the tomatoes in her village.', 'They are cheap.', 'Her husband grows them.', 'They are big.'], a: 0 },
      { t: 'mc', q: '"The usual?" means:', o: ['the same thing you always buy', 'something new', 'a small bag', 'a free gift'], a: 0 }
    ]
  },
  {
    id: 's2-bus', lvl: 2, title: 'The Wrong Bus',
    text: 'Last Tuesday, Mariam had an important appointment at the hospital. She left home early because she didn\'t want to be late. At the bus stop, a bus came quickly, and she got on without looking at the number.\n\nAfter fifteen minutes, she looked out the window. Nothing looked familiar. There were factories and empty fields. She started to panic.\n\nShe walked to the front and asked the driver, "Excuse me, does this bus go to Central Hospital?"\n\nThe driver shook his head. "No, ma\'am. You need the 42. Get off at the next stop and cross the street."\n\nMariam followed his directions. She arrived at the hospital ten minutes late, but the receptionist was kind. "Don\'t worry," she said. "The doctor is running late too."\n\nNow Mariam always checks the bus number twice.',
    qs: [
      { t: 'mc', q: 'Why did Mariam take the wrong bus?', o: ['She didn\'t look at the bus number.', 'The driver lied.', 'She was sleeping.', 'The bus was free.'], a: 0 },
      { t: 'mc', q: 'What did the driver tell her to do?', o: ['Get off and cross the street to take the 42', 'Stay on the bus', 'Call a taxi', 'Walk to the hospital'], a: 0 },
      { t: 'mc', q: 'What lesson did Mariam learn?', o: ['Always check the bus number', 'Never take the bus', 'Leave home late', 'Ask for a free ride'], a: 0 }
    ]
  },
  {
    id: 's2-drive', lvl: 2, title: 'Learning to Drive at Forty-Five',
    text: 'In Egypt, Laila never needed to drive. Her husband drove, and there were taxis and microbuses everywhere. But in her new town in America, the nearest supermarket was three miles away, and there was only one bus every hour.\n\n"I want to learn to drive," she told her daughter one evening. Her daughter was surprised. "Really, Mama? That\'s great!"\n\nThe first lessons were terrible. Laila pressed the brake too hard, and she was afraid of the highway. Once, she stopped in the middle of an intersection because she was confused. Other drivers honked at her, and she almost cried.\n\nBut she didn\'t give up. She practiced every Sunday in an empty parking lot. She studied the driver\'s manual at night, looking up every word she didn\'t know.\n\nSix months later, Laila passed her driving test on the first try. Now she drives to work, to the market, and to her friend\'s house. "I feel free," she says.',
    qs: [
      { t: 'mc', q: 'Why did Laila decide to learn to drive?', o: ['Stores were far away and buses were rare.', 'Her husband told her to.', 'She wanted a new car.', 'She lost her job.'], a: 0 },
      { t: 'mc', q: 'How did Laila feel during her first lessons?', o: ['Scared and frustrated', 'Calm and confident', 'Bored', 'Angry at her daughter'], a: 0 },
      { t: 'mc', q: 'What is the main message of the story?', o: ['It is never too late to learn something hard.', 'Driving is easy.', 'Buses are better than cars.', 'Parking lots are dangerous.'], a: 0 }
    ]
  },
  {
    id: 's2-customer', lvl: 2, title: 'The Angry Customer',
    text: 'Yasmin worked at the customer service desk of a department store. One afternoon, a man walked up to her desk with a box. His face was red.\n\n"This is the second time this coffee maker broke!" he shouted. "I want my money back!"\n\nYasmin\'s heart beat fast. She wanted to say, "It\'s not my fault!" Instead, she took a deep breath. "I\'m really sorry, sir. That sounds very frustrating. May I see your receipt?"\n\nThe man gave her the receipt. He was still angry, but he stopped shouting. Yasmin checked the computer. "You bought it three weeks ago, so I can give you a full refund or a new one."\n\n"A refund, please," he said. Then he paused. "Sorry I yelled. It\'s been a long day."\n\n"No problem," Yasmin smiled. "I hope the rest of your day is better."\n\nLater, her manager said, "I saw that. You handled it perfectly."',
    qs: [
      { t: 'mc', q: 'Why was the man angry?', o: ['His coffee maker broke again.', 'The store was closed.', 'Yasmin was rude.', 'He lost his receipt.'], a: 0 },
      { t: 'mc', q: 'What did Yasmin do first?', o: ['She took a deep breath and apologized.', 'She shouted back.', 'She called security.', 'She walked away.'], a: 0 },
      { t: 'mc', q: 'Why did her manager praise her?', o: ['She stayed calm and solved the problem.', 'She sold a lot.', 'She came early.', 'She fixed the coffee maker.'], a: 0 }
    ]
  },
  {
    id: 's3-night', lvl: 3, title: 'The Night Shift',
    text: 'For three years, Rania has worked the night shift at a hospital laundry. She starts at eleven at night and finishes at seven in the morning. When most people are sleeping, she is folding sheets, sorting towels, and loading huge washing machines.\n\nAt first, the schedule was very hard. She couldn\'t sleep during the day because of the noise outside and the sunlight in her bedroom. She was always tired, and she often felt lonely.\n\nOver time, she found solutions. She bought dark curtains and earplugs. She started eating a small, healthy meal before work instead of a big dinner. Most importantly, she made friends with the other night workers. There is Lupe, who brings homemade tamales, and Mr. Okafor, who tells funny stories about his grandchildren.\n\nRania has also used the quiet hours to improve her English. During her break, she listens to podcasts and writes new words in a small notebook. Last month, her supervisor asked her to train two new workers. "Your English has improved so much," he said. Rania felt proud. The night shift, she realized, had given her more than a paycheck.',
    qs: [
      { t: 'mc', q: 'What was one problem Rania had at first?', o: ['She couldn\'t sleep during the day.', 'She didn\'t like her coworkers.', 'She was paid too little.', 'The hospital was far.'], a: 0 },
      { t: 'mc', q: 'How did Rania use her breaks?', o: ['To improve her English', 'To sleep', 'To call her family', 'To watch TV'], a: 0 },
      { t: 'mc', q: '"The night shift had given her more than a paycheck" means:', o: ['She got friends and new skills, not only money.', 'She got a raise.', 'She wants to quit.', 'She works for free.'], a: 0, why: 'This is an **inference**: think about what she gained besides money.' }
    ]
  },
  {
    id: 's3-interview', lvl: 3, title: 'The Interview That Went Wrong',
    text: 'Hoda had prepared for her job interview for a week. She had practiced answers in the mirror and ironed her best blouse. But on the morning of the interview, everything seemed to go wrong.\n\nFirst, her alarm didn\'t ring. Then she spilled coffee on her blouse and had to change. When she finally arrived at the office, she was five minutes late and out of breath.\n\n"I\'m so sorry I\'m late," she said to the interviewer. "My morning has been a disaster." She expected him to be annoyed. Instead, he laughed. "We\'ve all had mornings like that. Take a minute and have some water."\n\nHoda relaxed. When he asked about her experience, she answered honestly and clearly. She talked about the clothing shop she had run in Alexandria for ten years and how she had managed money, staff, and difficult customers.\n\nA week later, she got a phone call. She had the job. Her new boss told her later, "Everyone is perfect in interviews. You were real. And you clearly knew how to run a business."',
    qs: [
      { t: 'mc', q: 'Why was Hoda late?', o: ['Her alarm didn\'t ring and she spilled coffee.', 'Her bus broke down.', 'She forgot the address.', 'She was sick.'], a: 0 },
      { t: 'mc', q: 'How did the interviewer react?', o: ['He was kind and understanding.', 'He was angry.', 'He ended the interview.', 'He didn\'t notice.'], a: 0 },
      { t: 'mc', q: 'Why did Hoda get the job?', o: ['She was honest and had strong business experience.', 'She was early.', 'She had a perfect blouse.', 'Her friend worked there.'], a: 0 }
    ]
  },
  {
    id: 's3-garden', lvl: 3, title: 'The Community Garden',
    text: 'When the empty lot on Maple Street filled with trash, most neighbors complained but did nothing. Fatima, a retired teacher from Cairo, decided to act.\n\nShe wrote a short letter to the city council asking for permission to turn the lot into a community garden. Her English wasn\'t perfect, so her grandson helped her check the grammar. To her surprise, the council agreed, as long as the neighbors took care of it.\n\nOn the first Saturday, only four people came. They picked up trash for six hours. The next week, twelve people came. Someone donated wood for garden boxes, and a hardware store gave them free seeds.\n\nBy summer, the lot was full of tomatoes, peppers, mint, and sunflowers. Neighbors who had lived on the same street for years without speaking now met every weekend. They shared vegetables, recipes, and stories.\n\n"I didn\'t just want a garden," Fatima said at the harvest party. "I wanted a neighborhood." Everyone clapped.',
    qs: [
      { t: 'mc', q: 'What was the problem at the beginning?', o: ['An empty lot was full of trash.', 'There were no stores.', 'The neighbors were too loud.', 'Fatima lost her job.'], a: 0 },
      { t: 'mc', q: 'What did the garden change, besides growing food?', o: ['Neighbors started talking and sharing.', 'House prices went down.', 'The street closed.', 'Fatima moved away.'], a: 0 },
      { t: 'mc', q: 'What does "I wanted a neighborhood" suggest?', o: ['Her real goal was to bring people together.', 'She wanted to buy houses.', 'She wanted a bigger garden.', 'She wanted to move.'], a: 0 }
    ]
  },
  {
    id: 's4-promotion', lvl: 4, title: 'The Promotion',
    text: 'When the position of shift supervisor opened at the warehouse, Dina hesitated. She had worked there for four years and knew every process, but she worried that her accent would make the other workers take her less seriously. Two coworkers who had been there longer had already applied.\n\nHer friend Grace, who worked in the office, encouraged her. "You\'re the person everyone asks when something goes wrong," she said. "That is what a supervisor does."\n\nDina applied. In the interview, the manager asked how she would handle a worker who was repeatedly late. Dina thought for a moment. "First, I would talk to them privately and ask if something is going on. Sometimes there is a reason, like childcare or transportation. If there is no improvement, I would explain the consequences clearly and follow the company policy."\n\nThe manager nodded slowly. "That\'s a thoughtful answer."\n\nDina got the promotion. Her first month was difficult. One worker ignored her instructions, and she had to have an uncomfortable conversation with him. But by the end of the year, her shift had the lowest error rate in the warehouse. Her accent, she realized, had never been the problem. Her confidence had been.',
    qs: [
      { t: 'mc', q: 'Why did Dina hesitate to apply?', o: ['She worried her accent would hurt her authority.', 'She didn\'t want more money.', 'She was planning to quit.', 'She didn\'t know the work.'], a: 0 },
      { t: 'mc', q: 'Why did the manager like Dina\'s answer?', o: ['It was fair and practical: understanding first, then clear consequences.', 'It was very short.', 'It promised to fire people.', 'It avoided the question.'], a: 0 },
      { t: 'mc', q: 'What is the main idea of the last sentence?', o: ['Lack of confidence held her back more than her accent.', 'Her accent was a serious problem.', 'Confidence is not important.', 'She lost her confidence.'], a: 0 }
    ]
  },
  {
    id: 's4-college', lvl: 4, title: 'Back to School',
    text: 'Abeer was forty-three when she sat in a college classroom for the first time in twenty years. She chose a seat in the back and looked around nervously. Most of the students were young enough to be her children.\n\nThe class was English Composition. On the first day, the professor asked everyone to write a paragraph about a challenge they had overcome. While the younger students typed quickly on their laptops, Abeer wrote slowly by hand. She wrote about leaving Egypt with two small children and building a new life without knowing the language.\n\nThe next week, the professor returned the paragraphs. Abeer\'s had several grammar corrections, but at the bottom, the professor had written: "This is powerful writing. Please come to my office hours."\n\nAbeer was afraid she was in trouble. Instead, the professor told her about the campus writing center, where tutors could help with grammar, and encouraged her to keep writing about her experiences. "Grammar can be fixed," she said. "What you have to say cannot be taught."\n\nAbeer finished the class with a B+. It was the proudest grade of her life.',
    qs: [
      { t: 'mc', q: 'How did Abeer feel on the first day?', o: ['Nervous and out of place', 'Bored', 'Very confident', 'Angry'], a: 0 },
      { t: 'mc', q: 'What did the professor mean: "Grammar can be fixed. What you have to say cannot be taught"?', o: ['Her ideas and experiences were valuable, and grammar is easier to improve.', 'Her grammar was perfect.', 'She should stop writing.', 'Grammar is not important in college.'], a: 0 },
      { t: 'mc', q: 'What college resource did the professor recommend?', o: ['The writing center', 'The library café', 'The gym', 'The bookstore'], a: 0 }
    ]
  },
  {
    id: 's5-feedback', lvl: 5, title: 'The Hardest Feedback',
    text: 'Three months into her new role as an administrative coordinator, Mervat received an email from her director asking to meet on Friday. She spent two days imagining the worst. By Friday morning, she had convinced herself she was about to be fired.\n\nThe meeting turned out to be a mid-probation review. Her director began with praise: Mervat\'s scheduling had reduced double-booked meetings, and two department heads had specifically mentioned how reliable she was. Then the director paused. "There\'s one area I\'d like you to work on. Your emails are sometimes too brief. People occasionally read them as abrupt."\n\nMervat felt a familiar sting. In Arabic, she had always written warmly and at length; in English, she kept her messages short because she was afraid of making mistakes. The brevity that protected her from errors was being interpreted as coldness.\n\nInstead of defending herself, she asked for an example. Her director showed her a one-line reply: "Not possible. Try Tuesday." Seeing it through someone else\'s eyes, Mervat understood immediately.\n\nOver the following weeks, she built a small collection of phrases that softened her messages without making them longer than necessary: "Unfortunately, that time doesn\'t work. Would Tuesday be possible instead?" Her colleagues noticed. At her six-month review, the comment about tone had disappeared entirely, replaced by a note that she communicated "clearly and professionally."\n\nLooking back, Mervat realized that the feedback she had dreaded was the most useful she had ever received, precisely because it addressed something no grammar book had taught her.',
    qs: [
      { t: 'mc', q: 'Why were Mervat\'s emails so short?', o: ['She was afraid of making mistakes in English.', 'She was too busy.', 'Her director asked for short emails.', 'She disliked her colleagues.'], a: 0 },
      { t: 'mc', q: 'How did Mervat respond to the criticism?', o: ['She asked for an example instead of defending herself.', 'She argued with her director.', 'She started looking for a new job.', 'She ignored it.'], a: 0 },
      { t: 'mc', q: 'The phrase "precisely because it addressed something no grammar book had taught her" suggests that:', o: ['professional tone and politeness are skills beyond grammar.', 'grammar books are useless.', 'her grammar was the main problem.', 'she should stop reading grammar books.'], a: 0 }
    ]
  },
  {
    id: 's5-study', lvl: 5, title: 'How to Study When You Have No Time',
    text: 'Adult students rarely have the luxury of long, quiet study sessions. Between jobs, children, and households, most find themselves studying in fragments: ten minutes on a bus, twenty minutes after the children are asleep. Many assume this is a disadvantage. Research on learning suggests the opposite may be true.\n\nOne of the most reliable findings in cognitive psychology is the spacing effect: information studied in several short sessions spread over days is remembered far better than the same information studied in one long session. A student who reviews vocabulary for fifteen minutes on four different days will usually outperform one who studies for an hour the night before a test.\n\nA second finding, sometimes called the testing effect, is equally useful. Rereading notes feels productive, but it produces weak memories. Trying to recall information, by answering practice questions or explaining a concept aloud without looking, strengthens memory much more, even when the attempt fails.\n\nTaken together, these findings offer encouraging news for busy adults. The fragmented schedule that seems like an obstacle is well suited to spaced practice, and the most effective technique, testing oneself, requires no special equipment or long blocks of time. What matters is not how long a student studies, but how often, and how actively.',
    qs: [
      { t: 'mc', q: 'What is the "spacing effect"?', o: ['Short study sessions spread over days are remembered better than one long session.', 'Students need a large space to study.', 'Studying the night before a test is best.', 'Long breaks hurt memory.'], a: 0 },
      { t: 'mc', q: 'According to the passage, which is the weakest way to study?', o: ['Rereading notes', 'Answering practice questions', 'Explaining a concept aloud', 'Reviewing on different days'], a: 0 },
      { t: 'mc', q: 'The author\'s main point is that:', o: ['busy adults can study effectively in short, active sessions.', 'adults cannot succeed in college.', 'long study sessions are necessary.', 'testing is stressful and should be avoided.'], a: 0 }
    ]
  },
  {
    id: 's6-remote', lvl: 6, title: 'The Myth of the Native Speaker',
    text: 'In many workplaces, "native-like" English is treated as the gold standard of professional communication. Job postings request "native fluency," and employees with accents sometimes report being passed over for client-facing roles. Yet linguists have long questioned whether the native speaker is a meaningful benchmark at all.\n\nConsider the actual conditions of international business. The majority of English conversations worldwide now take place between non-native speakers: a Brazilian engineer negotiating with a Korean supplier, an Egyptian accountant presenting to a German auditor. In these exchanges, research on what is sometimes called "English as a lingua franca" has found that communication breaks down less often because of accents or minor grammatical errors than because of idioms, rapid speech, and culturally specific references. Ironically, native speakers, who tend to rely on exactly these features, are frequently the hardest to understand.\n\nNone of this means that accuracy is unimportant. A misplaced word in a contract or a confusing email can have real consequences. But the evidence suggests that the most effective professional communicators are not those who sound most native, but those who adapt: who speak clearly, check understanding, avoid unnecessary idioms, and adjust to their listener.\n\nIf that is the case, the goal for adult learners should not be to erase every trace of their first language. It should be intelligibility and adaptability, skills that many multilingual professionals already possess in greater measure than their monolingual colleagues.',
    qs: [
      { t: 'mc', q: 'The author\'s central claim is that:', o: ['clear, adaptable communication matters more than sounding native.', 'accents should be eliminated.', 'native speakers are the best communicators.', 'grammar does not matter at work.'], a: 0 },
      { t: 'mc', q: 'Why does the author call it "ironic" that native speakers are often hard to understand?', o: ['Because they are considered the standard, yet they use idioms and fast speech that cause confusion.', 'Because they speak too slowly.', 'Because they have strong accents.', 'Because they avoid idioms.'], a: 0 },
      { t: 'mc', q: 'The third paragraph ("None of this means…") functions mainly to:', o: ['acknowledge that accuracy still matters, limiting the argument', 'introduce a completely new topic', 'reject the author\'s own thesis', 'give a personal story'], a: 0 }
    ]
  }
];
