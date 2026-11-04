# Sekka English (سكة)

An installable web app (PWA) that takes an Egyptian-Arabic-speaking adult from about a 4th–5th grade English level to college reading and MCAT CARS.

## What's inside

| Level | Grade / CEFR | Grammar | Vocabulary | Reading | Speaking & Writing |
|---|---|---|---|---|---|
| 1 Strong Roots | 4–6 · A2 | be, do/does, -s rule | 16 everyday words | 2 short stories | P/B, F/V, ship/sheep |
| 2 Building Blocks | 6–7 · A2+ | past simple, a/an/the | feelings + phrasal verbs | informational + letter | TH, -ed endings, stress |
| 3 Growing Stronger | 8–9 · B1 | present perfect, comparisons, future | Latin/Greek roots | sleep science + biography | clusters, linking, paragraphs |
| 4 High School Ready | 10–12 · B2 | passive, relative clauses, conditionals | Academic Word List 1 | argument + science history | punctuation, persuasive writing |
| 5 College English | College · B2+/C1 | agreement, parallelism, modifiers | AWL 2 + transitions | academic essays | thesis, summary, formal register |
| 6 MCAT CARS | Pre-med · C1 | CARS strategy | medical word parts | 2 full CARS-style passages | reflection writing |

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

## Grading speech

- **Automatic:** "Check my reading" uses the browser's speech recognition (Chrome on Android or a computer) and colors each word green or red.
- **You:** "Record for grading" saves audio on her phone. Open the **Voice** tab to listen, give 1–5 stars, and leave a note. "Send" shares the audio file (WhatsApp, etc.).
- **Claude voice:** "Claude voice coach" copies a ready-made prompt. Paste it into the Claude app, switch to voice mode, and read aloud.
- **Writing:** "Copy for Claude to grade" builds a full grading prompt (scores, corrections, explanations in English and Egyptian Arabic).

## Adding content

Each level is one file in `content/levelN.js`. Question types:

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
