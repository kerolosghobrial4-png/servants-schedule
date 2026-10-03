import { relations, sql } from "drizzle-orm";
import {
  boolean,
  check,
  date,
  index,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  primaryKey,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";

/* ------------------------------------------------------------------ */
/* Enums                                                               */
/* ------------------------------------------------------------------ */

export const roleEnum = pgEnum("role", ["student", "leader", "admin"]);
export const quizStatusEnum = pgEnum("quiz_status", ["draft", "published", "archived"]);
export const answerRevealEnum = pgEnum("answer_reveal", ["immediate", "after_close"]);
export const bonusConditionEnum = pgEnum("bonus_condition", ["completion", "perfect"]);
export const questionTypeEnum = pgEnum("question_type", [
  "multiple_choice",
  "multiple_answer",
  "true_false",
  "short_answer",
]);
export const difficultyEnum = pgEnum("difficulty", ["easy", "medium", "hard"]);
export const reviewStatusEnum = pgEnum("review_status", ["auto", "pending", "approved", "rejected"]);
export const submissionStatusEnum = pgEnum("submission_status", ["graded", "pending_review"]);
export const pointCategoryEnum = pgEnum("point_category", [
  "quiz_correct",
  "quiz_participation",
  "quiz_completion",
  "quiz_perfect",
  "quiz_bonus",
  "streak_bonus",
  "achievement",
  "admin_adjustment",
  "reversal",
]);

const timestamps = {
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
};

/* ------------------------------------------------------------------ */
/* Users & auth                                                        */
/* ------------------------------------------------------------------ */

/**
 * Deliberately minimal: these are minors. No email, phone, birth date,
 * school or surname is collected. `displayName` is the only name ever
 * shown to other students.
 */
export const users = pgTable(
  "users",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    username: text("username").notNull(),
    displayName: text("display_name").notNull(),
    passwordHash: text("password_hash").notNull(),
    role: roleEnum("role").notNull().default("student"),
    isActive: boolean("is_active").notNull().default(true),
    mustChangePassword: boolean("must_change_password").notNull().default(false),
    totpSecret: text("totp_secret"),
    totpEnabled: boolean("totp_enabled").notNull().default(false),
    lastLoginAt: timestamp("last_login_at", { withTimezone: true }),
    deactivatedAt: timestamp("deactivated_at", { withTimezone: true }),
    ...timestamps,
  },
  (t) => [
    uniqueIndex("users_username_lower_idx").on(sql`lower(${t.username})`),
    index("users_role_active_idx").on(t.role, t.isActive),
  ],
);

export const sessions = pgTable(
  "sessions",
  {
    /** SHA-256 of the session token. The raw token only ever lives in the cookie. */
    id: text("id").primaryKey(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    mfaPending: boolean("mfa_pending").notNull().default(false),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    lastSeenAt: timestamp("last_seen_at", { withTimezone: true }).notNull().defaultNow(),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
  },
  (t) => [index("sessions_user_idx").on(t.userId)],
);

export const loginAttempts = pgTable(
  "login_attempts",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    /** e.g. "user:mark" or "ip:1.2.3.4" or "totp:<userId>" */
    key: text("key").notNull(),
    success: boolean("success").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index("login_attempts_key_time_idx").on(t.key, t.createdAt)],
);

/* ------------------------------------------------------------------ */
/* Settings                                                            */
/* ------------------------------------------------------------------ */

export const settings = pgTable("settings", {
  key: text("key").primaryKey(),
  value: jsonb("value").notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  updatedBy: uuid("updated_by").references(() => users.id),
});

/* ------------------------------------------------------------------ */
/* Seasons                                                             */
/* ------------------------------------------------------------------ */

export const seasons = pgTable(
  "seasons",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    name: text("name").notNull(),
    description: text("description").notNull().default(""),
    startsOn: date("starts_on").notNull(),
    endsOn: date("ends_on").notNull(),
    isActive: boolean("is_active").notNull().default(true),
    finalizedAt: timestamp("finalized_at", { withTimezone: true }),
    ...timestamps,
  },
  (t) => [check("seasons_dates_chk", sql`${t.endsOn} >= ${t.startsOn}`)],
);

export const seasonParticipants = pgTable(
  "season_participants",
  {
    seasonId: uuid("season_id")
      .notNull()
      .references(() => seasons.id, { onDelete: "cascade" }),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id),
    joinedAt: timestamp("joined_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [primaryKey({ columns: [t.seasonId, t.userId] })],
);

/* ------------------------------------------------------------------ */
/* Question bank                                                       */
/* ------------------------------------------------------------------ */

export const questions = pgTable(
  "questions",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    type: questionTypeEnum("type").notNull(),
    prompt: text("prompt").notNull(),
    explanation: text("explanation").notNull().default(""),
    points: integer("points").notNull().default(10),
    acceptedAnswers: text("accepted_answers").array().notNull().default(sql`'{}'::text[]`),
    caseSensitive: boolean("case_sensitive").notNull().default(false),
    manualReview: boolean("manual_review").notNull().default(false),
    book: text("book"),
    chapter: integer("chapter"),
    verses: text("verses"),
    topic: text("topic"),
    difficulty: difficultyEnum("difficulty"),
    createdBy: uuid("created_by").references(() => users.id),
    archivedAt: timestamp("archived_at", { withTimezone: true }),
    ...timestamps,
  },
  (t) => [
    index("questions_book_chapter_idx").on(t.book, t.chapter),
    index("questions_topic_idx").on(t.topic),
  ],
);

export const questionOptions = pgTable(
  "question_options",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    questionId: uuid("question_id")
      .notNull()
      .references(() => questions.id, { onDelete: "cascade" }),
    label: text("label").notNull(),
    isCorrect: boolean("is_correct").notNull().default(false),
    position: integer("position").notNull(),
  },
  (t) => [index("question_options_q_idx").on(t.questionId)],
);

/* ------------------------------------------------------------------ */
/* Quizzes                                                             */
/* ------------------------------------------------------------------ */

export const quizzes = pgTable(
  "quizzes",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    title: text("title").notNull(),
    passage: text("passage").notNull().default(""),
    topic: text("topic").notNull().default(""),
    /** Study material / lesson notes shown to students before and during the quiz. */
    studyNotes: text("study_notes").notNull().default(""),
    quizDate: date("quiz_date").notNull(),
    opensAt: timestamp("opens_at", { withTimezone: true }).notNull(),
    closesAt: timestamp("closes_at", { withTimezone: true }).notNull(),
    status: quizStatusEnum("status").notNull().default("draft"),
    answerReveal: answerRevealEnum("answer_reveal").notNull().default("immediate"),
    bonusPoints: integer("bonus_points").notNull().default(0),
    bonusCondition: bonusConditionEnum("bonus_condition").notNull().default("perfect"),
    countsForStreak: boolean("counts_for_streak").notNull().default(true),
    publishedAt: timestamp("published_at", { withTimezone: true }),
    createdBy: uuid("created_by").references(() => users.id),
    ...timestamps,
  },
  (t) => [
    index("quizzes_date_idx").on(t.quizDate),
    index("quizzes_status_open_idx").on(t.status, t.opensAt),
    check("quizzes_window_chk", sql`${t.closesAt} > ${t.opensAt}`),
    check("quizzes_bonus_chk", sql`${t.bonusPoints} >= 0`),
  ],
);

/**
 * Questions inside a quiz are snapshots. Reusing a bank question copies it,
 * so later bank edits never rewrite what a student was actually asked.
 */
export const quizQuestions = pgTable(
  "quiz_questions",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    quizId: uuid("quiz_id")
      .notNull()
      .references(() => quizzes.id, { onDelete: "cascade" }),
    sourceQuestionId: uuid("source_question_id").references(() => questions.id, { onDelete: "set null" }),
    position: integer("position").notNull(),
    type: questionTypeEnum("type").notNull(),
    prompt: text("prompt").notNull(),
    explanation: text("explanation").notNull().default(""),
    points: integer("points").notNull().default(10),
    acceptedAnswers: text("accepted_answers").array().notNull().default(sql`'{}'::text[]`),
    caseSensitive: boolean("case_sensitive").notNull().default(false),
    manualReview: boolean("manual_review").notNull().default(false),
  },
  (t) => [
    index("quiz_questions_quiz_idx").on(t.quizId),
    check("quiz_questions_points_chk", sql`${t.points} >= 0`),
  ],
);

export const quizQuestionOptions = pgTable(
  "quiz_question_options",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    quizQuestionId: uuid("quiz_question_id")
      .notNull()
      .references(() => quizQuestions.id, { onDelete: "cascade" }),
    label: text("label").notNull(),
    isCorrect: boolean("is_correct").notNull().default(false),
    position: integer("position").notNull(),
  },
  (t) => [index("quiz_question_options_q_idx").on(t.quizQuestionId)],
);

/* ------------------------------------------------------------------ */
/* Submissions                                                         */
/* ------------------------------------------------------------------ */

export const submissions = pgTable(
  "submissions",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    quizId: uuid("quiz_id")
      .notNull()
      .references(() => quizzes.id),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id),
    status: submissionStatusEnum("status").notNull().default("graded"),
    submittedAt: timestamp("submitted_at", { withTimezone: true }).notNull().defaultNow(),
    scorePoints: integer("score_points").notNull().default(0),
    maxPoints: integer("max_points").notNull().default(0),
    correctCount: integer("correct_count").notNull().default(0),
    answeredCount: integer("answered_count").notNull().default(0),
    questionCount: integer("question_count").notNull().default(0),
    /** Set by staff to let a student revise this submission once. */
    editAllowed: boolean("edit_allowed").notNull().default(false),
    revisionCount: integer("revision_count").notNull().default(0),
    /** Point rules in force when first graded; regrades reuse these. */
    awardRules: jsonb("award_rules")
      .$type<{ participation: number; completion: number; perfect: number }>()
      .notNull(),
    ...timestamps,
  },
  (t) => [
    // One submission per student per quiz, enforced by the database.
    uniqueIndex("submissions_quiz_user_idx").on(t.quizId, t.userId),
    index("submissions_user_idx").on(t.userId, t.submittedAt),
  ],
);

export const submissionAnswers = pgTable(
  "submission_answers",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    submissionId: uuid("submission_id")
      .notNull()
      .references(() => submissions.id, { onDelete: "cascade" }),
    quizQuestionId: uuid("quiz_question_id")
      .notNull()
      .references(() => quizQuestions.id),
    selectedOptionIds: uuid("selected_option_ids").array().notNull().default(sql`'{}'::uuid[]`),
    textAnswer: text("text_answer"),
    /** null while a short answer is waiting for manual review */
    isCorrect: boolean("is_correct"),
    reviewStatus: reviewStatusEnum("review_status").notNull().default("auto"),
    pointsAwarded: integer("points_awarded").notNull().default(0),
    reviewedBy: uuid("reviewed_by").references(() => users.id),
    reviewedAt: timestamp("reviewed_at", { withTimezone: true }),
  },
  (t) => [uniqueIndex("submission_answers_unique_idx").on(t.submissionId, t.quizQuestionId)],
);

/* ------------------------------------------------------------------ */
/* Points ledger                                                       */
/* ------------------------------------------------------------------ */

/**
 * Append-only. A database trigger rejects UPDATE and DELETE, so balances can
 * only change by inserting a new, attributed row. Totals are SUM(amount).
 */
export const pointTransactions = pgTable(
  "point_transactions",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id),
    amount: integer("amount").notNull(),
    category: pointCategoryEnum("category").notNull(),
    description: text("description").notNull(),
    /** Groups rows that belong to one logical award, e.g. "quiz:<id>:perfect". */
    sourceKey: text("source_key"),
    quizId: uuid("quiz_id").references(() => quizzes.id),
    submissionId: uuid("submission_id").references(() => submissions.id),
    reversesId: uuid("reverses_id"),
    note: text("note"),
    createdBy: uuid("created_by").references(() => users.id),
    /** When the points "count" for weekly/monthly/season leaderboards. */
    effectiveAt: timestamp("effective_at", { withTimezone: true }).notNull().defaultNow(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    index("point_tx_user_effective_idx").on(t.userId, t.effectiveAt),
    index("point_tx_effective_idx").on(t.effectiveAt),
    index("point_tx_source_idx").on(t.userId, t.sourceKey),
    // A row can be reversed at most once.
    uniqueIndex("point_tx_reverses_idx").on(t.reversesId),
    check("point_tx_nonzero_chk", sql`${t.amount} <> 0`),
  ],
);

/* ------------------------------------------------------------------ */
/* Achievements                                                        */
/* ------------------------------------------------------------------ */

export type AchievementCriteria =
  | { type: "quizzes_completed"; threshold: number }
  | { type: "perfect_quizzes"; threshold: number }
  | { type: "streak"; threshold: number }
  | { type: "total_points"; threshold: number }
  | { type: "season_rank"; threshold: number }
  | { type: "manual" };

export const achievements = pgTable("achievements", {
  id: uuid("id").primaryKey().defaultRandom(),
  key: text("key").notNull().unique(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  icon: text("icon").notNull().default("star"),
  criteria: jsonb("criteria").$type<AchievementCriteria>().notNull(),
  pointsReward: integer("points_reward").notNull().default(0),
  isActive: boolean("is_active").notNull().default(true),
  position: integer("position").notNull().default(0),
  ...timestamps,
});

export const userAchievements = pgTable(
  "user_achievements",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id),
    achievementId: uuid("achievement_id")
      .notNull()
      .references(() => achievements.id, { onDelete: "cascade" }),
    /** "" for one-time achievements, "season:<id>" for per-season ones. */
    contextKey: text("context_key").notNull().default(""),
    note: text("note"),
    awardedBy: uuid("awarded_by").references(() => users.id),
    awardedAt: timestamp("awarded_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [uniqueIndex("user_achievements_unique_idx").on(t.userId, t.achievementId, t.contextKey)],
);

/* ------------------------------------------------------------------ */
/* Audit log                                                           */
/* ------------------------------------------------------------------ */

export const auditLog = pgTable(
  "audit_log",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    actorId: uuid("actor_id").references(() => users.id),
    action: text("action").notNull(),
    targetType: text("target_type"),
    targetId: text("target_id"),
    details: jsonb("details").$type<Record<string, unknown>>().notNull().default({}),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index("audit_log_time_idx").on(t.createdAt), index("audit_log_target_idx").on(t.targetId)],
);

/* ------------------------------------------------------------------ */
/* Relations                                                           */
/* ------------------------------------------------------------------ */

export const quizzesRelations = relations(quizzes, ({ many }) => ({
  questions: many(quizQuestions),
  submissions: many(submissions),
}));

export const quizQuestionsRelations = relations(quizQuestions, ({ one, many }) => ({
  quiz: one(quizzes, { fields: [quizQuestions.quizId], references: [quizzes.id] }),
  options: many(quizQuestionOptions),
}));

export const quizQuestionOptionsRelations = relations(quizQuestionOptions, ({ one }) => ({
  question: one(quizQuestions, {
    fields: [quizQuestionOptions.quizQuestionId],
    references: [quizQuestions.id],
  }),
}));

export const questionsRelations = relations(questions, ({ many }) => ({
  options: many(questionOptions),
}));

export const questionOptionsRelations = relations(questionOptions, ({ one }) => ({
  question: one(questions, { fields: [questionOptions.questionId], references: [questions.id] }),
}));

export const submissionsRelations = relations(submissions, ({ one, many }) => ({
  quiz: one(quizzes, { fields: [submissions.quizId], references: [quizzes.id] }),
  user: one(users, { fields: [submissions.userId], references: [users.id] }),
  answers: many(submissionAnswers),
}));

export const submissionAnswersRelations = relations(submissionAnswers, ({ one }) => ({
  submission: one(submissions, {
    fields: [submissionAnswers.submissionId],
    references: [submissions.id],
  }),
  question: one(quizQuestions, {
    fields: [submissionAnswers.quizQuestionId],
    references: [quizQuestions.id],
  }),
}));

export type User = typeof users.$inferSelect;
export type Role = (typeof roleEnum.enumValues)[number];
export type Quiz = typeof quizzes.$inferSelect;
export type QuizQuestion = typeof quizQuestions.$inferSelect;
export type QuizQuestionOption = typeof quizQuestionOptions.$inferSelect;
export type QuestionType = (typeof questionTypeEnum.enumValues)[number];
export type PointCategory = (typeof pointCategoryEnum.enumValues)[number];
export type Achievement = typeof achievements.$inferSelect;
