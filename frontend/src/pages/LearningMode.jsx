import React, { useState, useEffect } from "react";

const LearningMode = ({ test, setMode, setSelectedTest }) => {
    // Index of the current question being displayed
    const [currentIndex, setCurrentIndex] = useState(0);
    // User input for the current question
    const [inputValue, setInputValue] = useState("");
    // Progress tracker: stores number of correct attempts per question
    const [progress, setProgress] = useState(
        test.questions.map(() => 0)
    );

    // Controls whether to show the answer feedback
    const [showAnswer, setShowAnswer] = useState(false);
    // Tracks if the last answer submission was correct
    const [isCorrect, setIsCorrect] = useState(null);
    // Counter for number of questions attempted in the current turn
    const [currentTurnCount, setCurrentTurnCount] = useState(0);
    // Flag to indicate end of a turn (after 4 questions)
    const [endOfTurn, setEndOfTurn] = useState(false);

    // Ensure there are at least 4 questions before starting
    useEffect(() => {
        if (test.questions.length < 4) {
            alert("A test must have at least 4 questions to start Learning Mode.");
            setMode(null);
            setSelectedTest(null);
        }
    }, [test, setMode, setSelectedTest]);

    // Shuffle questions once when component mounts
    useEffect(() => {
        const shuffledQuestions = [...test.questions].sort(() => Math.random() - 0.5);
        test.questions = shuffledQuestions;
    }, [test]);

    // Handle answer submission
    const handleSubmit = () => {
        const correctAnswer = test.questions[currentIndex].answer.toLowerCase();
        const userAnswer = inputValue.trim().toLowerCase();

        if (userAnswer === correctAnswer) {
            // Increment progress count on correct answer
            setProgress(prev => {
                const updated = [...prev];
                updated[currentIndex] += 1;
                return updated;
            });
            setIsCorrect(true);
        } else {
            // Reset progress on incorrect answer
            setProgress(prev => {
                const updated = [...prev];
                updated[currentIndex] = 0;
                return updated;
            });
            setIsCorrect(false);
        }

        // Show feedback after submission
        setShowAnswer(true);
    };

    // Advance to the next question
    const handleNextQuestion = () => {
        // Reset input and feedback states
        setShowAnswer(false);
        setInputValue("");
        setIsCorrect(null);

        // Find next question that isn’t mastered (progress < 2)
        let nextIndex = (currentIndex + 1) % test.questions.length;
        while (progress[nextIndex] >= 2) {
            nextIndex = (nextIndex + 1) % test.questions.length;
            if (nextIndex === currentIndex) break; // avoid infinite loop
        }

        setCurrentIndex(nextIndex);
        setCurrentTurnCount(prev => prev + 1);

        // If 4 questions attempted, mark end of turn
        if ((currentTurnCount + 1) % 4 === 0) {
            setEndOfTurn(true);
        }
    };

    // Reset turn counters to continue learning
    const handleEndTurn = () => {
        setEndOfTurn(false);
        setCurrentTurnCount(0);
    };

    // Check if all questions are mastered
    const completedCount = progress.filter(p => p >= 2).length;
    const allCompleted = completedCount === test.questions.length;

    // Render completion view if all mastered
    if (allCompleted) {
        return (
            <div className="bg-[#0f172a] min-h-screen flex flex-col items-center py-12 px-6 text-white">
                <h1 className="text-4xl font-bold mb-8">Learning Mode</h1>
                <p className="text-xl">Congratulations! You've mastered all questions.</p>
                <button
                    className="form-button mt-8"
                    onClick={() => { setMode(null); setSelectedTest(null); }}
                >
                    Back to Tests
                </button>
            </div>
        );
    }

    // Render end-of-turn view
    if (endOfTurn) {
        return (
            <div className="bg-[#0f172a] min-h-screen flex flex-col items-center py-12 px-6 text-white">
                <h1 className="text-4xl font-bold mb-8">End of Turn</h1>
                <p className="text-xl mb-6">You've completed 4 questions this turn.</p>
                <div className="flex gap-4">
                    <button className="form-button" onClick={handleEndTurn}>
                        Keep Learning
                    </button>
                    <button className="form-button" onClick={() => { setMode(null); setSelectedTest(null); }}>
                        Back to My Tests
                    </button>
                </div>
            </div>
        );
    }

    // Main question view
    return (
        <div className="bg-[#0f172a] min-h-screen flex flex-col items-center py-12 px-6 text-white">
            <h1 className="text-4xl font-bold mb-8">Learning Mode</h1>
            <div className="bg-[#1e293b] p-8 rounded-lg shadow-md max-w-md w-full">
                <h2 className="text-2xl font-bold mb-4">Question {currentIndex + 1} of {test.questions.length}</h2>
                <p className="text-lg mb-6">{test.questions[currentIndex].question}</p>

                {showAnswer ? (
                    <div className={`p-4 rounded-lg mb-4 ${isCorrect ? 'bg-green-700' : 'bg-red-700'}`}>
                        <p className="font-bold">{isCorrect ? 'Correct Answer:' : 'Wrong Answer:'}</p>
                        <p>{test.questions[currentIndex].answer}</p>
                        {!isCorrect && <p className="text-yellow-300 mt-2">Correct Answer is: {test.questions[currentIndex].answer}</p>}
                    </div>
                ) : (
                    <input
                        type="text"
                        className="form-input mb-4 w-full"
                        placeholder="Your answer"
                        value={inputValue}
                        onChange={e => setInputValue(e.target.value)}
                    />
                )}

                <button
                    className="form-button w-full"
                    onClick={showAnswer ? handleNextQuestion : handleSubmit}
                >
                    {showAnswer ? 'Next Question' : 'Submit Answer'}
                </button>
            </div>

            {/* Show progress for the current question */}
            <p className="text-gray-400 mt-4">Progress: {progress[currentIndex]}/2</p>
        </div>
    );
};

export default LearningMode;
