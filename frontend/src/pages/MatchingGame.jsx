import React, { useState, useEffect } from "react";

const MatchingGame = ({ test, setMode, setSelectedTest }) => {
  // State for shuffled lists, selections, matches and errors
  const [shuffledQuestions, setShuffledQuestions] = useState([]);
  const [shuffledAnswers, setShuffledAnswers] = useState([]);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [matchedPairs, setMatchedPairs] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");

  // Shuffle data on mount and validate question count
  useEffect(() => {
    if (test.questions.length < 4) {
      alert("Matching Game requires at least 4 questions.");
      setMode(null);
      setSelectedTest(null);
    } else {
      // Randomize questions and answers separately
      setShuffledQuestions(
        [...test.questions].sort(() => Math.random() - 0.5)
      );
      setShuffledAnswers(
        [...test.questions].sort(() => Math.random() - 0.5)
      );
    }
  }, [test, setMode, setSelectedTest]);

  // Handlers for selecting items
  const handleQuestionClick = (q) => {
    setSelectedQuestion(q);
    setErrorMessage("");
  };
  const handleAnswerClick = (a) => {
    setSelectedAnswer(a);
    setErrorMessage("");
  };

  // Check if selected pair matches
  const checkMatch = () => {
    if (selectedQuestion && selectedAnswer) {
      if (selectedQuestion.answer === selectedAnswer.answer) {
        // Record a correct match
        setMatchedPairs([...matchedPairs, selectedQuestion.question]);
        setSelectedQuestion(null);
        setSelectedAnswer(null);
      } else {
        // Show error on mismatch
        setErrorMessage("Incorrect match! Try again.");
      }
    }
  };

  // Utility to disable already matched items
  const isMatched = (item) =>
    matchedPairs.includes(item.question || item.answer);

  return (
    <div className="bg-[#0f172a] min-h-screen flex flex-col items-center py-12 px-6 text-white">
      <h1 className="text-4xl font-bold mb-8">Matching Game</h1>
      <div className="grid grid-cols-4 gap-6 w-full max-w-4xl">
        {/* Render shuffled questions */}
        {shuffledQuestions.map((q, i) => (
          <div
            key={i}
            className={`p-4 rounded-lg cursor-pointer text-center bg-blue-600 ${
              isMatched(q) ? "opacity-50 pointer-events-none" : ""
            } ${
              selectedQuestion === q ? "ring-4 ring-yellow-500" : ""
            }`}
            onClick={() => handleQuestionClick(q)}
          >
            {q.question}
          </div>
        ))}
        {/* Render shuffled answers */}
        {shuffledAnswers.map((a, i) => (
          <div
            key={i}
            className={`p-4 rounded-lg cursor-pointer text-center bg-green-600 ${
              isMatched(a) ? "opacity-50 pointer-events-none" : ""
            } ${
              selectedAnswer === a ? "ring-4 ring-yellow-500" : ""
            }`}
            onClick={() => handleAnswerClick(a)}
          >
            {a.answer}
          </div>
        ))}
      </div>

      {/* Controls and feedback */}
      <div className="mt-8 text-center">
        {errorMessage && <p className="text-red-500 mb-4">{errorMessage}</p>}
        <button
          className="form-button w-48"
          onClick={checkMatch}
          disabled={!selectedQuestion || !selectedAnswer}
        >
          Check Match
        </button>
        <button
          className="form-button w-48 mt-4"
          onClick={() => {
            setSelectedTest(null);
            setMode(null);
          }}
        >
          Back to My Tests
        </button>
      </div>

      {/* Completion message */}
      {matchedPairs.length === test.questions.length && (
        <div className="mt-12 text-center text-green-500 text-xl">
          🎉 Congratulations! You've matched all the pairs! 🎉
        </div>
      )}
    </div>
  );
};

export default MatchingGame;
