# Sekka English (سكة)

An installable web app (PWA) that takes an Egyptian-Arabic-speaking adult from about a 4th–5th grade English level to holding full conversations at work and succeeding in college.

## What's inside

| Level | Grade / CEFR | Talk at Work | Grammar | Vocabulary | Reading | Speaking & Writing |
|---|---|---|---|---|---|---|
| 1 Strong Roots | 4–6 · A2 | introductions, small talk, asking to repeat | be, do/does, -s rule | 16 everyday words | 2 short stories + stories library | P/B, F/V, ship/sheep |
| 2 Building Blocks | 6–7 · A2+ | asking for help, calling in late/sick | past simple, a/an/the | feelings + phrasal verbs | informational + letter | TH, -ed endings, stress |
| 3 Growing Stronger | 8–9 · B1 | instructions, phone messages, checking understanding | present perfect, comparisons, future | Latin/Greek roots | sleep science + biography | clusters, linking, paragraphs |
| 4 High School Ready | 10–12 · B2 | meetings: opinions, polite disagreement | passive, relative clauses, conditionals | Academic Word List 1 | argument + science history | punctuation, persuasive writing |
| 5 College English | College · B2+/C1 | emails, feedback, schedule/raise requests | agreement, parallelism, modifiers | AWL 2 + transitions | academic essays | thesis, summary, formal register |
| 6 Career & College | Advanced · C1 | interviews (STAR), presentations, hard conversations | reading hard texts | workplace idioms | 2 college-level passages | reflection writing |

## How it teaches (evidence-based)

- **Daily 20-minute session** (spaced practice): warm-up review → new lesson → word review → listen and repeat.
- **Retrieval practice:** every session opens with questions from earlier lessons.
- **Mistakes return** after 1, 3, 7, and 16 days until answered correctly (spaced repetition for questions, not just words).
- **Interleaving:** each unit quiz mixes in 2 questions from earlier units.
- **Mastery learning:** 80% to pass a unit or level test.
- **Shadowing:** listen to a short chunk, repeat it, then the whole sentence.
- **Repeated reading:** timed read-aloud of the same paragraph, scored in words correct per minute and accuracy.
- **Explicit L1 contrast:** Egyptian Arabic notes explain *why* each mistake happens; they can be turned off as she advances.
- A **How you can help** guide for family (recasts, teach-back, a daily 10 minutes of English).

Every unit has a **Lesson** (with Egyptian Arabic notes), unlimited **Practice** with explanations, and a **Quiz** (80% to pass). Each level ends with a **20-question test** (80% to pass), which earns a printable certificate. There's also an 18-question **placement check**, a **spaced-repetition word deck**, and a **Voice** tab.

## More practice tools

- **Story library (35 stories):** original graded stories for every level, about adult life, work, college, and family. Read-along audio, 3-question checks, and a daily **Story of the day**.
- **Tap any word:** in stories and reading passages, tap a word to hear it, see its meaning and Arabic translation, hear its sentence, and save it to the review deck. Unknown words can be saved with her own meaning. Meanings are hidden during quizzes and tests.
- **Work phrasebook:** every Talk at Work phrase (68 across 18 situations) in one searchable list with audio.
- **Numbers and spelling drills:** endless generated practice with phone numbers, appointment times, prices, 13-vs-30, dates, and spelled names.
- **Practice for my job:** 28 Claude voice role-plays for 8 common jobs (retail, medical office, warehouse, office, restaurant, childcare, housekeeping, phone customer service), picked from her job setting.
- **My progress:** unit mastery grid, words learned, 4-week practice calendar, and reading-speed history.
- **Weekly family report:** a summary she can send to family (days practiced, units passed, words, stories, reading speed, recordings to grade, and ways to help).
- **Grammar guide:** every grammar rule, table, and tip from the lessons in one searchable page, with links to practice.
- **My writing:** all her saved writing in one place, with word counts and copy-for-Claude grading.
- **Check yourself:** two quick retrieval questions at the end of every lesson.
- **First-run guide** and a nudge to turn off Arabic notes at Level 4+.
- **Two model dialogues per Talk at Work unit** (`content/dialogues2.js`), **20 more workplace words** (`content/words2.js`), and a weekly **English at home** tip on Home.
- **How American College Works** (end of Level 4, `content/college.js`): credits, degrees, placement, advisors, FAFSA and grants, syllabus, office hours.
- Level test results list the units her mistakes came from, with links to practice them.
- **Weekly speaking challenge** (Voice tab): a free-speaking topic each week (easier for levels 1–3, harder for 4–6) to record for family to grade or practice with Claude voice.
- **Type the word** recall on Arabic-first flashcards; missed story questions also return in mistake review.
- A reminder card when 8+ old mistakes are due, a **Check my level again** option, and an **update notice** ("A new version is ready") when a new version is published.
- Tested at 320px phone width with extra-large text, in light and dark mode; all text colors meet 4.5:1 contrast.

About 660 practice and quiz questions (`content/levelN.js` plus `content/extra*.js`), 112 story questions, 132 vocabulary words with Arabic, and 12 model dialogues across 31 units.

## Talk at Work (conversation)

Each level has a conversation unit: ready-made work phrases, politeness and culture notes for Arabic speakers, a two-voice model dialogue she can practice as "her part" (speech-checked), and role-play scenarios. Each scenario copies a prompt for **Claude voice mode**: Claude plays the coworker, manager, customer, or interviewer, corrects her by naturally repeating her sentence back the right way, and gives feedback at the end. Set her job in **Me → Settings** so role-plays match her workplace.

## Grading speech

- **Automatic:** "Check my reading" uses the browser's speech recognition (Chrome on Android or a computer) and colors each word green or red.
- **You:** "Record for grading" saves audio on her phone. Open the **Voice** tab to listen, give 1–5 stars, and leave a note. "Send" shares the audio file (WhatsApp, etc.).
- **Claude voice:** "Claude voice coach" copies a ready-made prompt. Paste it into the Claude app, switch to voice mode, and read aloud.
- **Writing:** "Copy for Claude to grade" builds a full grading prompt (scores, corrections, explanations in English and Egyptian Arabic).

## Adding content

Each level is one file in `content/levelN.js`. Extra questions go in `content/extra*.js`, appended by unit id. Always append, never insert, because question ids are their position and missed-question review depends on them. Stories go in `content/stories*.js`, job role-plays in `content/jobs.js`, extra dialogues in `content/dialogues2.js`, and extra words in `content/words2.js` (load new item files **after** existing ones in `index.html` and `sw.js`). Question types:

```js
{ t: 'mc', q: 'Question with ___ blank', o: ['right', 'wrong'], a: 0, why: 'Explanation' }
{ t: 'tf', q: 'Statement', a: true }
{ t: 'fill', q: 'She ___ (go).', a: ['goes'] }
{ t: 'order', a: 'Words in the right order' }
{ t: 'listen', say: 'text spoken aloud', o: ['...'], a: 0 }
{ t: 'dict', say: 'Type what you hear.' }
{ t: 'say', text: 'Read this aloud.' }        // scored by speech recognition
{ t: 'mc', p: 0, q: '...' }                    // p = passage index in a reading unit
```

After changing files, bump `VERSION` in `sw.js` and the `?v=` numbers in `index.html` so phones pick up the update.

## Turning it into an APK

Once it's hosted (Netlify, GitHub Pages), go to pwabuilder.com, paste the URL, and download the Android package.
