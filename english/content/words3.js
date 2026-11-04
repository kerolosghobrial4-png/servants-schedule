/* College and career vocabulary for Levels 5 and 6. Loaded after college.js so existing item ids stay stable. */
(function () {
  const W = {
    L5U2: [
      { w: 'lecture', ar: 'محاضرة', d: 'A talk given by a professor to teach a class.', ex: 'The lecture is on Tuesday evening.' },
      { w: 'essay', ar: 'مقال', d: 'A piece of writing that explains or argues an idea.', ex: 'Our first essay is due next week.' },
      { w: 'citation', ar: 'توثيق المصدر', d: 'Information that shows where an idea or quote came from.', ex: 'Add a citation for every quote.' },
      { w: 'plagiarism', ar: 'سرقة علمية', d: 'Using someone else\'s words or ideas without giving credit. It is a serious offense in college.', ex: 'Copying from a website is plagiarism.' },
      { w: 'rubric', ar: 'معايير التصحيح', d: 'A chart that shows how an assignment will be graded.', ex: 'Read the rubric before you start writing.' },
      { w: 'midterm', ar: 'امتحان نص الترم', d: 'An exam in the middle of the semester.', ex: 'I am studying for my midterm.' },
      { w: 'attendance', ar: 'الحضور', d: 'Being present in class. Many classes count it in your grade.', ex: 'Attendance is ten percent of the grade.' },
      { w: 'extension', ar: 'مد الميعاد', d: 'Extra time to finish an assignment, given by the professor.', ex: 'I asked for a two-day extension because I was sick.' },
      { w: 'assignment', ar: 'واجب / تكليف', d: 'A piece of work a teacher asks you to do.', ex: 'The assignment is to read chapter three.' },
      { w: 'peer review', ar: 'مراجعة الزملاء', d: 'When classmates read and comment on each other\'s work.', ex: 'We did a peer review of our essays.' }
    ],
    L6U2: [
      { w: 'résumé', ar: 'السي في', d: 'A short document listing your work experience, education, and skills.', ex: 'Update your résumé before you apply.' },
      { w: 'cover letter', ar: 'خطاب تقديم', d: 'A letter you send with your résumé explaining why you want the job.', ex: 'Her cover letter described her customer service experience.' },
      { w: 'reference', ar: 'شخص يزكّيكي', d: 'A person who can tell an employer about your work.', ex: 'My old manager is one of my references.' },
      { w: 'networking', ar: 'بناء علاقات مهنية', d: 'Meeting and talking with people who can help your career.', ex: 'Networking helped her find a new job.' },
      { w: 'internship', ar: 'تدريب عملي', d: 'A short work experience, often for students, to learn a job.', ex: 'He did a summer internship at a hospital.' },
      { w: 'onboarding', ar: 'فترة التعريف بالشغل', d: 'The training and introduction a new employee receives.', ex: 'Onboarding takes two weeks.' },
      { w: 'performance review', ar: 'تقييم الأداء', d: 'A meeting where a manager discusses how well you are doing.', ex: 'My performance review is in March.' },
      { w: 'benefits package', ar: 'المزايا (تأمين، إجازات…)', d: 'Extras a job gives besides pay, like health insurance and paid time off.', ex: 'The job has a good benefits package.' },
      { w: 'negotiate', ar: 'يتفاوض', d: 'To discuss something to reach an agreement, like salary or schedule.', ex: 'She negotiated a higher salary.' },
      { w: 'transferable skills', ar: 'مهارات تنفع في أي شغل', d: 'Skills you can use in many jobs, like communication and organization.', ex: 'Running a family business gave her many transferable skills.' }
    ]
  };
  const Q = {
    L5U2: [
      { t: 'mc', q: 'Copying sentences from a website without giving credit is called…', o: ['plagiarism', 'citation', 'peer review', 'attendance'], a: 0 },
      { t: 'mc', q: 'The chart that shows how your essay will be graded is the…', o: ['rubric', 'lecture', 'midterm', 'extension'], a: 0 },
      { t: 'mc', q: 'You were sick and need more time for an assignment. You ask for an…', o: ['extension', 'attendance', 'essay', 'rubric'], a: 0 }
    ],
    L6U2: [
      { t: 'mc', q: 'The document that lists your experience and skills is your…', o: ['résumé', 'reference', 'onboarding', 'internship'], a: 0 },
      { t: 'mc', q: 'Health insurance and paid vacation are part of the…', o: ['benefits package', 'cover letter', 'performance review', 'networking'], a: 0 },
      { t: 'mc', q: 'Managing money, staff, and customers in a family business gives you…', o: ['transferable skills', 'plagiarism', 'a midterm', 'an extension'], a: 0 }
    ]
  };
  (window.SEKKA_LEVELS || []).forEach(L => L.units.forEach(u => {
    if (W[u.id] && !u._words3) {
      const have = new Set((u.words || []).map(x => x.w));
      u.words = (u.words || []).concat(W[u.id].filter(x => !have.has(x.w)));
      u._words3 = true;
    }
    if (Q[u.id] && !u._words3q) { u.items = (u.items || []).concat(Q[u.id]); u._words3q = true; }
  }));
})();
