import React, { useEffect, useState } from "react";

const MatchingGame = ({ test, setMode, setSelectedTest }) => {
    const [shuffledQuestions, setShuffledQuestions] = useState([]);
    const [shuffledAnswers, setShuffledAnswers] = useState([]);
    const [selectedQuestion, setSelectedQuestion] = useState(null);
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [matchedPairs, setMatchedPairs] = useState([]);
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    useEffect(() => {
        // Sprawdzenie poprawności danych z testu
        if (!test.questions || test.questions.length < 4) {
            alert("Matching Game requires at least 4 questions.");
            setMode(null);
            setSelectedTest(null);
        } else {
            // Mieszanie pytań i odpowiedzi
            setShuffledQuestions(
                test.questions.map((q) => ({
                    question: q.question,
                    answer: q.answer,
                })).sort(() => Math.random() - 0.5)
            );
            setShuffledAnswers(
                test.questions.map((q) => ({
                    question: q.question,
                    answer: q.answer,
                })).sort(() => Math.random() - 0.5)
            );
        }
    }, [test, setMode, setSelectedTest]);

    const handleQuestionClick = (question) => {
        setSelectedQuestion(question);
        setErrorMessage("");
    };

    const handleAnswerClick = (answer) => {
        setSelectedAnswer(answer);
        setErrorMessage("");
    };

    const checkMatch = () => {
        if (selectedQuestion && selectedAnswer) {
            if (selectedQuestion.answer === selectedAnswer.answer) {
                setMatchedPairs([...matchedPairs, selectedQuestion.question]);
                setSelectedQuestion(null);
                setSelectedAnswer(null);
                setSuccessMessage("Good job! Correct match!");
                setTimeout(() => setSuccessMessage(""), 2000); // Resetowanie wiadomości sukcesu
            } else {
                setErrorMessage("Incorrect match! Try again.");
            }
        }
    };

    const restartGame = () => {
        setShuffledQuestions([...test.questions].sort(() => Math.random() - 0.5));
        setShuffledAnswers([...test.questions].sort(() => Math.random() - 0.5));
        setSelectedQuestion(null);
        setSelectedAnswer(null);
        setMatchedPairs([]);
        setErrorMessage("");
    };

    const submitResults = async () => {
        try {
            await fetch("http://localhost:4000/v1/submit-results", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`, // Autoryzacja (opcjonalna)
                },
                body: JSON.stringify({
                    testId: test.id,
                    matchedPairs: matchedPairs.length,
                }),
            });
        } catch (error) {
            console.error("Failed to submit results:", error);
        }
    };

    useEffect(() => {
        if (matchedPairs.length === test.questions.length && test.questions.length > 0) {
            submitResults();
        }
    }, [matchedPairs, test]);

    const isMatched = (item) =>
        matchedPairs.includes(item.question);

    return (
        <div className="bg-[#0f172a] min-h-screen flex flex-col items-center py-12 px-6 text-white">
            <h1 className="text-4xl font-bold mb-8">Matching Game</h1>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 w-full max-w-4xl">
                {/* Pytania */}
                {shuffledQuestions.map((question, index) => (
                    <div
                        key={index}
                        className={`p-4 rounded-lg cursor-pointer text-center bg-blue-600 ${
                            isMatched(question) ? "opacity-50 pointer-events-none" : ""
                        } ${
                            selectedQuestion === question ? "ring-4 ring-yellow-500" : ""
                        }`}
                        onClick={() => handleQuestionClick(question)}
                    >
                        {question.question}
                    </div>
                ))}

                {/* Odpowiedzi */}
                {shuffledAnswers.map((answer, index) => (
                    <div
                        key={index}
                        className={`p-4 rounded-lg cursor-pointer text-center bg-green-600 ${
                            isMatched(answer) ? "opacity-50 pointer-events-none" : ""
                        } ${
                            selectedAnswer === answer ? "ring-4 ring-yellow-500" : ""
                        }`}
                        onClick={() => handleAnswerClick(answer)}
                    >
                        {answer.answer}
                    </div>
                ))}
            </div>

            {/* Informacje zwrotne */}
            <div className="mt-8 text-center">
                {successMessage && <p className="text-green-500 mb-4">{successMessage}</p>}
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
                    onClick={restartGame}
                >
                    Restart Game
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

            {/* Gratulacje po zakończeniu gry */}
            {matchedPairs.length === test.questions.length && (
                <div className="mt-12 text-center text-green-500 text-xl">
                    🎉 Congratulations! You've matched all the pairs! 🎉
                </div>
            )}
        </div>
    );
};

export default MatchingGame;
