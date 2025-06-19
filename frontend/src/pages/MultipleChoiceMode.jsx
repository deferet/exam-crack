import React, { useState, useEffect } from "react";

const MultipleChoiceMode = ({ test, setMode, setSelectedTest }) => {
  // ----------------------
  // Local state for quiz flow
  // ----------------------
  const [questions, setQuestions] = useState([]);      // formatted list of Q + options
  const [currentIndex, setCurrentIndex] = useState(0); // which question we’re on
  const [selectedOption, setSelectedOption] = useState(null);
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);

  // ----------------------
  // On mount: prepare questions with real answers
  // ----------------------
  useEffect(() => {
    // shuffle full question list
    const shuffled = [...test.questions].sort(() => Math.random() - 0.5);
    // take up to 10
    const limited = shuffled.slice(0, Math.min(10, shuffled.length));

    // build options array for each question
    const formatted = limited.map((q) => {
      const correct = q.answers.find((a) => a.correct).content;
      // collect wrong answers
      const wrongs = q.answers.filter((a) => !a.correct).map((a) => a.content);
      // if fewer than 3, pull extras from other questions
      const pool = test.questions
        .map((tq) => tq.answers.find((a) => a.correct).content)
        .filter((c) => c !== correct);
      while (wrongs.length < 3) {
        const pick = pool[Math.floor(Math.random() * pool.length)];
        if (pick && !wrongs.includes(pick)) wrongs.push(pick);
      }
      // shuffle the four options
      const options = shuffle([correct, ...wrongs]);
      return { question: q.question, correctAnswer: correct, options };
    });

    setQuestions(formatted);
  }, [test]);

  // ----------------------
  // Utility: Fisher–Yates shuffle
  // ----------------------
  const shuffle = (arr) => {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  };

  // ----------------------
  // Handler: pick an option
  // ----------------------
  const handleSelect = (opt) => {
    setSelectedOption(opt);
    setShowResults(true);
    if (opt === questions[currentIndex].correctAnswer) {
      setScore((s) => s + 1);
    }
  };

  // ----------------------
  // Handler: next or finish
  // ----------------------
  const handleNext = () => {
    setSelectedOption(null);
    setShowResults(false);
    setCurrentIndex((i) => i + 1);
  };

  // nothing yet?
  if (!questions.length) return null;

  // quiz finished?
  if (currentIndex >= questions.length) {
    return (
      <div className="bg-[#0f172a] min-h-screen flex flex-col items-center justify-center p-6 text-white">
        <h1 className="text-3xl font-bold mb-4">Test Finished!</h1>
        <p className="text-xl mb-4">
          Your score: {score} / {questions.length}
        </p>
        <button
          className="form-button"
          onClick={() => {
            setMode(null);
            setSelectedTest(null);
          }}
        >
          Back to Tests
        </button>
      </div>
    );
  }

  const current = questions[currentIndex];

  // ----------------------
  // Render current question
  // ----------------------
  return (
    <div className="bg-[#0f172a] min-h-screen flex flex-col items-center justify-center p-6 text-white">
      <div className="w-full max-w-xl">
        <h2 className="text-2xl font-bold mb-4">
          Question {currentIndex + 1}
        </h2>
        <p className="mb-6">{current.question}</p>
        <div className="space-y-4">
          {current.options.map((opt, i) => {
            let classes = "w-full p-4 rounded text-left border transition ";
            if (showResults) {
              if (opt === current.correctAnswer) {
                classes += "bg-green-500 border-green-500 text-white";
              } else if (opt === selectedOption) {
                classes += "bg-red-500 border-red-500 text-white";
              } else {
                classes += "bg-gray-800 border-gray-600 text-white";
              }
            } else {
              classes += "bg-gray-800 border-gray-600 hover:bg-blue-500 hover:border-blue-500 hover:text-white";
            }
            return (
              <button
                key={i}
                disabled={showResults}
                className={classes}
                onClick={() => handleSelect(opt)}
              >
                {opt}
              </button>
            );
          })}
        </div>
        {showResults && (
          <button className="form-button mt-6" onClick={handleNext}>
            {currentIndex + 1 === questions.length ? "See Results" : "Next"}
          </button>
        )}
      </div>
    </div>
  );
};

export default MultipleChoiceMode;
