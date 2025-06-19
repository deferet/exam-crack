import React, { useState, useEffect } from "react";

const LearningMode = ({ test, setMode, setSelectedTest }) => {
  // --- 1. local copy of questions (shuffled) -----------------
  const [questions] = useState(() =>
    [...test.questions].sort(() => Math.random() - 0.5)
  );

  // --- 2. UI states ------------------------------------------
  const [currentIndex, setCurrentIndex] = useState(0);
  const [inputValue, setInputValue] = useState("");
  const [progress, setProgress] = useState(questions.map(() => 0));
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(null);
  const [turnCount, setTurnCount] = useState(0);
  const [endOfTurn, setEndOfTurn] = useState(false);

  // --- 3. minimum 4 questions guard --------------------------
  useEffect(() => {
    if (questions.length < 4) {
      alert("Learning Mode requires at least 4 questions.");
      setMode(null);
      setSelectedTest(null);
    }
  }, [questions.length, setMode, setSelectedTest]);

  // --- 4. helper to find correct answer ----------------------
  const getCorrect = (q) => {
    if (typeof q.answer === "string" && q.answer.trim() !== "") {
      return q.answer;
    }
    if (Array.isArray(q.answers)) {
      const found = q.answers.find((a) => a.correct);
      return found ? found.content : "";
    }
    return "";
  };

  // --- 5. answer submission handler --------------------------
  const handleSubmit = () => {
    const correct = getCorrect(questions[currentIndex]).trim().toLowerCase();
    const userAns = inputValue.trim().toLowerCase();

    setProgress((prev) => {
      const next = [...prev];
      next[currentIndex] = userAns === correct ? prev[currentIndex] + 1 : 0;
      return next;
    });

    setIsCorrect(userAns === correct);
    setShowFeedback(true);
  };

  // --- 6. move to next question ------------------------------
  const handleNext = () => {
    setShowFeedback(false);
    setInputValue("");
    setIsCorrect(null);

    let next = (currentIndex + 1) % questions.length;
    while (progress[next] >= 2) {
      next = (next + 1) % questions.length;
      if (next === currentIndex) break; // all questions mastered
    }

    setCurrentIndex(next);
    setTurnCount((c) => c + 1);
    if ((turnCount + 1) % 4 === 0) setEndOfTurn(true);
  };

  const handleEndTurn = () => {
    setEndOfTurn(false);
    setTurnCount(0);
  };

  // --- 7. special states (mastered / end of turn) ------------
  const mastered = progress.filter((p) => p >= 2).length;

  if (mastered === questions.length) {
    return (
      <Wrapper>
        <h1 className="text-4xl font-bold mb-4">Learning Mode</h1>
        <p className="text-xl">All questions mastered! Great job!</p>
        <BackButton />
      </Wrapper>
    );
  }

  if (endOfTurn) {
    return (
      <Wrapper>
        <h1 className="text-4xl font-bold mb-4">Turn Complete</h1>
        <p className="text-lg mb-6">You’ve answered 4 questions this turn.</p>
        <div className="flex gap-4">
          <button className="form-button" onClick={handleEndTurn}>
            Continue Learning
          </button>
          <BackButton />
        </div>
      </Wrapper>
    );
  }

  // --- 8. main view ------------------------------------------
  const currentQ = questions[currentIndex];

  return (
    <Wrapper>
      <h1 className="text-4xl font-bold mb-4">Learning Mode</h1>

      <div className="bg-[#1e293b] p-6 rounded-lg w-full max-w-md">
        <h2 className="text-2xl mb-2">
          Question {currentIndex + 1} / {questions.length}
        </h2>

        <p className="text-lg mb-4">{currentQ.question}</p>

        {showFeedback ? (
          <div
            className={`p-4 rounded mb-4 ${
              isCorrect ? "bg-green-700" : "bg-red-700"
            }`}
          >
            <p className="font-bold">
              {isCorrect ? "Correct!" : "Incorrect"}
            </p>
            {!isCorrect && (
              <p className="mt-2">
                Answer:&nbsp;
                <span className="italic">{getCorrect(currentQ)}</span>
              </p>
            )}
          </div>
        ) : (
          <input
            type="text"
            className="form-input mb-4 w-full"
            placeholder="Type your answer..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
          />
        )}

        <button
          className="form-button w-full"
          onClick={showFeedback ? handleNext : handleSubmit}
        >
          {showFeedback ? "Next Question" : "Submit Answer"}
        </button>
      </div>

      <p className="text-gray-400 mt-4">
        Progress: {progress[currentIndex]} / 2
      </p>
    </Wrapper>
  );

  // --- 9. small helper components ----------------------------
  function Wrapper({ children }) {
    return (
      <div className="bg-[#0f172a] min-h-screen flex flex-col items-center text-white p-8">
        {children}
      </div>
    );
  }

  function BackButton() {
    return (
      <button
        className="form-button mt-6"
        onClick={() => {
          setMode(null);
          setSelectedTest(null);
        }}
      >
        Back to Tests
      </button>
    );
  }
};

export default LearningMode;
