/* "Talk at Work" — one conversation unit per level, inserted as the 2nd unit of each level.
   Also adds "After this level you can…" goals. Loaded after level files, before app.js. */
(function () {
  const CANDO = {
    L1: 'Introduce yourself at work, make small talk, and ask people to repeat or explain.',
    L2: 'Ask for help, explain a simple problem, and call in late or sick.',
    L3: 'Understand instructions, check that you understood, and handle phone calls and messages.',
    L4: 'Give your opinion in a meeting, agree and disagree politely, and follow longer texts. Ready for community college ESL or developmental English.',
    L5: 'Write professional emails, give and receive feedback, and read college textbooks. Ready for college English 101.'
  };

  const TALK = {
    L1: {
      id: 'L1T', kind: 'conversation', title: 'Hello at Work: Introductions and Small Talk', ar: 'التعارف والكلام الخفيف في الشغل',
      lesson: [
        { p: 'At work, the first conversations are short and friendly. Learn these phrases as **whole chunks**. Native speakers don\'t build them word by word; they say them as one piece.' },
        { h: 'Introducing yourself' },
        { ex: ['Hi, I\'m Mona. I just started this week.', 'Nice to meet you.', 'Nice to meet you too.', 'I work in the front office.'] },
        { h: 'Small talk' },
        { ex: ['How are you today? I\'m good, thanks. And you?', 'How was your weekend? It was nice, thanks.', 'It\'s so cold today!', 'Have a good day! You too.'] },
        { h: 'When you don\'t understand' },
        { p: 'This is the most important part. Everyone, even native speakers, asks people to repeat. It is polite and normal.' },
        { ex: ['Sorry, could you say that again, please?', 'Could you speak a little more slowly, please?', 'What does "deadline" mean?', 'How do you spell that?'] },
        { ar: 'متتكسفيش تقولي «Could you say that again, please?». الأمريكان نفسهم بيقولوها طول الوقت. أحسن بكتير من إنك تهزّي راسك وانتي مش فاهمة.' },
        { h: 'Culture tip' },
        { p: 'Good small talk topics: the weather, the weekend, food, holidays, sports. Topics to **avoid** with new coworkers: salary, age, weight, religion, and politics.' },
        { ar: 'في الشغل هنا مبنسألش عن المرتب أو السن أو الوزن أو الدين. اتكلمي عن الجو، الويك إند، الأكل، والأجازات.' }
      ],
      dialogue: {
        title: 'First day at work', roles: { A: 'Coworker (Jen)', B: 'You' }, me: 'B',
        lines: [
          ['A', 'Hi! Are you new here?'],
          ['B', 'Yes, I am. I just started today. I\'m Mona.'],
          ['A', 'Nice to meet you, Mona. I\'m Jen. I work in billing.'],
          ['B', 'Nice to meet you too, Jen.'],
          ['A', 'Do you know where the break room is?'],
          ['B', 'Sorry, could you say that again, please?'],
          ['A', 'Sure. The break room. It\'s where we eat lunch. It\'s down the hall on the left.'],
          ['B', 'Oh, thank you! That\'s very helpful.'],
          ['A', 'No problem. Have a great first day!'],
          ['B', 'Thanks, you too!']
        ]
      },
      roleplays: [
        { title: 'Meet a new coworker', setup: 'It is my first day at a new job. You are a friendly coworker named Jen who meets me in the break room.', role: 'Jen, a friendly coworker', goal: 'Introduce myself, make small talk about the weekend or weather, and ask you to repeat once.' },
        { title: 'Monday morning small talk', setup: 'It is Monday morning. We work together and meet at the coffee machine.', role: 'a coworker', goal: 'Ask about your weekend, answer your questions about mine, and end the conversation politely.' }
      ],
      speak: ['Hi, I\'m Mona. I just started this week.', 'Sorry, could you say that again, please?', 'Could you speak a little more slowly, please?', 'How was your weekend?', 'Have a good day!'],
      items: [
        { t: 'mc', q: 'A coworker says, "Nice to meet you." You answer:', o: ['Nice to meet you too.', 'Yes, I am.', 'I\'m fine.', 'You\'re welcome.'], a: 0 },
        { t: 'mc', q: 'You did not hear what your manager said. What is the best thing to say?', o: ['Sorry, could you say that again, please?', 'What?!', 'Repeat.', '(Nod and smile.)'], a: 0, why: 'Asking politely is normal and professional. Nodding when you don\'t understand can cause mistakes later.' },
        { t: 'mc', q: '"How was your weekend?" The best answer is:', o: ['It was nice, thanks. I visited my sister. How about you?', 'Yes.', 'I am weekend.', 'Fine, fine, fine.'], a: 0, why: 'A good answer: a short reply, one detail, and a question back.' },
        { t: 'mc', q: 'Which question is **not** good small talk with a new coworker?', o: ['How much money do you make?', 'How was your weekend?', 'Did you see the game last night?', 'Do you have any plans for the holiday?'], a: 0 },
        { t: 'mc', q: 'Someone uses a word you don\'t know: "deadline." You say:', o: ['What does "deadline" mean?', 'I don\'t know nothing.', 'Deadline is what?', 'Say again deadline.'], a: 0 },
        { t: 'mc', q: '"Have a great day!" You answer:', o: ['Thanks, you too!', 'Yes, I have.', 'Me too!', 'OK.'], a: 0 },
        { t: 'mc', q: 'A coworker is talking very fast. You say:', o: ['Could you speak a little more slowly, please?', 'Slow!', 'You talk bad.', 'Stop.'], a: 0 },
        { t: 'order', a: 'Could you say that again please', why: 'A polite request starts with **Could you**.' },
        { t: 'order', a: 'I just started this week' },
        { t: 'listen', say: 'Do you know where the break room is?', o: ['Do you know where the break room is?', 'Do you know where the bathroom is?', 'Did you break the room?', 'Do you know the bedroom?'], a: 0 },
        { t: 'dict', say: 'Nice to meet you.' },
        { t: 'say', text: 'Sorry, could you say that again, please?' }
      ]
    },

    L2: {
      id: 'L2T', kind: 'conversation', title: 'Asking for Help and Explaining Problems', ar: 'نطلب مساعدة ونشرح مشكلة',
      lesson: [
        { h: 'Asking for help politely' },
        { p: 'In English, requests at work are softened with **could**, **please**, and **would you mind**. Without them, you can sound rude even when you don\'t mean to.' },
        { table: [['Too direct', 'Polite'], ['Give me the file.', 'Could you give me the file, please?'], ['Help me.', 'Could you help me with something?'], ['I want a day off.', 'Would it be possible to take Friday off?'], ['Show me.', 'Would you mind showing me how to do this?']] },
        { ar: 'في العربي ممكن نقول «هاتلي الملف» ونبقى مؤدبين جداً بالنبرة. في الإنجليزي لازم كلمات زي **Could you… please?** وإلا الكلام هيبان قليل الذوق.' },
        { h: 'Explaining a problem' },
        { ex: ['I have a problem with my computer. It won\'t turn on.', 'The printer isn\'t working.', 'I\'m sorry, I made a mistake on the order.', 'I don\'t understand how to use this system.'] },
        { h: 'Calling in late or sick' },
        { ex: ['Hi, this is Mona. I\'m sorry, but I\'m running about twenty minutes late.', 'I\'m not feeling well today, so I won\'t be able to come in.', 'I\'ll let you know if anything changes.'] },
        { tip: 'Always give the **reason**, the **time**, and a **plan**: "I\'m sick (reason). I can\'t come today (time). I\'ll check my email in the afternoon (plan)."' }
      ],
      dialogue: {
        title: 'Calling the manager', roles: { A: 'Manager (Mr. Davis)', B: 'You' }, me: 'B',
        lines: [
          ['A', 'Hello, this is Mike Davis.'],
          ['B', 'Hi, Mr. Davis. This is Mona. I\'m sorry, but I\'m running late this morning.'],
          ['A', 'Oh, okay. What happened?'],
          ['B', 'My bus broke down. I\'m waiting for the next one.'],
          ['A', 'I see. What time do you think you\'ll get here?'],
          ['B', 'I think I\'ll be there around nine thirty.'],
          ['A', 'That\'s fine. Thanks for letting me know.'],
          ['B', 'Could you please tell Sarah I\'ll be late for our meeting?'],
          ['A', 'Sure, no problem.'],
          ['B', 'Thank you. See you soon.']
        ]
      },
      roleplays: [
        { title: 'Call in late', setup: 'You are my manager. I am calling you because my bus is late and I will be 30 minutes late to work.', role: 'my manager, Mr. Davis', goal: 'Explain the problem, say when I will arrive, and ask you to tell a coworker.' },
        { title: 'Ask for help with a task', setup: 'We work together. I don\'t understand how to use the new computer system to enter orders.', role: 'a helpful coworker', goal: 'Ask for help politely, explain what I don\'t understand, and check the steps.' }
      ],
      speak: ['Could you help me with something, please?', 'The printer isn\'t working.', 'I\'m sorry, but I\'m running about twenty minutes late.', 'Would you mind showing me how to do this?', 'Thanks for letting me know.'],
      items: [
        { t: 'mc', q: 'Which request is the most polite?', o: ['Could you show me how to use this, please?', 'Show me this.', 'You show me.', 'I want you show me.'], a: 0 },
        { t: 'mc', q: 'Which is most polite for asking for a day off?', o: ['Would it be possible to take Friday off?', 'I take Friday off.', 'Give me Friday.', 'Friday, no work for me.'], a: 0 },
        { t: 'mc', q: 'Your computer won\'t start. You tell IT:', o: ['Hi, I have a problem with my computer. It won\'t turn on.', 'Computer broken. Fix.', 'Why is your computer bad?', 'I break it.'], a: 0 },
        { t: 'mc', q: 'You are sick. What is the best message to your manager?', o: ['I\'m not feeling well today, so I won\'t be able to come in. I\'ll check email this afternoon.', 'Sick. No work.', 'I don\'t want to come today.', 'Maybe I come, maybe no.'], a: 0, why: 'A good message has a reason, the time, and a plan.' },
        { t: 'mc', q: '"Would you mind helping me?" If you are happy to help, you say:', o: ['Not at all. What do you need?', 'Yes, I mind.', 'Yes, I would mind.', 'Mind is good.'], a: 0, why: 'Careful! "Would you mind…?" means "Is it a problem for you?" So **No / Not at all** means "Yes, I\'ll help."' },
        { t: 'mc', q: 'You made a mistake on an order. You say:', o: ['I\'m sorry, I made a mistake on the order. I\'ll fix it now.', 'It\'s not my fault.', 'The order is wrong, whatever.', 'Mistake happen.'], a: 0 },
        { t: 'fill', q: 'I\'m sorry, but I\'m ___ late. (two words: running…)', a: ['running late', 'running'] },
        { t: 'order', a: 'Could you help me with something please' },
        { t: 'order', a: 'Thanks for letting me know' },
        { t: 'listen', say: 'What time do you think you\'ll get here?', o: ['What time do you think you\'ll get here?', 'What time do you think you\'ll eat here?', 'What do you think about here?', 'What time is it here?'], a: 0 },
        { t: 'tf', q: '"Would you mind…?" Answering "No, not at all" means you will NOT help.', a: false, why: 'It means you **will** help: "It\'s no problem for me."' },
        { t: 'say', text: 'Could you help me with something, please?' }
      ]
    },

    L3: {
      id: 'L3T', kind: 'conversation', title: 'Instructions, Phone Calls, and Checking Understanding', ar: 'التعليمات والتليفون والتأكد إننا فاهمين',
      lesson: [
        { p: 'The biggest problems at work come from misunderstood instructions. Strong English speakers **check** before they act.' },
        { h: 'Checking instructions' },
        { ex: ['So, you want me to send the report by Friday, right?', 'Just to make sure I understand: first I call the client, then I email you?', 'Do you mean the blue form or the white form?', 'Should I do this before or after lunch?'] },
        { ar: 'بعد ما المدير يديكي تعليمات، كرريها بكلامك: «So, you want me to…, right?». كده بتتأكدي إنك فاهمة، وهو بيشوفك دقيقة وبتهتمي.' },
        { h: 'On the phone' },
        { ex: ['Good morning, Riverside Clinic, Mona speaking. How can I help you?', 'May I ask who\'s calling?', 'One moment, please. I\'ll transfer you.', 'She\'s not available right now. Can I take a message?', 'Could you spell your last name, please?', 'Let me read that back to you: 555-0142. Is that correct?'] },
        { h: 'Numbers and letters' },
        { p: 'On the phone, letters are easy to confuse: B/P/D/E, M/N, F/S. Use words: "**B as in boy**, **P as in Peter**, **M as in Mary**, **N as in Nancy**."' },
        { tip: 'Phone calls are harder than face-to-face because you can\'t see lips or gestures. It\'s okay to ask the caller to repeat or spell.' }
      ],
      dialogue: {
        title: 'Taking a message', roles: { A: 'Caller (Mr. Patel)', B: 'You' }, me: 'B',
        lines: [
          ['B', 'Good morning, Riverside Office, Mona speaking. How can I help you?'],
          ['A', 'Hi, I\'d like to speak with Karen Lopez, please.'],
          ['B', 'May I ask who\'s calling?'],
          ['A', 'This is Raj Patel from Northside Supplies.'],
          ['B', 'Thank you, Mr. Patel. I\'m sorry, Karen isn\'t available right now. Can I take a message?'],
          ['A', 'Yes, please ask her to call me back about the delivery.'],
          ['B', 'Of course. Could you spell your last name, please?'],
          ['A', 'Sure. P as in Peter, A, T, E, L.'],
          ['B', 'And what\'s the best number to reach you?'],
          ['A', 'It\'s 555-0142.'],
          ['B', 'Let me read that back: Raj Patel, 555-0142, about the delivery. Is that correct?'],
          ['A', 'That\'s right. Thank you very much.'],
          ['B', 'You\'re welcome. Have a good day.']
        ]
      },
      roleplays: [
        { title: 'Take a phone message', setup: 'I answer the phone at my workplace. You are a customer calling for my manager, who is not available. Give me your name, phone number, and a reason. Spell your name if I ask.', role: 'a customer on the phone', goal: 'Answer professionally, take a full message, spell the name, and read the number back.' },
        { title: 'Get instructions from my manager', setup: 'You are my manager. Give me three instructions for a task (with a deadline). Speak naturally, not too slowly.', role: 'my manager', goal: 'Listen, ask at least one clarifying question, and repeat the instructions back to confirm.' }
      ],
      speak: ['So, you want me to send the report by Friday, right?', 'Just to make sure I understand, first I call the client, then I email you?', 'She\'s not available right now. Can I take a message?', 'Could you spell your last name, please?', 'Let me read that back to you.'],
      items: [
        { t: 'mc', q: 'Your manager gives you instructions. What is the best way to check you understood?', o: ['So, you want me to finish the list by 3:00, right?', 'OK.', 'Yes, yes.', 'I understand everything.'], a: 0 },
        { t: 'mc', q: 'How do you answer the phone at work?', o: ['Good morning, Riverside Office, Mona speaking. How can I help you?', 'Hello? Who is this?', 'Yes?', 'What do you want?'], a: 0 },
        { t: 'mc', q: 'The caller wants your manager, but she is in a meeting. You say:', o: ['She\'s not available right now. Can I take a message?', 'She is busy, call later, bye.', 'No.', 'She doesn\'t want to talk.'], a: 0 },
        { t: 'mc', q: 'You want to know the caller\'s name politely. You say:', o: ['May I ask who\'s calling?', 'Who are you?', 'Your name what?', 'Tell me your name.'], a: 0 },
        { t: 'mc', q: 'Why should you "read back" a phone number?', o: ['To make sure you wrote it correctly', 'To practice numbers', 'Because it is the law', 'To end the call faster'], a: 0 },
        { t: 'mc', q: 'On the phone, the caller says "M." You want to be sure. You say:', o: ['M as in Mary?', 'What letter?', 'N?', 'Again.'], a: 0 },
        { t: 'mc', q: 'Your manager says, "Put these in the file." You\'re not sure which file. You say:', o: ['Do you mean the blue file or the green file?', 'Which?', 'OK.', 'I don\'t know file.'], a: 0 },
        { t: 'fill', q: 'One ___, please. I\'ll transfer you. (wait a short time)', a: ['moment'] },
        { t: 'order', a: 'Just to make sure I understand' },
        { t: 'listen', say: 'Could you spell your last name, please?', o: ['Could you spell your last name, please?', 'Could you tell your last name, please?', 'Could you spend your last day, please?', 'Could you sell your last name?'], a: 0 },
        { t: 'dict', say: 'Can I take a message?' },
        { t: 'say', text: 'So, you want me to send the report by Friday, right?' }
      ]
    },

    L4: {
      id: 'L4T', kind: 'conversation', title: 'Meetings: Opinions, Agreeing, and Disagreeing', ar: 'الاجتماعات: الرأي والاتفاق والاختلاف',
      lesson: [
        { p: 'In American workplaces, people are expected to **share ideas in meetings**, even new employees. Disagreeing is normal, but it must be **polite and indirect**.' },
        { h: 'Giving your opinion' },
        { ex: ['In my opinion, we should start earlier.', 'I think it might be better to call the customers first.', 'From my experience, customers prefer email.'] },
        { h: 'Agreeing' },
        { ex: ['I completely agree.', 'That\'s a great point.', 'I was thinking the same thing.'] },
        { h: 'Disagreeing politely' },
        { table: [['Too direct', 'Polite'], ['No, that\'s wrong.', 'I see your point, but I\'m not sure that will work.'], ['That\'s a bad idea.', 'That\'s an interesting idea. Have we thought about the cost?'], ['You don\'t understand.', 'Maybe I didn\'t explain it clearly. What I mean is…']] },
        { ar: 'في الاجتماعات هنا الاختلاف عادي جداً، بس بطريقة ناعمة: ابدئي بحاجة إيجابية «I see your point» وبعدين «but…». ومتستنيش لحد ما حد يسألك. قولي «Could I add something?»' },
        { h: 'Joining the conversation' },
        { ex: ['Could I add something?', 'Sorry to interrupt, but I have a quick question.', 'Going back to what Sam said…', 'Can I just check that we agree on the next steps?'] },
        { tip: 'Prepare one idea before the meeting. Write the first sentence on paper. Saying one good point is better than staying quiet.' }
      ],
      dialogue: {
        title: 'Team meeting', roles: { A: 'Team leader (Sam)', B: 'You' }, me: 'B',
        lines: [
          ['A', 'Okay, everyone. Customers are waiting too long on the phone. Any ideas?'],
          ['B', 'Could I add something?'],
          ['A', 'Of course, Mona. Go ahead.'],
          ['B', 'In my opinion, we could send a text message when the wait is longer than ten minutes.'],
          ['A', 'That\'s interesting. But wouldn\'t that be expensive?'],
          ['B', 'I see your point, but many systems include texting for free. I can check ours.'],
          ['A', 'Good idea. Can you look into it this week?'],
          ['B', 'Sure. Just to confirm, you want me to check the cost and report back on Friday?'],
          ['A', 'Exactly. Thanks, Mona.']
        ]
      },
      roleplays: [
        { title: 'Share an idea in a meeting', setup: 'We are in a team meeting at my job. You are the team leader. Present a problem at work and ask the team for ideas. When I give an idea, politely challenge it once.', role: 'the team leader', goal: 'Join the conversation, give my opinion with a reason, and disagree politely when you challenge me.' },
        { title: 'Disagree with a coworker', setup: 'You are a coworker who wants to change our schedule so we all start at 6 a.m. I disagree.', role: 'a coworker with a strong opinion', goal: 'Disagree politely, explain my reason, and suggest a compromise.' }
      ],
      speak: ['Could I add something?', 'In my opinion, we should call the customers first.', 'I see your point, but I\'m not sure that will work.', 'That\'s a great point. I completely agree.', 'Sorry to interrupt, but I have a quick question.'],
      items: [
        { t: 'mc', q: 'You want to speak in a meeting. You say:', o: ['Could I add something?', 'Stop, I talk now.', 'Listen to me!', '(Wait until the meeting ends.)'], a: 0 },
        { t: 'mc', q: 'Which is the most polite way to disagree?', o: ['I see your point, but I\'m not sure that will work.', 'That\'s wrong.', 'Bad idea.', 'You don\'t know.'], a: 0 },
        { t: 'mc', q: 'A coworker suggests something you like. You say:', o: ['That\'s a great point.', 'Okay, whatever.', 'Maybe.', 'Fine, fine.'], a: 0 },
        { t: 'mc', q: 'Someone misunderstood you. You say:', o: ['Maybe I didn\'t explain it clearly. What I mean is…', 'You don\'t understand.', 'Listen better.', 'I said it already.'], a: 0, why: 'Take the blame for the confusion. It keeps the conversation friendly.' },
        { t: 'mc', q: 'Which sentence gives an opinion with a reason?', o: ['I think we should use email, because customers answer it faster.', 'Email.', 'I like email.', 'Email is email.'], a: 0 },
        { t: 'mc', q: 'You need to interrupt your manager quickly. You say:', o: ['Sorry to interrupt, but I have a quick question.', 'Hey!', 'Wait wait wait.', 'Excuse, question.'], a: 0 },
        { t: 'mc', q: '"Have we thought about the cost?" This sentence is a polite way to…', o: ['raise a concern or disagree', 'agree completely', 'say goodbye', 'ask for a raise'], a: 0 },
        { t: 'tf', q: 'In American meetings, it is usually fine for new employees to share ideas.', a: true },
        { t: 'order', a: 'I see your point but I have a different idea' },
        { t: 'listen', say: 'I was thinking the same thing.', o: ['I was thinking the same thing.', 'I was sinking the same ship.', 'I was thinking of something.', 'I was the same thing.'], a: 0 },
        { t: 'say', text: 'I see your point, but I\'m not sure that will work.' }
      ]
    },

    L5: {
      id: 'L5T', kind: 'conversation', title: 'Professional Communication: Emails, Feedback, and Requests', ar: 'التواصل المهني: الإيميلات والتقييم والطلبات',
      lesson: [
        { h: 'A professional email' },
        { table: [['Part', 'Example'], ['Subject', 'Request: schedule change for fall semester'], ['Greeting', 'Hi Ms. Carter, / Dear Ms. Carter,'], ['Purpose first', 'I\'m writing to ask about changing my schedule.'], ['Details', 'I\'m starting evening classes at the community college on Tuesdays and Thursdays.'], ['Clear request', 'Would it be possible to work 7 a.m. to 3 p.m. on those days?'], ['Polite close', 'Thank you for considering this. Please let me know if you have any questions.'], ['Sign-off', 'Best regards, Mona']] },
        { ar: 'الإيميل في الشغل: ادخلي في الموضوع على طول من أول سطر. متكتبيش مقدمة طويلة. وخليه قصير وواضح.' },
        { h: 'Receiving feedback' },
        { ex: ['Thank you for the feedback. That\'s helpful.', 'Could you give me an example so I understand better?', 'I\'ll work on that. Can we check in again next month?'] },
        { h: 'Asking for something important' },
        { p: 'For big requests (schedule, raise, training), use the pattern: **context → request → benefit for them → flexibility**.' },
        { ex: ['I\'ve been here two years, and I\'ve taken on more responsibility. (context)', 'I\'d like to talk about a raise. (request)', 'I\'ve trained three new employees, which saved the team time. (benefit)', 'I\'m open to discussing what\'s possible. (flexibility)'] },
        { tip: 'Strong verbs for your work: **managed, trained, organized, improved, solved, handled**. Use them in reviews and interviews.' }
      ],
      dialogue: {
        title: 'Asking for a schedule change', roles: { A: 'Supervisor (Ms. Carter)', B: 'You' }, me: 'B',
        lines: [
          ['B', 'Hi, Ms. Carter. Do you have a few minutes to talk?'],
          ['A', 'Sure, Mona. What\'s on your mind?'],
          ['B', 'I\'ve decided to start college classes in the evening this fall.'],
          ['A', 'That\'s wonderful! Congratulations.'],
          ['B', 'Thank you. The classes are on Tuesdays and Thursdays at five. Would it be possible to start at seven and leave at three on those days?'],
          ['A', 'Hmm. Mornings are busy. Who would cover the afternoon calls?'],
          ['B', 'I understand the concern. I talked to Jen, and she\'s willing to switch with me. I could also cover Saturday mornings if needed.'],
          ['A', 'That sounds like a good plan. Can you send me an email with the details?'],
          ['B', 'Of course. I\'ll send it today. Thank you for being so flexible.']
        ]
      },
      roleplays: [
        { title: 'Ask for a schedule change for college', setup: 'You are my supervisor. I want to change my work schedule so I can take college classes. Be a little hesitant at first and ask who will cover my hours.', role: 'my supervisor, Ms. Carter', goal: 'Explain my request clearly, answer your concern with a solution, and agree on next steps.' },
        { title: 'Receive feedback in a performance review', setup: 'You are my manager giving me a yearly performance review. Give me two strengths and one area to improve.', role: 'my manager', goal: 'Respond to praise naturally, ask for an example about the area to improve, and suggest how I will improve.' },
        { title: 'Handle an unhappy customer', setup: 'You are an unhappy customer whose order arrived late and incomplete. You are frustrated but not rude.', role: 'an unhappy customer', goal: 'Apologize, show I understand, ask questions, and offer a solution.' }
      ],
      speak: ['I\'m writing to ask about changing my schedule.', 'Thank you for the feedback. That\'s very helpful.', 'Could you give me an example so I understand better?', 'I understand the concern. Here\'s what I suggest.', 'I\'m open to discussing what\'s possible.'],
      write: [
        { task: 'Write a professional **email** to your supervisor asking for a schedule change so you can take a college class. Use the 7 parts from the lesson.', ar: 'اكتبي إيميل لمديرك تطلبي تغيير المواعيد عشان كلاس في الجامعة. استخدمي الـ ٧ أجزاء.' }
      ],
      items: [
        { t: 'mc', q: 'Which is the best first sentence of a work email?', o: ['I\'m writing to ask about changing my schedule.', 'Hello, how are you, I hope you and your family are very well and happy.', 'Schedule.', 'I have a question maybe.'], a: 0, why: 'Professional emails state the **purpose first**.' },
        { t: 'mc', q: 'Which is the best email subject line?', o: ['Request: schedule change for fall semester', 'Hi', 'Question???', 'Please read'], a: 0 },
        { t: 'mc', q: 'Your manager says you need to be more organized. The best answer is:', o: ['Thank you. Could you give me an example so I can improve?', 'That\'s not true.', 'Everyone is like that.', 'OK. (Silence.)'], a: 0 },
        { t: 'mc', q: 'Which phrase shows **flexibility** when asking for something?', o: ['I\'m open to discussing what\'s possible.', 'I need this now.', 'If not, I\'ll quit.', 'This is my final answer.'], a: 0 },
        { t: 'mc', q: 'Which sentence uses a strong work verb?', o: ['I trained three new employees.', 'I did some things with new people.', 'New people were there.', 'I was doing training maybe.'], a: 0 },
        { t: 'mc', q: 'A customer is angry about a late order. What should you say first?', o: ['I\'m so sorry about that. I understand how frustrating it is.', 'It\'s not my fault.', 'Calm down.', 'The truck was late, not me.'], a: 0 },
        { t: 'mc', q: 'Which is the best email closing for a request?', o: ['Thank you for considering this. Best regards, Mona', 'Bye!!!', 'Answer fast.', 'Thx'], a: 0 },
        { t: 'mc', q: 'Your supervisor raises a concern. A strong response:', o: ['I understand the concern. I talked to Jen, and she can cover those hours.', 'That\'s your problem.', 'Never mind then.', 'You always say no.'], a: 0, why: 'Acknowledge the concern, then offer a **solution**.' },
        { t: 'tf', q: 'A professional email should start with a long personal introduction before the purpose.', a: false },
        { t: 'order', a: 'Do you have a few minutes to talk' },
        { t: 'say', text: 'I understand the concern. Here\'s what I suggest.' }
      ]
    },

    L6: {
      id: 'L6T', kind: 'conversation', title: 'Leading Conversations: Interviews and Presentations', ar: 'نقود الكلام: المقابلات والعروض',
      lesson: [
        { h: 'Job interviews: the STAR method' },
        { p: 'Interviewers often say "Tell me about a time when…". Answer with **STAR**: **Situation** (where, when), **Task** (your job), **Action** (what *you* did), **Result** (what happened, with numbers if possible).' },
        { ex: ['Situation: Last year, our clinic got a new booking system.', 'Task: I was asked to help the team learn it.', 'Action: I made a one-page guide and trained five coworkers.', 'Result: Booking mistakes dropped by half in one month.'] },
        { ar: 'في الإنترفيو احكي عن نفسك بثقة. قولي **I** مش **we** بس عشان يعرفوا انتي عملتي إيه بالظبط. وفي الثقافة هنا مش عيب تتكلمي عن إنجازاتك.' },
        { h: 'Common interview questions' },
        { ex: ['Tell me about yourself.', 'What are your strengths?', 'Tell me about a time you solved a problem.', 'Why do you want to work here?', 'Do you have any questions for us?'] },
        { tip: '"Tell me about yourself" is not your life story. Use **present → past → future**: what you do now, your relevant experience, and why you want this job.' },
        { h: 'Presenting an idea' },
        { ex: ['Today I\'d like to talk about one way to save time.', 'There are three main points. First… Second… Finally…', 'To sum up, this change would save about five hours a week.', 'I\'d be happy to answer any questions.'] },
        { h: 'Handling a question you can\'t answer' },
        { ex: ['That\'s a good question. Let me think for a moment.', 'I\'m not sure, but I\'ll find out and get back to you.'] }
      ],
      dialogue: {
        title: 'Job interview', roles: { A: 'Interviewer', B: 'You' }, me: 'B',
        lines: [
          ['A', 'Thanks for coming in. So, tell me a little about yourself.'],
          ['B', 'Thank you for having me. Right now I work as an office assistant at a medical clinic. Before that, I managed a small family business in Egypt for eight years.'],
          ['A', 'Interesting. And why are you interested in this position?'],
          ['B', 'I\'m looking for a role with more responsibility, and I\'m currently studying business at the community college. This position fits my goals.'],
          ['A', 'Tell me about a time you solved a problem at work.'],
          ['B', 'Sure. Last year our clinic got a new booking system, and many appointments were entered incorrectly. I made a simple guide and trained five coworkers. In one month, booking mistakes dropped by half.'],
          ['A', 'That\'s impressive. Do you have any questions for us?'],
          ['B', 'Yes. What would success look like in this role after six months?']
        ]
      },
      roleplays: [
        { title: 'Practice a job interview', setup: 'You are interviewing me for a job that fits my work experience. Ask 5 common interview questions, one at a time, including "Tell me about yourself" and one STAR question ("Tell me about a time when…"). Ask follow-up questions like a real interviewer.', role: 'a professional interviewer', goal: 'Answer with confidence, use the STAR method, and ask a smart question at the end.' },
        { title: 'Present an idea to my team', setup: 'I will present a 1-minute idea to improve something at my workplace. You are my team. After I finish, ask me two challenging questions.', role: 'my team members', goal: 'Present with an opening, three points, and a summary, then handle your questions calmly.' },
        { title: 'A difficult conversation', setup: 'You are a coworker who keeps leaving extra work for me at the end of the day. I want to talk to you about it without starting a fight.', role: 'a coworker who doesn\'t realize there is a problem', goal: 'Describe the problem calmly, explain how it affects me, and agree on a solution.' }
      ],
      speak: ['Thank you for having me.', 'Right now I work as an office assistant, and I\'m studying business at the community college.', 'That\'s a good question. Let me think for a moment.', 'To sum up, this change would save about five hours a week.', 'What would success look like in this role after six months?'],
      items: [
        { t: 'mc', q: 'In the STAR method, the "A" stands for…', o: ['Action: what you did', 'Answer', 'Ability', 'Attitude'], a: 0 },
        { t: 'mc', q: 'Which is the best start to "Tell me about yourself"?', o: ['Right now I work as an office assistant at a clinic, and before that I ran a family business.', 'I was born in 1985 in a small village…', 'What do you want to know?', 'I am a good person.'], a: 0, why: 'Use **present → past → future**, focused on work.' },
        { t: 'mc', q: 'Which **Result** is strongest?', o: ['Booking mistakes dropped by half in one month.', 'It was good.', 'People liked it, I think.', 'Things got better maybe.'], a: 0, why: 'Specific results with numbers are memorable.' },
        { t: 'mc', q: 'The interviewer asks a question you don\'t know. You say:', o: ['That\'s a good question. Let me think for a moment.', 'I don\'t know.', 'Next question.', '(Silence.)'], a: 0 },
        { t: 'mc', q: '"Do you have any questions for us?" The best answer is:', o: ['Yes. What would success look like in this role after six months?', 'No.', 'How much vacation do I get?', 'When can I leave?'], a: 0 },
        { t: 'mc', q: 'Which sentence is the best way to end a presentation?', o: ['To sum up, this change would save time and money. I\'d be happy to answer any questions.', 'That\'s it. Bye.', 'Okay, done.', 'I talked enough.'], a: 0 },
        { t: 'mc', q: 'In an interview, it\'s best to say:', o: ['I trained five coworkers.', 'We did some training.', 'Training happened.', 'Somebody trained people.'], a: 0, why: 'Use **I** to show what **you** did.' },
        { t: 'mc', q: 'A coworker keeps leaving you extra work. The best opening is:', o: ['Do you have a minute? I wanted to talk about something that\'s been happening at the end of the day.', 'You are lazy.', 'I\'m telling the manager.', '(Say nothing and stay angry.)'], a: 0 },
        { t: 'order', a: 'Thank you for having me' },
        { t: 'order', a: 'I will find out and get back to you' },
        { t: 'say', text: 'That\'s a good question. Let me think for a moment.' }
      ]
    }
  };

  (window.SEKKA_LEVELS || []).forEach(L => {
    if (CANDO[L.id] && !L.cando) L.cando = CANDO[L.id];
    const t = TALK[L.id];
    if (t && !L.units.some(u => u.id === t.id)) L.units.splice(1, 0, t);
  });
})();
