import React, { useState, useEffect } from "react";

const MultipleChoiceMode = ({ test, setMode, setSelectedTest }) => {
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showCorrect, setShowCorrect] = useState(false);
  const [score, setScore] = useState(0);

  useEffect(() => {
    const shuffled = [...test.questions].sort(() => 0.5 - Math.random());
    const limited = shuffled.slice(0, Math.min(10, test.questions.length));

    const formattedQuestions = limited.map((q) => {
      const allAnswers = [
        q.answer,
        ...getRandomAnswers(q.answer, test.questions)
      ];
      return {
        question: q.question,
        correctAnswer: q.answer,
        options: shuffle(allAnswers)
      };
    });
    setQuestions(formattedQuestions);
  }, [test]);

  const getRandomAnswers = (correct, allQuestions) => {
    const pool = allQuestions
      .map((q) => q.answer)
      .filter((a) => a !== correct);
    const shuffled = pool.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 3);
  };

  const shuffle = (array) => {
    return [...array].sort(() => Math.random() - 0.5);
  };

  const handleAnswer = (option) => {
    setSelectedAnswer(option);
    setShowCorrect(true);
    if (option === questions[currentIndex].correctAnswer) {
      setScore((prev) => prev + 1);
    }
  };

  const handleNext = () => {
    setSelectedAnswer(null);
    setShowCorrect(false);
    setCurrentIndex((prev) => prev + 1);
  };

  if (questions.length === 0) return null;
  const current = questions[currentIndex];

  return (
    <div className="bg-[#0f172a] text-white min-h-screen flex flex-col items-center justify-center p-6">
      {currentIndex >= questions.length ? (
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-6">Test Finished!</h1>
          <p className="text-xl mb-4">Your score: {score} / {questions.length}</p>
          <button
            onClick={() => {
              setMode(null);
              setSelectedTest(null);
            }}
            className="form-button"
          >
            Back to Tests
          </button>
        </div>
      ) : (
        <div className="w-full max-w-xl">
          <h2 className="text-2xl font-bold mb-4">Question {currentIndex + 1}</h2>
          <p className="mb-6">{current.question}</p>
          <div className="space-y-4">
            {current.options.map((option, index) => (
              <button
                key={index}
                className={`w-full p-4 rounded text-left border transition ${
                  selectedAnswer
                    ? option === current.correctAnswer
                      ? "bg-green-500 border-green-500 text-white"
                      : option === selectedAnswer
                      ? "bg-red-500 border-red-500 text-white"
                      : "bg-gray-800 border-gray-600 text-white"
                    : "bg-gray-800 border-gray-600 hover:bg-blue-500 hover:border-blue-500 hover:text-white"
                }`}
                disabled={!!selectedAnswer}
                onClick={() => handleAnswer(option)}
              >
                {option}
              </button>
            ))}
          </div>
          {showCorrect && (
            <button
              className="form-button mt-6"
              onClick={handleNext}
            >
              Next
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default MultipleChoiceMode;