import React, { useState } from "react";

const SolveTest = ({ test, setMode, setSelectedTest }) => {
  // ----------------------
  // Local state
  // ----------------------
  const [currentIndex, setCurrentIndex] = useState(0);
  const [inputValue, setInputValue] = useState("");
  const [correctCount, setCorrectCount] = useState(0);
  const [showResult, setShowResult] = useState(false);

  // ----------------------
  // Handle form submit
  // ----------------------
  const handleSubmit = () => {
    // derive the correct answer from the answers array
    const correctAnswer = test.questions[currentIndex].answers.find(
      (a) => a.correct
    )?.content.trim().toLowerCase();

    if (inputValue.trim().toLowerCase() === correctAnswer) {
      setCorrectCount((c) => c + 1);
    }

    // advance or finish
    if (currentIndex + 1 < test.questions.length) {
      setCurrentIndex((i) => i + 1);
      setInputValue("");
    } else {
      setShowResult(true);
    }
  };

  // ----------------------
  // Return to test list
  // ----------------------
  const handleBack = () => {
    setMode(null);
    setSelectedTest(null);
  };

  // ----------------------
  // Render results screen
  // ----------------------
  if (showResult) {
    const percentage = Math.round(
      (correctCount / test.questions.length) * 100
    );

    return (
      <div className="bg-[#0f172a] min-h-screen flex flex-col items-center py-12 px-6 text-white">
        <h1 className="text-4xl font-bold mb-8">Test Results</h1>
        <p className="text-xl mb-4">
          You answered {correctCount} out of {test.questions.length} correctly.
        </p>
        <p className="text-xl font-bold mb-8">Score: {percentage}%</p>
        <button className="form-button mt-4" onClick={handleBack}>
          Back to My Tests
        </button>
      </div>
    );
  }

  // ----------------------
  // Render question form
  // ----------------------
  const current = test.questions[currentIndex];

  return (
    <div className="bg-[#0f172a] min-h-screen flex flex-col items-center py-12 px-6 text-white">
      <h1 className="text-4xl font-bold mb-8">Solve Test</h1>
      <div className="bg-[#1e293b] p-8 rounded-lg shadow-md max-w-md w-full">
        <h2 className="text-2xl font-bold mb-4">
          Question {currentIndex + 1} of {test.questions.length}
        </h2>
        <p className="text-lg mb-6">{current.question}</p>
        <input
          type="text"
          className="form-input mb-4 w-full"
          placeholder="Your answer"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />
        <button className="form-button w-full" onClick={handleSubmit}>
          {currentIndex + 1 === test.questions.length
            ? "Finish Test"
            : "Next Question"}
        </button>
      </div>
    </div>
  );
};

export default SolveTest;
