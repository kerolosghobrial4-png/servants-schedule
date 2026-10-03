import { describe, expect, it } from "vitest";
import { desiredQuizAwards, gradeAnswer, normalizeShortAnswer, summarize, type GradableQuestion } from "@/server/grading";

const mcq: GradableQuestion = {
  id: "q1",
  type: "multiple_choice",
  points: 10,
  acceptedAnswers: [],
  caseSensitive: false,
  manualReview: false,
  options: [
    { id: "a", isCorrect: false },
    { id: "b", isCorrect: true },
  ],
};

describe("grading", () => {
  it("grades multiple choice", () => {
    expect(gradeAnswer(mcq, { selectedOptionIds: ["b"], textAnswer: null })).toMatchObject({ isCorrect: true, pointsAwarded: 10 });
    expect(gradeAnswer(mcq, { selectedOptionIds: ["a"], textAnswer: null })).toMatchObject({ isCorrect: false, pointsAwarded: 0 });
    // Selecting every option must not be a way to guarantee a correct answer.
    expect(gradeAnswer(mcq, { selectedOptionIds: ["a", "b"], textAnswer: null }).isCorrect).toBe(false);
    expect(gradeAnswer(mcq, undefined)).toMatchObject({ answered: false, pointsAwarded: 0 });
  });

  it("grades multiple answer as all-or-nothing", () => {
    const q: GradableQuestion = {
      ...mcq,
      type: "multiple_answer",
      options: [
        { id: "a", isCorrect: true },
        { id: "b", isCorrect: true },
        { id: "c", isCorrect: false },
      ],
    };
    expect(gradeAnswer(q, { selectedOptionIds: ["a", "b"], textAnswer: null }).isCorrect).toBe(true);
    expect(gradeAnswer(q, { selectedOptionIds: ["a"], textAnswer: null }).isCorrect).toBe(false);
    expect(gradeAnswer(q, { selectedOptionIds: ["a", "b", "c"], textAnswer: null }).isCorrect).toBe(false);
  });

  it("normalises short answers", () => {
    expect(normalizeShortAnswer("  St. Mark!  ")).toBe("st mark");
    expect(normalizeShortAnswer("Children   of God")).toBe("children of god");
    expect(normalizeShortAnswer("“Peter”")).toBe("peter");
    expect(normalizeShortAnswer("Peter", true)).toBe("Peter");
  });

  it("only auto-awards short answers that match an accepted answer", () => {
    const q: GradableQuestion = { ...mcq, type: "short_answer", options: [], acceptedAnswers: ["Moses", "Moshe"] };
    expect(gradeAnswer(q, { selectedOptionIds: [], textAnswer: "moses" }).isCorrect).toBe(true);
    expect(gradeAnswer(q, { selectedOptionIds: [], textAnswer: "MOSHE." }).isCorrect).toBe(true);
    expect(gradeAnswer(q, { selectedOptionIds: [], textAnswer: "Mosses" })).toMatchObject({ isCorrect: false, reviewStatus: "auto" });
    const review = { ...q, manualReview: true };
    expect(gradeAnswer(review, { selectedOptionIds: [], textAnswer: "Mosses" })).toMatchObject({
      isCorrect: null,
      reviewStatus: "pending",
      pointsAwarded: 0,
    });
    expect(gradeAnswer(q, { selectedOptionIds: [], textAnswer: "   " }).answered).toBe(false);
  });

  it("computes desired awards", () => {
    const qs = [{ points: 10 }, { points: 10 }];
    const perfect = summarize(qs, [
      { answered: true, isCorrect: true, pointsAwarded: 10 },
      { answered: true, isCorrect: true, pointsAwarded: 10 },
    ]);
    const rules = { participation: 5, completion: 10, perfect: 20 };
    expect(desiredQuizAwards(perfect, rules, { points: 15, condition: "perfect" }).map((a) => a.amount)).toEqual([5, 20, 10, 20, 15]);

    const pending = summarize(qs, [
      { answered: true, isCorrect: true, pointsAwarded: 10 },
      { answered: true, isCorrect: null, pointsAwarded: 0 },
    ]);
    expect(pending.perfect).toBe(false);
    expect(pending.pendingCount).toBe(1);
  });
});
