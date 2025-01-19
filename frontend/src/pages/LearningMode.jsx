import React, { useEffect, useState } from "react";

const LearningMode = ({ testId, setMode, setSelectedTest }) => {
    const [questions, setQuestions] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [inputValue, setInputValue] = useState("");
    const [progress, setProgress] = useState([]);
    const [showAnswer, setShowAnswer] = useState(false);
    const [isCorrect, setIsCorrect] = useState(null);
    const [currentTurnCount, setCurrentTurnCount] = useState(0);
    const [endOfTurn, setEndOfTurn] = useState(false);
    const [loading, setLoading] = useState(true);

    // Fetch test questions from the backend
    useEffect(() => {
        const fetchQuestions = async () => {
            try {
                const response = await fetch(`http://localhost:4000/api/tests/${testId}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`, // Optional: token-based authentication
                    },
                });

                if (!response.ok) {
                    throw new Error("Failed to fetch test questions.");
                }

                const data = await response.json();
                setQuestions(data.questions);
                setProgress(data.questions.map(() => 0)); // Initialize progress for each question
                setLoading(false);
            } catch (error) {
                console.error("Error fetching test questions:", error);
                setMode(null);
                setSelectedTest(null);
            }
        };

        fetchQuestions();
    }, [testId, setMode, setSelectedTest]);

    // Update progress on the backend
    const updateProgressOnBackend = async (updatedProgress) => {
        try {
            await fetch("http://localhost:4000/api/progress", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
                body: JSON.stringify({
                    testId,
                    progress: updatedProgress,
                }),
            });
        } catch (error) {
            console.error("Error updating progress on backend:", error);
        }
    };

    const handleSubmit = () => {
        if (inputValue.trim().toLowerCase() === questions[currentIndex].answer.toLowerCase()) {
            setProgress((prevProgress) => {
                const updatedProgress = [...prevProgress];
                updatedProgress[currentIndex] += 1;
                updateProgressOnBackend(updatedProgress); // Save progress to backend
                return updatedProgress;
            });
            setIsCorrect(true);
        } else {
            setProgress((prevProgress) => {
                const updatedProgress = [...prevProgress];
                updatedProgress[currentIndex] = 0; // Reset progress for incorrect answers
                updateProgressOnBackend(updatedProgress); // Save progress to backend
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

        let nextIndex = (currentIndex + 1) % questions.length;
        while (progress[nextIndex] >= 2) {
            nextIndex = (nextIndex + 1) % questions.length;
            if (nextIndex === currentIndex) break; // Prevent infinite loop if all questions are completed
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

    if (loading) {
        return (
            <div className="bg-[#0f172a] min-h-screen flex items-center justify-center text-white">
                <h1 className="text-2xl">Loading questions...</h1>
            </div>
        );
    }

    const completedQuestions = progress.filter((p) => p >= 2).length;
    const allQuestionsCompleted = completedQuestions === questions.length;

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
                    <button className="form-button" onClick={handleEndTurn}>
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
                <h2 className="text-2xl font-bold mb-4">{`Question ${currentIndex + 1}/${questions.length}`}</h2>
                <p className="text-lg mb-6">{questions[currentIndex].question}</p>
                {showAnswer && (
                    <div className={`p-4 rounded-lg mb-4 ${isCorrect ? "bg-green-700" : "bg-red-700"}`}>
                        <p className="font-bold">{isCorrect ? "Correct Answer:" : "Wrong Answer:"}</p>
                        <p>{questions[currentIndex].answer}</p>
                        {!isCorrect && <p className="text-yellow-300 mt-2">Correct Answer is: {questions[currentIndex].answer}</p>}
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

            <p className="text-gray-400 mt-4">Progress for Current Question: {progress[currentIndex]}/2</p>
        </div>
    );
};

export default LearningMode;
