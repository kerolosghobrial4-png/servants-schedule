/* "How American College Works" — a college-readiness unit appended to Level 4. */
(function () {
  const unit = {
    id: 'L4C', kind: 'reading', title: 'How American College Works', ar: 'الجامعة في أمريكا بتشتغل إزاي',
    lesson: [
      { p: 'Many adults in the United States start at a **community college**. Classes are cheaper, many are in the evening or online, and most students work. After two years, you can earn an **associate degree** or **transfer** to a four-year university for a **bachelor\'s degree**.' },
      { ar: 'كتير من الكبار هنا بيبدأوا في «community college». أرخص، وفيه كلاسات بالليل وأونلاين، ومعظم الطلبة بيشتغلوا. بعد سنتين ممكن تاخدي شهادة أو تكمّلي في جامعة أربع سنين.' },
      { h: 'Credits and degrees' },
      { table: [['Term', 'What it means'], ['**credit**', 'A unit for each class. Most classes are 3 credits.'], ['**semester**', 'A school term, usually about 15 weeks (fall and spring).'], ['**full-time / part-time**', 'Full-time is usually 12 or more credits a semester. Part-time is less: good for working adults.'], ['**associate degree**', 'About 60 credits, usually 2 years full-time.'], ['**bachelor\'s degree**', 'About 120 credits, usually 4 years full-time.'], ['**GPA**', 'Grade point average, from 0.0 to 4.0. An A is 4.0, a B is 3.0.']] },
      { h: 'Before your first class' },
      { ex: ['Apply online. Community colleges usually accept everyone with a high school diploma or equivalent.', 'Take a placement test or show your English level. You may start with ESL classes, and that is normal.', 'Meet an advisor. They help you choose classes that count toward your goal.', 'Send your foreign transcripts for evaluation. Some of your old courses may count.'] },
      { h: 'Paying for college' },
      { p: 'Fill out the **FAFSA** (Free Application for Federal Student Aid) every year. If you are eligible, you may receive a **Pell Grant**, which does not need to be paid back. Ask about **scholarships** and whether your employer offers **tuition assistance**.' },
      { ar: 'املي استمارة «FAFSA» كل سنة. لو مستحقة ممكن تاخدي منحة «Pell Grant» ومش هترجّعيها. واسألي عن المنح وإذا كان شغلك بيساعد في المصاريف.' },
      { h: 'In class' },
      { p: 'The **syllabus** is the plan for the whole course: assignments, due dates, and how you are graded. Read it on the first day. **Office hours** are times when the professor is available to help you. Going to office hours is a sign of a serious student, not a weak one.' },
      { tip: 'Most colleges have a free **writing center** and **tutoring center**. Use them early, not only when you have a problem.' }
    ],
    words: [
      { w: 'community college', ar: 'كلية مجتمع (جامعة سنتين)', d: 'A two-year public college with lower costs and flexible schedules.', ex: 'She takes evening classes at the community college.' },
      { w: 'credit', ar: 'ساعة معتمدة', d: 'A unit that measures a class. Most classes are 3 credits.', ex: 'I am taking six credits this semester.' },
      { w: 'semester', ar: 'ترم / فصل دراسي', d: 'A school term, about 15 weeks long.', ex: 'The fall semester starts in September.' },
      { w: 'syllabus', ar: 'خطة المادة', d: 'A document that lists a course\'s topics, assignments, due dates, and grading.', ex: 'Check the syllabus for the due date.' },
      { w: 'office hours', ar: 'ساعات مكتب الدكتور', d: 'Times when a professor meets students to help them.', ex: 'I asked my question during office hours.' },
      { w: 'prerequisite', ar: 'مادة مطلوبة قبلها', d: 'A class you must pass before you can take another class.', ex: 'English 101 is a prerequisite for this course.' },
      { w: 'transcript', ar: 'كشف درجات', d: 'An official record of your classes and grades.', ex: 'Send your transcript to the new school.' },
      { w: 'advisor', ar: 'مرشد أكاديمي', d: 'A college staff member who helps you plan your classes.', ex: 'My advisor helped me choose my classes.' },
      { w: 'tuition', ar: 'مصاريف الدراسة', d: 'The money you pay to take classes.', ex: 'Tuition is lower at community colleges.' },
      { w: 'financial aid', ar: 'مساعدة مالية', d: 'Money from the government, school, or others to help pay for college.', ex: 'Apply for financial aid early.' },
      { w: 'grant', ar: 'منحة (مش بترجع)', d: 'Money for school that you do not pay back.', ex: 'A Pell Grant does not need to be repaid.' },
      { w: 'transfer', ar: 'يحوّل (لجامعة تانية)', d: 'To move from one school to another, often keeping your credits.', ex: 'She plans to transfer to a university.' },
      { w: 'enroll', ar: 'يقيّد / يسجّل في الجامعة', d: 'To officially join a school or class.', ex: 'I enrolled in two classes for spring.' },
      { w: 'due date', ar: 'آخر ميعاد للتسليم', d: 'The day an assignment must be turned in.', ex: 'The essay\'s due date is Friday.' }
    ],
    passages: [
      { title: 'Your First Semester: A Survival Guide', text: 'The first week of college can feel overwhelming, especially for adult students who have been away from school for years. You may be balancing classes with a job and a family, and the campus may seem full of unfamiliar words and rules. The good news is that a few simple habits make a big difference.\n\nFirst, read every syllabus carefully during the first week. Write all the due dates in one calendar, including dates for exams and major papers. Many students lose points not because the work is too hard, but because they forget a deadline.\n\nSecond, introduce yourself to each professor, either after class or during office hours. You do not need a special reason. Saying, "I\'m an adult student and English is my second language, and I want to do well in this class" helps the professor understand you, and many will offer extra support.\n\nThird, use the free resources. The writing center can review your essays before you submit them, and the tutoring center can help with math or science. These services are already included in your tuition, so not using them is like paying for a meal and leaving without eating.\n\nFinally, be realistic about your schedule. Two classes while working full-time is a strong start. It is better to pass two classes with good grades than to fail four. College is not a race; it is a path, and every credit brings you closer to your goal.' }
    ],
    items: [
      { t: 'mc', q: 'Most college classes are worth ___ credits.', o: ['3', '1', '10', '30'], a: 0 },
      { t: 'mc', q: 'An associate degree usually requires about ___ credits.', o: ['60', '12', '120', '6'], a: 0 },
      { t: 'mc', q: 'A ___ is a class you must pass before taking another one.', o: ['prerequisite', 'syllabus', 'transcript', 'grant'], a: 0 },
      { t: 'mc', q: 'Where do you find the due dates and grading rules for a course?', o: ['In the syllabus', 'In the transcript', 'On the FAFSA', 'In the grant'], a: 0 },
      { t: 'mc', q: 'What is the FAFSA?', o: ['A form to apply for federal student aid', 'A placement test', 'A type of degree', 'A college class'], a: 0 },
      { t: 'mc', q: 'A grant is money that you…', o: ['do not pay back', 'must pay back with interest', 'pay to the college', 'earn at work'], a: 0 },
      { t: 'mc', q: 'Professors\' office hours are for…', o: ['students to get help and ask questions', 'only students who are failing', 'teachers to grade papers alone', 'paying tuition'], a: 0, why: 'Going to office hours is a sign of a serious student.' },
      { t: 'mc', q: 'If you have a GPA of 4.0, your grades are mostly…', o: ['A', 'B', 'C', 'F'], a: 0 },
      { t: 'mc', q: 'An official record of your classes and grades is a…', o: ['transcript', 'syllabus', 'credit', 'semester'], a: 0 },
      { t: 'mc', p: 0, q: 'According to the guide, why do many students lose points?', o: ['They forget deadlines.', 'The work is too hard.', 'Professors are unfair.', 'They study too much.'], a: 0 },
      { t: 'mc', p: 0, q: 'The author compares not using free resources to…', o: ['paying for a meal and leaving without eating', 'running a race', 'reading a syllabus', 'failing four classes'], a: 0 },
      { t: 'mc', p: 0, q: 'What schedule does the author recommend for someone working full-time?', o: ['Two classes', 'Four classes', 'Six classes', 'No classes'], a: 0 },
      { t: 'mc', p: 0, q: '"College is not a race; it is a path" means:', o: ['Progress at your own pace is what matters.', 'You must finish faster than others.', 'College is dangerous.', 'You should walk to campus.'], a: 0 },
      { t: 'tf', p: 0, q: 'The author says you need a special reason to visit a professor.', a: false }
    ],
    speak: ['I\'m an adult student, and English is my second language.', 'Could you explain the grading in the syllabus?', 'I would like to make an appointment with an advisor.', 'Will my credits transfer to a four-year university?'],
    write: [{ task: 'Write an email (80–120 words) to a college advisor. Introduce yourself, say what you want to study, explain that you work, and ask two questions about classes or financial aid.', ar: 'اكتبي إيميل لمرشد أكاديمي: عرّفي نفسك، قولي عايزة تدرسي إيه، وإنك بتشتغلي، واسألي سؤالين.' }]
  };
  const L4 = (window.SEKKA_LEVELS || []).find(L => L.id === 'L4');
  if (L4 && !L4.units.some(u => u.id === unit.id)) L4.units.push(unit);
})();
