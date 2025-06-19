import React, { useState, useMemo } from "react";

const SolveTest = ({ test, setMode, setSelectedTest }) => {
  // ------------------------------------------------------------
  // 1) Normalise questions → { question, correctAnswer }
  // ------------------------------------------------------------
  const questions = useMemo(() => {
    return (test.questions || [])
      .map((q) => {
        let correct = "";

        // new format
        if (typeof q.answer === "string") correct = q.answer.trim();

        // legacy format
        if (!correct && Array.isArray(q.answers)) {
          const hit = q.answers.find((a) => a && a.correct);
          correct = hit ? String(hit.content).trim() : "";
        }

        return correct ? { question: q.question, correctAnswer: correct } : null;
      })
      .filter(Boolean);
  }, [test.questions]);

  // ------------------------------------------------------------
  // 2) Local state
  // ------------------------------------------------------------
  const [idx,   setIdx]   = useState(0);
  const [input, setInput] = useState("");
  const [log,   setLog]   = useState([]);          // array of {question, user, correct}
  const [stage, setStage] = useState("quiz");      // quiz | summary | review

  // ------------------------------------------------------------
  // 3) Bail-out if no valid questions
  // ------------------------------------------------------------
  if (!questions.length) {
    return (
      <ScreenWrapper>
        <p className="text-xl mb-6 text-center">
          This test contains no valid questions.
        </p>
        <BackButton {...{ setMode, setSelectedTest }} />
      </ScreenWrapper>
    );
  }

  // ------------------------------------------------------------
  // 4) Submit answer
  // ------------------------------------------------------------
  const handleSubmit = () => {
    const { question, correctAnswer } = questions[idx];
    const user = input.trim();
    const correct = correctAnswer.toLowerCase();
    const isRight = user.toLowerCase() === correct;

    // save attempt
    setLog((l) => [...l, { question, user, correctAnswer, isRight }]);

    if (idx + 1 < questions.length) {
      setIdx((i) => i + 1);
      setInput("");
    } else {
      setStage("summary");
    }
  };

  // ------------------------------------------------------------
  // 5) Stage: summary
  // ------------------------------------------------------------
  if (stage === "summary") {
    const rightCnt = log.filter((e) => e.isRight).length;
    const percent  = Math.round((rightCnt / questions.length) * 100);

    return (
      <ScreenWrapper>
        <h1 className="text-4xl font-bold mb-8">Test Results</h1>
        <p className="text-xl mb-4">
          You answered {rightCnt} out of {questions.length} correctly.
        </p>
        <p className="text-xl font-bold mb-8">Score: {percent}%</p>

        <div className="flex flex-col gap-4 w-full max-w-xs">
          <button className="form-button" onClick={() => setStage("review")}>
            Review answers
          </button>
          <BackButton {...{ setMode, setSelectedTest }} />
        </div>
      </ScreenWrapper>
    );
  }

  // ------------------------------------------------------------
  // 6) Stage: review
  // ------------------------------------------------------------
  if (stage === "review") {
    return (
      <ScreenWrapper>
        <h1 className="text-4xl font-bold mb-8">Review Answers</h1>

        <div className="w-full max-w-2xl space-y-6">
          {log.map((e, i) => (
            <div key={i} className="bg-[#1e293b] p-4 rounded-lg">
              <p className="font-semibold mb-2">
                Q{i + 1}. {e.question}
              </p>

              <p
                className={
                  e.isRight
                    ? "text-green-400"
                    : "text-red-400"
                }
              >
                Your answer: {e.user || <span className="italic">— blank —</span>}
              </p>

              {!e.isRight && (
                <p className="text-green-400">
                  Correct answer: {e.correctAnswer}
                </p>
              )}
            </div>
          ))}
        </div>

        <BackButton extraClass="mt-10" {...{ setMode, setSelectedTest }} />
      </ScreenWrapper>
    );
  }

  // ------------------------------------------------------------
  // 7) Stage: quiz (default)
  // ------------------------------------------------------------
  const cur = questions[idx];

  return (
    <ScreenWrapper>
      <h1 className="text-4xl font-bold mb-8">Solve Test</h1>

      <div className="bg-[#1e293b] p-8 rounded-lg shadow-md max-w-md w-full">
        <h2 className="text-2xl font-bold mb-4">
          Question {idx + 1} of {questions.length}
        </h2>

        <p className="text-lg mb-6">{cur.question}</p>

        <input
          type="text"
          className="form-input mb-4 w-full"
          placeholder="Your answer"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
        />

        <button className="form-button w-full" onClick={handleSubmit}>
          {idx + 1 === questions.length ? "Finish Test" : "Next Question"}
        </button>
      </div>
    </ScreenWrapper>
  );
};

export default SolveTest;

// ------------------------------------------------------------
// Small UI helpers
// ------------------------------------------------------------
const ScreenWrapper = ({ children }) => (
  <div className="bg-[#0f172a] min-h-screen flex flex-col items-center py-12 px-6 text-white">
    {children}
  </div>
);

const BackButton = ({ setMode, setSelectedTest, extraClass = "" }) => (
  <button
    className={`form-button ${extraClass}`}
    onClick={() => {
      setMode(null);
      setSelectedTest(null);
    }}
  >
    Back to My Tests
  </button>
);
