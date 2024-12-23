import React, { useState, useEffect } from "react";

const LearningMode = ({ test, setMode, setSelectedTest }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [inputValue, setInputValue] = useState("");
    const [progress, setProgress] = useState(
        test.questions.map(() => 0) 
    );

    const [showAnswer, setShowAnswer] = useState(false);
    const [isCorrect, setIsCorrect] = useState(null);
    const [currentTurnCount, setCurrentTurnCount] = useState(0);
    const [endOfTurn, setEndOfTurn] = useState(false);

    useEffect(() => {
        if (test.questions.length < 4) {
            alert("A test must have at least 4 questions to start Learning Mode.");
            setMode(null);
            setSelectedTest(null);
        }
    }, [test, setMode, setSelectedTest]);

    useEffect(() => {
        const shuffledQuestions = [...test.questions].sort(() => Math.random() - 0.5);
        test.questions = shuffledQuestions;
    }, [test]);

    const handleSubmit = () => {
        if (inputValue.trim().toLowerCase() === test.questions[currentIndex].answer.toLowerCase()) {
            setProgress((prevProgress) => {
                const updatedProgress = [...prevProgress];
                updatedProgress[currentIndex] += 1;
                return updatedProgress;
            });
            setIsCorrect(true);
        } else {
            setProgress((prevProgress) => {
                const updatedProgress = [...prevProgress];
                updatedProgress[currentIndex] = 0; 
                return updatedProgress;
            });
            setIsCorrect(false);
        }
        setShowAnswer(true);
    };

    const handleNextQuestion = () => {
        setShowAnswer(false);
        setInputValue("");
        setIsCorrect(null);

        let nextIndex = (currentIndex + 1) % test.questions.length;
        while (progress[nextIndex] >= 2) {
            nextIndex = (nextIndex + 1) % test.questions.length;
            if (nextIndex === currentIndex) break; 
        }
        setCurrentIndex(nextIndex);
        setCurrentTurnCount((prevCount) => prevCount + 1);

        if ((currentTurnCount + 1) % 4 === 0) {
            setEndOfTurn(true);
        }
    };

    const handleEndTurn = () => {
        setEndOfTurn(false);
        setCurrentTurnCount(0);
    };

    const completedQuestions = progress.filter((p) => p >= 2).length;
    const allQuestionsCompleted = completedQuestions === test.questions.length;

    if (allQuestionsCompleted) {
        return (
            <div className="bg-[#0f172a] min-h-screen flex flex-col items-center py-12 px-6 text-white">
                <h1 className="text-4xl font-bold mb-8">Learning Mode</h1>
                <p className="text-xl">Congratulations! You have mastered all the questions in this test.</p>
                <button
                    className="form-button mt-8"
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

    if (endOfTurn) {
        return (
            <div className="bg-[#0f172a] min-h-screen flex flex-col items-center py-12 px-6 text-white">
                <h1 className="text-4xl font-bold mb-8">End of Turn</h1>
                <p className="text-xl mb-6">You have completed this turn of 4 questions.</p>
                <div className="flex gap-4">
                    <button
                        className="form-button"
                        onClick={handleEndTurn}
                    >
                        Keep Learning
                    </button>
                    <button
                        className="form-button"
                        onClick={() => {
                            setMode(null);
                            setSelectedTest(null);
                        }}
                    >
                        Back to My Tests
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-[#0f172a] min-h-screen flex flex-col items-center py-12 px-6 text-white">
            <h1 className="text-4xl font-bold mb-8">Learning Mode</h1>
            <div className="bg-[#1e293b] p-8 rounded-lg shadow-md max-w-md w-full">
                <h2 className="text-2xl font-bold mb-4">{`Question ${currentIndex + 1}/${test.questions.length}`}</h2>
                <p className="text-lg mb-6">{test.questions[currentIndex].question}</p>
                {showAnswer && (
                    <div className={`p-4 rounded-lg mb-4 ${isCorrect ? "bg-green-700" : "bg-red-700"}`}>
                        <p className="font-bold">{isCorrect ? "Correct Answer:" : "Wrong Answer:"}</p>
                        <p>{test.questions[currentIndex].answer}</p>
                        {!isCorrect && <p className="text-yellow-300 mt-2">Correct Answer is: {test.questions[currentIndex].answer}</p>}
                    </div>
                )}
                {!showAnswer && (
                    <input
                        type="text"
                        className="form-input mb-4 w-full"
                        placeholder="Your answer"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                    />
                )}
                {!showAnswer ? (
                    <button className="form-button w-full" onClick={handleSubmit}>
                        Submit Answer
                    </button>
                ) : (
                    <button className="form-button w-full" onClick={handleNextQuestion}>
                        Next Question
                    </button>
                )}
            </div>
            <p className="text-gray-400 mt-4">Progress: {completedQuestions}/{test.questions.length} completed</p>
        </div>
    );
};

export default LearningMode;