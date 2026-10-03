/** Demo content: 12 short lessons with questions (Sermon on the Mount, Church history, parables). */
import type { QuizInput } from "../quiz-admin";

type Q = QuizInput["questions"][number];
const mc = (prompt: string, options: string[], correct: number, explanation: string, meta: Record<string, unknown> = {}): Q => ({
  type: "multiple_choice",
  prompt,
  explanation,
  points: 10,
  options: options.map((label, i) => ({ label, isCorrect: i === correct })),
  acceptedAnswers: [],
  caseSensitive: false,
  manualReview: false,
  saveToBank: false,
  meta: meta as Q["meta"],
});
const tf = (prompt: string, answer: boolean, explanation: string, meta: Record<string, unknown> = {}): Q => ({
  ...mc(prompt, ["True", "False"], answer ? 0 : 1, explanation, meta),
  type: "true_false",
});
const sa = (prompt: string, accepted: string[], explanation: string, meta: Record<string, unknown> = {}): Q => ({
  ...mc(prompt, [], 0, explanation, meta),
  type: "short_answer",
  options: [],
  acceptedAnswers: accepted,
  manualReview: true,
});

export const LESSONS: { title: string; passage: string; topic: string; notes: string; questions: Q[] }[] = [
  {
    title: "The Beatitudes",
    passage: "Matthew 5:1–12",
    topic: "Sermon on the Mount",
    notes: "Jesus opens the Sermon on the Mount with nine blessings. Notice who is called blessed — not the powerful, but the poor in spirit, the meek and the peacemakers.\n\nAs you read, ask: which of these is hardest for me this week?",
    questions: [
      mc("What does Jesus say the peacemakers will be called?", ["Teachers", "Sons of God", "Prophets", "Disciples"], 1, "\"Blessed are the peacemakers, for they shall be called sons of God.\" (Matthew 5:9)", { book: "Matthew", chapter: 5, verses: "9", topic: "New Testament", difficulty: "easy" }),
      mc("Who does Jesus say will inherit the earth?", ["The strong", "The meek", "The merciful", "The pure in heart"], 1, "\"Blessed are the meek, for they shall inherit the earth.\" (Matthew 5:5)", { book: "Matthew", chapter: 5, verses: "5", topic: "New Testament" }),
      tf("Jesus says those who mourn will be comforted.", true, "Matthew 5:4", { book: "Matthew", chapter: 5, verses: "4" }),
      mc("Where did Jesus go to teach this sermon?", ["A boat", "The temple", "A mountain", "The desert"], 2, "\"Seeing the multitudes, He went up on a mountain.\" (Matthew 5:1)", { book: "Matthew", chapter: 5, verses: "1" }),
    ],
  },
  {
    title: "Salt and Light",
    passage: "Matthew 5:13–16",
    topic: "Sermon on the Mount",
    notes: "Salt preserves and gives flavour; light shows the way. Jesus says His followers are both — not something they try to become, but something they already are.",
    questions: [
      mc("Jesus says, \"You are the ___ of the earth.\"", ["light", "salt", "hope", "strength"], 1, "Matthew 5:13", { book: "Matthew", chapter: 5, verses: "13", difficulty: "easy" }),
      mc("Why should we let our light shine before men?", ["So they praise us", "So they glorify our Father in heaven", "So we are rewarded on earth", "So we become famous"], 1, "\"…that they may see your good works and glorify your Father in heaven.\" (Matthew 5:16)", { book: "Matthew", chapter: 5, verses: "16" }),
      tf("Jesus says a city on a hill cannot be hidden.", true, "Matthew 5:14", { book: "Matthew", chapter: 5, verses: "14" }),
    ],
  },
  {
    title: "The Lord's Prayer",
    passage: "Matthew 6:5–15",
    topic: "Prayer",
    notes: "Jesus teaches us not to pray to be seen, but to go into our room and pray to our Father in secret. Then He gives us the prayer we say at every Agpeya hour.",
    questions: [
      mc("Where does Jesus tell us to go when we pray?", ["The street corner", "Your room, with the door shut", "The synagogue", "The mountain"], 1, "Matthew 6:6", { book: "Matthew", chapter: 6, verses: "6", topic: "Prayer" }),
      mc("In the Agpeya, the Lord's Prayer is prayed…", ["Only on Sundays", "At the start of every hour", "Only during Lent", "Only by priests"], 1, "Every hour of the Agpeya begins with the Lord's Prayer.", { topic: "Liturgy" }),
      sa("Complete: \"Give us this day our daily ___.\"", ["bread"], "Matthew 6:11", { book: "Matthew", chapter: 6, verses: "11", topic: "Prayer", difficulty: "easy" }),
      tf("Jesus says we should use many words so we are heard.", false, "\"Do not use vain repetitions as the heathen do.\" (Matthew 6:7)", { book: "Matthew", chapter: 6, verses: "7" }),
    ],
  },
  {
    title: "Treasures in Heaven",
    passage: "Matthew 6:19–24",
    topic: "Sermon on the Mount",
    notes: "\"Where your treasure is, there your heart will be also.\" What we spend our time and money on shows what we really love.",
    questions: [
      mc("Complete: \"Where your treasure is, there your ___ will be also.\"", ["mind", "heart", "home", "faith"], 1, "Matthew 6:21", { book: "Matthew", chapter: 6, verses: "21", difficulty: "easy" }),
      mc("Jesus says no one can serve two masters. What are the two named?", ["God and Caesar", "God and mammon", "Rome and Israel", "Faith and works"], 1, "Matthew 6:24", { book: "Matthew", chapter: 6, verses: "24" }),
      tf("Treasures on earth can be destroyed by moth and rust.", true, "Matthew 6:19", { book: "Matthew", chapter: 6, verses: "19" }),
    ],
  },
  {
    title: "Do Not Worry",
    passage: "Matthew 6:25–34",
    topic: "Faith",
    notes: "Jesus points to the birds and the lilies. God feeds and clothes them — how much more will He care for you?",
    questions: [
      mc("What does Jesus tell us to seek first?", ["Wealth", "The kingdom of God and His righteousness", "Wisdom", "Peace"], 1, "Matthew 6:33", { book: "Matthew", chapter: 6, verses: "33", topic: "Faith" }),
      mc("Which flowers does Jesus use as an example?", ["Roses", "Lilies of the field", "Olive blossoms", "Fig flowers"], 1, "Matthew 6:28", { book: "Matthew", chapter: 6, verses: "28" }),
      mc("Even Solomon in all his glory was not arrayed like…", ["The angels", "One of these lilies", "The high priest", "Pharaoh"], 1, "Matthew 6:29", { book: "Matthew", chapter: 6, verses: "29", difficulty: "medium" }),
    ],
  },
  {
    title: "Ask, Seek, Knock",
    passage: "Matthew 7:7–12",
    topic: "Prayer",
    notes: "God is a Father who gives good gifts. The Golden Rule closes this section: treat others the way you want to be treated.",
    questions: [
      tf("Jesus says, \"Knock, and it will be opened to you.\"", true, "Matthew 7:7", { book: "Matthew", chapter: 7, verses: "7" }),
      mc("If a son asks for bread, what will a father not give him?", ["A fish", "A stone", "A serpent", "An egg"], 1, "Matthew 7:9", { book: "Matthew", chapter: 7, verses: "9" }),
      mc("The Golden Rule is in which verse?", ["Matthew 5:9", "Matthew 6:33", "Matthew 7:12", "Matthew 7:24"], 2, "Matthew 7:12", { book: "Matthew", chapter: 7, verses: "12", difficulty: "hard" }),
    ],
  },
  {
    title: "The Wise and Foolish Builders",
    passage: "Matthew 7:24–29",
    topic: "Sermon on the Mount",
    notes: "Hearing isn't enough. The wise man hears Christ's words and does them.",
    questions: [
      mc("On what did the wise man build his house?", ["Sand", "The rock", "Clay", "A hill"], 1, "Matthew 7:24", { book: "Matthew", chapter: 7, verses: "24", difficulty: "easy" }),
      mc("How did the crowds react to Jesus' teaching?", ["They left", "They were astonished", "They argued", "They fell asleep"], 1, "\"The people were astonished at His teaching.\" (Matthew 7:28)", { book: "Matthew", chapter: 7, verses: "28" }),
      tf("Jesus taught like the scribes.", false, "He taught as one having authority, and not as the scribes. (Matthew 7:29)", { book: "Matthew", chapter: 7, verses: "29" }),
    ],
  },
  {
    title: "St. Athanasius the Apostolic",
    passage: "John 1:1–14",
    topic: "Church History",
    notes: "St. Athanasius, the 20th Pope of Alexandria, defended the divinity of Christ against Arius at the Council of Nicaea — even when it seemed the whole world was against him.",
    questions: [
      mc("At which council did St. Athanasius defend the faith against Arius?", ["Ephesus", "Chalcedon", "Nicaea", "Constantinople"], 2, "The First Ecumenical Council at Nicaea in AD 325.", { topic: "Church History", difficulty: "medium" }),
      mc("What did Arius wrongly teach?", ["Christ was not truly God", "There is no Holy Spirit", "Mary is not the Theotokos", "Baptism is unnecessary"], 0, "Arius taught that the Son was created — the Church confessed He is \"of one essence with the Father.\"", { topic: "Coptic Orthodox Faith" }),
      sa("Which city was St. Athanasius the patriarch of?", ["Alexandria"], "He was the 20th Pope of Alexandria.", { topic: "Saints", difficulty: "easy" }),
      tf("\"In the beginning was the Word, and the Word was with God, and the Word was God.\"", true, "John 1:1", { book: "John", chapter: 1, verses: "1" }),
    ],
  },
  {
    title: "The Sermon on the Mount — Review",
    passage: "Matthew 5–7",
    topic: "Review",
    notes: "This week's review covers everything we've read in Matthew 5–7.",
    questions: [
      mc("Which of these is NOT one of the Beatitudes?", ["Blessed are the merciful", "Blessed are the rich", "Blessed are the pure in heart", "Blessed are the poor in spirit"], 1, "Matthew 5:3–12", { book: "Matthew", chapter: 5 }),
      { ...mc("Which are things Jesus tells us to do in secret? (Choose all)", ["Give alms", "Pray", "Fast", "Preach"], 0, "Matthew 6:1–18", { book: "Matthew", chapter: 6 }), type: "multiple_answer", options: [{ label: "Give alms", isCorrect: true }, { label: "Pray", isCorrect: true }, { label: "Fast", isCorrect: true }, { label: "Preach", isCorrect: false }] },
      mc("\"Judge not, that you be not ___.\"", ["condemned", "judged", "forgotten", "punished"], 1, "Matthew 7:1", { book: "Matthew", chapter: 7, verses: "1" }),
      tf("Jesus says the gate to life is wide.", false, "\"Narrow is the gate and difficult is the way which leads to life.\" (Matthew 7:14)", { book: "Matthew", chapter: 7, verses: "14" }),
    ],
  },
  {
    title: "The Calling of Matthew",
    passage: "Matthew 9:9–13",
    topic: "Gospels",
    notes: "Matthew was a tax collector — someone everyone avoided. Jesus said just two words to him: \"Follow Me.\"",
    questions: [
      mc("What was Matthew's job when Jesus called him?", ["Fisherman", "Tax collector", "Carpenter", "Soldier"], 1, "Matthew 9:9", { book: "Matthew", chapter: 9, verses: "9", difficulty: "easy" }),
      mc("Jesus said He came to call…", ["The righteous", "Sinners to repentance", "Only the Jews", "The Pharisees"], 1, "Matthew 9:13", { book: "Matthew", chapter: 9, verses: "13" }),
      tf("Matthew got up and followed Jesus.", true, "Matthew 9:9", { book: "Matthew", chapter: 9, verses: "9" }),
    ],
  },
  {
    title: "Jesus Calms the Storm",
    passage: "Matthew 8:23–27",
    topic: "Faith",
    notes: "The disciples were terrified while Jesus slept. When He woke, He asked them: \"Why are you fearful, O you of little faith?\"",
    questions: [
      mc("What was Jesus doing when the storm began?", ["Praying", "Sleeping", "Teaching", "Fishing"], 1, "Matthew 8:24", { book: "Matthew", chapter: 8, verses: "24", difficulty: "easy" }),
      mc("What did Jesus rebuke?", ["The disciples only", "The winds and the sea", "The boat", "The crowd"], 1, "Matthew 8:26", { book: "Matthew", chapter: 8, verses: "26" }),
      mc("What did the disciples ask afterward?", ["\"Who can forgive sins?\"", "\"Who is this, that even the winds and the sea obey Him?\"", "\"Where are we going?\"", "\"Why did You sleep?\""], 1, "Matthew 8:27", { book: "Matthew", chapter: 8, verses: "27" }),
      sa("How many disciples did Jesus choose as apostles? (number)", ["12", "twelve"], "Matthew 10:1–4", { book: "Matthew", chapter: 10, difficulty: "easy" }),
    ],
  },
  {
    title: "The Parable of the Sower",
    passage: "Matthew 13:1–23",
    topic: "Gospels",
    notes: "The same seed falls on four kinds of ground. Which kind of ground is your heart right now?",
    questions: [
      mc("What does the seed represent?", ["Money", "The word of the kingdom", "Good works", "The Church"], 1, "Matthew 13:19", { book: "Matthew", chapter: 13, verses: "19" }),
      mc("What happened to seed that fell among thorns?", ["Birds ate it", "It was choked", "It withered in the sun", "It produced a hundredfold"], 1, "Matthew 13:7", { book: "Matthew", chapter: 13, verses: "7" }),
      tf("The good ground yields a crop of a hundred, sixty or thirtyfold.", true, "Matthew 13:8", { book: "Matthew", chapter: 13, verses: "8" }),
    ],
  },
];

