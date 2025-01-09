import React, { useState } from "react";

const SolveTest = ({ test, setMode, setSelectedTest }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [inputValue, setInputValue] = useState("");
    const [correctAnswers, setCorrectAnswers] = useState(0);
    const [showResult, setShowResult] = useState(false);

    const handleSubmit = () => {
        if (inputValue.trim().toLowerCase() === test.questions[currentIndex].answer.toLowerCase()) {
            setCorrectAnswers((prev) => prev + 1);
        }

        if (currentIndex + 1 < test.questions.length) {
            setCurrentIndex((prev) => prev + 1);
            setInputValue("");
        } else {
            setShowResult(true);
        }
    };

    const handleBackToTests = () => {
        setMode(null);
        setSelectedTest(null);
    };
    //added showing scrore after solving test in %
    if (showResult) {
        const scorePercentage = Math.round((correctAnswers / test.questions.length) * 100);

        return (
            <div className="bg-[#0f172a] min-h-screen flex flex-col items-center py-12 px-6 text-white">
                <h1 className="text-4xl font-bold mb-8">Test Results</h1>
                <p className="text-xl mb-4">You answered {correctAnswers} out of {test.questions.length} questions correctly.</p>
                <p className="text-xl font-bold mb-8">Your score: {scorePercentage}%</p>
                <button
                    className="form-button mt-4"
                    onClick={handleBackToTests}
                >
                    Back to My Tests
                </button>
            </div>
        );
    }
    // Display the current question and input field
    return (
        <div className="bg-[#0f172a] min-h-screen flex flex-col items-center py-12 px-6 text-white">
            <h1 className="text-4xl font-bold mb-8">Solve Test</h1>
            <div className="bg-[#1e293b] p-8 rounded-lg shadow-md max-w-md w-full">
                <h2 className="text-2xl font-bold mb-4">Question {currentIndex + 1} of {test.questions.length}</h2>
                <p className="text-lg mb-6">{test.questions[currentIndex].question}</p>
                <input
                    type="text"
                    className="form-input mb-4 w-full"
                    placeholder="Your answer"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                />
                <button className="form-button w-full" onClick={handleSubmit}>
                    {currentIndex + 1 === test.questions.length ? "Finish Test" : "Next Question"}
                </button>
            </div>
        </div>
    );
};

export default SolveTest;
