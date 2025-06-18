import React, { useState, useEffect } from "react";

const MultipleChoiceMode = ({ test, setMode, setSelectedTest }) => {
  // ----------------------
  // Local state for quiz
  // ----------------------
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showCorrect, setShowCorrect] = useState(false);
  const [score, setScore] = useState(0);

  // ----------------------
  // On mount: prepare  test questions
  // ----------------------
  useEffect(() => {
    // shuffle entire question list
    const shuffled = [...test.questions].sort(() => 0.5 - Math.random());
    // limit to 10 or total count
    const limited = shuffled.slice(0, Math.min(10, test.questions.length));

    // format each question with its options array
    const formatted = limited.map((q) => {
      // use provided wrongAnswers if available, otherwise pick random distractors
      const distractors =
        Array.isArray(q.wrongAnswers) && q.wrongAnswers.length > 0
          ? q.wrongAnswers
          : getRandomAnswers(q.answer, test.questions);

      return {
        question: q.question,
        correctAnswer: q.answer,
        options: shuffle([q.answer, ...distractors]),
      };
    });
    setQuestions(formatted);
  }, [test]);

  // ----------------------
  // Helpers: random picks
  // ----------------------
  const getRandomAnswers = (correct, allQs) => {
    const pool = allQs.map((q) => q.answer).filter((a) => a !== correct);
    return pool.sort(() => 0.5 - Math.random()).slice(0, 3);
  };
  const shuffle = (arr) => [...arr].sort(() => Math.random() - 0.5);

  // ----------------------
  // Handlers: answering flow
  // ----------------------
  const handleAnswer = (opt) => {
    setSelectedAnswer(opt);
    setShowCorrect(true);
    if (opt === questions[currentIndex].correctAnswer) {
      setScore((s) => s + 1);
    }
  };
  const handleNext = () => {
    setSelectedAnswer(null);
    setShowCorrect(false);
    setCurrentIndex((i) => i + 1);
  };

  if (!questions.length) return null;
  const current = questions[currentIndex];

  // ----------------------
  // Render quiz or results
  // ----------------------
  return (
    <div className="bg-[#0f172a] text-white min-h-screen flex flex-col items-center justify-center p-6">
      {currentIndex >= questions.length ? (
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-6">Test Finished!</h1>
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
      ) : (
        <div className="w-full max-w-xl">
          <h2 className="text-2xl font-bold mb-4">
            Question {currentIndex + 1}
          </h2>
          <p className="mb-6">{current.question}</p>
          <div className="space-y-4">
            {current.options.map((opt, i) => (
              <button
                key={i}
                disabled={!!selectedAnswer}
                onClick={() => handleAnswer(opt)}
                className={`w-full p-4 rounded text-left border transition ${
                  selectedAnswer
                    ? opt === current.correctAnswer
                      ? "bg-green-500 border-green-500 text-white"
                      : opt === selectedAnswer
                      ? "bg-red-500 border-red-500 text-white"
                      : "bg-gray-800 border-gray-600 text-white"
                    : "bg-gray-800 border-gray-600 hover:bg-blue-500 hover:border-blue-500 hover:text-white"
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
          {showCorrect && (
            <button className="form-button mt-6" onClick={handleNext}>
              Next
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default MultipleChoiceMode;
