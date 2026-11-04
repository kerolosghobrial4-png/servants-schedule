/* Job-specific role-play scenarios for Claude voice practice. */
window.SEKKA_JOBS = [
  { id: 'retail', name: 'Cashier or retail', ar: 'كاشير / محل', scenes: [
    { title: 'A customer wants to return something', setup: 'I am a cashier. You are a customer returning a shirt that is the wrong size. You have the receipt.', role: 'a customer', goal: 'Greet you, ask for the receipt, offer an exchange or refund, and finish the return politely.' },
    { title: 'A customer can\'t find a product', setup: 'I work in a store. You are a customer looking for a product (you choose) and you are in a hurry.', role: 'a customer in a hurry', goal: 'Ask questions to understand what you need, explain where it is, and offer to help.' },
    { title: 'The card doesn\'t work', setup: 'I am a cashier. Your credit card is declined twice and you are embarrassed and a little annoyed.', role: 'a customer whose card was declined', goal: 'Stay calm and kind, explain the problem, and offer other ways to pay.' },
    { title: 'Ask my manager for a different shift', setup: 'You are my store manager. I need to change my Saturday shift because of a family event.', role: 'my store manager', goal: 'Ask politely, explain why, and offer a solution like trading with a coworker.' }
  ] },
  { id: 'medical', name: 'Medical office or clinic', ar: 'عيادة / مستشفى', scenes: [
    { title: 'Check in a patient', setup: 'I work at the front desk of a clinic. You are a patient arriving for an appointment. You forgot your insurance card.', role: 'a patient', goal: 'Greet you, confirm your name and date of birth, ask for insurance, and explain what to do without the card.' },
    { title: 'Schedule an appointment by phone', setup: 'I answer the phone at a clinic. You are calling to make an appointment for a sore back. You can only come in the afternoon.', role: 'a patient on the phone', goal: 'Find a time that works, confirm your name, phone number, and the appointment time, and read it back.' },
    { title: 'A worried patient in the waiting room', setup: 'You are a patient who has been waiting 40 minutes and you are worried and frustrated.', role: 'a frustrated patient', goal: 'Apologize, explain the delay calmly, and tell you what will happen next.' },
    { title: 'Take instructions from a nurse', setup: 'You are a nurse giving me three quick instructions about preparing an exam room.', role: 'a busy nurse', goal: 'Listen, ask one clarifying question, and repeat the instructions back to confirm.' }
  ] },
  { id: 'warehouse', name: 'Warehouse or factory', ar: 'مخزن / مصنع', scenes: [
    { title: 'Report a safety problem', setup: 'You are my shift supervisor. I noticed a broken pallet jack and a wet floor near the loading dock.', role: 'my shift supervisor', goal: 'Explain the problem clearly, say where it is, and suggest what to do.' },
    { title: 'Understand a new task', setup: 'You are my supervisor explaining how to pack a new type of order, with four steps.', role: 'my supervisor', goal: 'Ask questions, confirm the steps in order, and check the deadline.' },
    { title: 'Ask for overtime', setup: 'You are my manager. I want to work extra hours next week.', role: 'my manager', goal: 'Ask politely, give my availability, and confirm the schedule.' },
    { title: 'Help a new coworker', setup: 'You are a new coworker on your first day. You are nervous and don\'t know where anything is.', role: 'a new coworker', goal: 'Welcome you, explain the break room and the time clock, and offer help.' }
  ] },
  { id: 'office', name: 'Office or administrative', ar: 'مكتب / إداري', scenes: [
    { title: 'Answer a call for my boss', setup: 'I answer the phone at an office. You are a client calling for my manager, who is in a meeting. You need a call back today.', role: 'a client on the phone', goal: 'Answer professionally, take a complete message, and promise a call back.' },
    { title: 'Schedule a meeting', setup: 'You are a coworker. I need to schedule a 30-minute meeting with you this week, but your calendar is busy.', role: 'a busy coworker', goal: 'Suggest times, find one that works, and confirm the day, time, and place.' },
    { title: 'Explain a mistake I made', setup: 'You are my supervisor. I sent a report with the wrong numbers to a client.', role: 'my supervisor', goal: 'Admit the mistake, explain how I will fix it, and how I will prevent it next time.' },
    { title: 'Ask for training on new software', setup: 'You are my manager. The company started using new software and I need more training.', role: 'my manager', goal: 'Explain what I need, why it helps the team, and suggest a plan.' }
  ] },
  { id: 'restaurant', name: 'Restaurant or food service', ar: 'مطعم', scenes: [
    { title: 'Take an order', setup: 'I am a server. You are a customer ordering lunch. You have a food allergy and you ask many questions about the menu.', role: 'a customer with an allergy', goal: 'Greet you, answer questions, write down your order, and repeat it back.' },
    { title: 'A customer complains about the food', setup: 'You are a customer. Your food is cold and you waited a long time.', role: 'an unhappy customer', goal: 'Apologize, offer a solution, and keep the customer happy.' },
    { title: 'Talk with the kitchen', setup: 'You are the cook. I need to tell you about a special order and a customer\'s allergy.', role: 'a busy cook', goal: 'Explain clearly and quickly, and confirm you understood.' }
  ] },
  { id: 'childcare', name: 'Childcare or school', ar: 'حضانة / مدرسة', scenes: [
    { title: 'Talk to a parent at pickup', setup: 'I work at a daycare. You are a parent picking up your child. I need to tell you your child had a small fall but is okay.', role: 'a worried parent', goal: 'Explain what happened calmly, what I did, and answer questions.' },
    { title: 'A parent asks about their child\'s progress', setup: 'You are a parent asking how your child is doing with sharing and making friends.', role: 'a parent', goal: 'Give positive news, one area to work on, and a suggestion for home.' },
    { title: 'Ask a coworker to switch duties', setup: 'You are a coworker. I want to switch lunch duty with you on Thursday.', role: 'a coworker', goal: 'Ask politely, explain why, and agree on the switch.' }
  ] },
  { id: 'housekeeping', name: 'Housekeeping or cleaning', ar: 'تنظيف / فندق', scenes: [
    { title: 'A hotel guest has a request', setup: 'I clean rooms at a hotel. You are a guest who wants extra towels and asks about checkout time.', role: 'a hotel guest', goal: 'Greet you, answer your questions, and promise to bring what you need.' },
    { title: 'Report damage to my supervisor', setup: 'You are my supervisor. I found a broken lamp and a stain on the carpet in room 214.', role: 'my supervisor', goal: 'Describe the damage clearly and ask what to do.' },
    { title: 'A client changes the cleaning schedule', setup: 'You are a homeowner who hires me to clean. You want to change the day and add an extra room.', role: 'a client', goal: 'Understand the change, discuss the extra time and price, and confirm.' }
  ] },
  { id: 'callcenter', name: 'Customer service by phone', ar: 'خدمة عملاء', scenes: [
    { title: 'A customer with a billing problem', setup: 'I work in customer service. You are calling because you were charged twice this month.', role: 'a frustrated customer', goal: 'Verify your account, show understanding, explain the solution, and confirm next steps.' },
    { title: 'A customer who speaks very fast', setup: 'You are a customer who speaks quickly and uses some idioms. You want to change your address.', role: 'a fast-talking customer', goal: 'Ask you to slow down or repeat politely, confirm the new address by spelling it, and finish the call.' },
    { title: 'Transfer a call', setup: 'You are a customer with a question I can\'t answer. I need to transfer you to another department.', role: 'a customer', goal: 'Explain politely that I will transfer you, tell you why, and thank you for waiting.' }
  ] }
];
