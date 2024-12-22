import React, { useState } from "react";

const SolveTest = ({ test, setMode, setSelectedTest }) => {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState([]);

    const handleNextQuestion = () => {
        if (currentQuestionIndex < test.questions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        } else {
            alert("Test completed!");
            setMode(null);
            setSelectedTest(null);
        }
    };

    return (
        <div className="bg-[#0f172a] min-h-screen flex flex-col items-center py-12 px-6 text-white">
            <div className="w-full max-w-lg bg-[#1e293b] p-6 rounded-lg text-white mt-16">
                <h2 className="text-2xl font-bold mb-4 text-center">
                    Question {currentQuestionIndex + 1}/{test.questions.length}
                </h2>
                <p className="mb-4 text-center">{test.questions[currentQuestionIndex].question}</p>
                <input
                    type="text"
                    className="form-input mb-4 w-full"
                    placeholder="Your answer"
                    value={answers[currentQuestionIndex] || ""}
                    onChange={(e) => {
                        const newAnswers = [...answers];
                        newAnswers[currentQuestionIndex] = e.target.value;
                        setAnswers(newAnswers);
                    }}
                />
                <button
                    className="form-button w-full"
                    onClick={handleNextQuestion}
                >
                    {currentQuestionIndex === test.questions.length - 1 ? "Finish" : "Next"}
                </button>
            </div>
        </div>
    );
};

export default SolveTest;
