import React, { useState } from "react";
import SolveTest from "./SolveTest";
import MatchingGame from "./MatchingGame";
import LearningMode from "./LearningMode";

const MyTests = () => {
    const [tests, setTests] = useState([]);
    const [newTestName, setNewTestName] = useState("");
    const [questions, setQuestions] = useState([]);
    const [currentQuestion, setCurrentQuestion] = useState({ question: "", answer: "" });
    const [isAddingQuestions, setIsAddingQuestions] = useState(false);
    const [selectedTest, setSelectedTest] = useState(null);
    const [mode, setMode] = useState(null);
    const [errorMessage, setErrorMessage] = useState("");
    const [editingTest, setEditingTest] = useState(null);
    const [newQuestion, setNewQuestion] = useState({ question: "", answer: "" });

    const handleStartAddingQuestions = () => {
        if (newTestName.trim() === "") {
            setErrorMessage("Test name is required.");
            return;
        }
        setIsAddingQuestions(true);
        setErrorMessage("");
    };

    const handleAddTest = () => {
        if (questions.length === 0) {
            setErrorMessage("At least one question is required.");
            return;
        }

        setTests([...tests, { id: Date.now(), name: newTestName, questions }]);
        setNewTestName("");
        setQuestions([]);
        setIsAddingQuestions(false);
        setErrorMessage("");
    };

    const handleAddQuestion = () => {
        if (currentQuestion.question.trim() === "" || currentQuestion.answer.trim() === "") {
            setErrorMessage("Both question and answer are required.");
            return;
        }

        if (questions.some(q => q.question === currentQuestion.question)) {
            setErrorMessage("This question already exists.");
            return;
        }

        setQuestions([...questions, currentQuestion]);
        setCurrentQuestion({ question: "", answer: "" });
        setErrorMessage("");
    };

    const handleDeleteTest = (id) => {
        setTests(tests.filter((test) => test.id !== id));
    };

    const handleEditQuestions = (test) => {
        setEditingTest(test);
    };

    const handleUpdateQuestion = (index, updatedQuestion) => {
        const updatedQuestions = editingTest.questions.map((q, i) => (i === index ? updatedQuestion : q));
        setEditingTest({ ...editingTest, questions: updatedQuestions });
    };

    const handleDeleteQuestion = (index) => {
        const updatedQuestions = editingTest.questions.filter((_, i) => i !== index);
        setEditingTest({ ...editingTest, questions: updatedQuestions });
    };

    const handleAddNewQuestionToTest = () => {
        if (newQuestion.question.trim() === "" || newQuestion.answer.trim() === "") {
            setErrorMessage("Both question and answer are required.");
            return;
        }

        if (editingTest.questions.some(q => q.question === newQuestion.question)) {
            setErrorMessage("This question already exists in the test.");
            return;
        }

        setEditingTest({ ...editingTest, questions: [...editingTest.questions, newQuestion] });
        setNewQuestion({ question: "", answer: "" });
        setErrorMessage("");
    };

    const saveEditedTest = () => {
        setTests(tests.map((test) => (test.id === editingTest.id ? editingTest : test)));
        setEditingTest(null);
    };

    if (editingTest) {
        return (
            <div className="bg-[#0f172a] min-h-screen flex flex-col items-center py-12 px-6 text-white">
                <h1 className="text-4xl font-bold mb-8">Edit Questions</h1>
                <div className="w-full max-w-lg mb-6">
                    {editingTest.questions.map((q, index) => (
                        <div key={index} className="mb-4 p-4 bg-[#1e293b] rounded-lg">
                            <input
                                type="text"
                                className="form-input mb-2 w-full"
                                value={q.question}
                                onChange={(e) => handleUpdateQuestion(index, { ...q, question: e.target.value })}
                            />
                            <input
                                type="text"
                                className="form-input mb-2 w-full"
                                value={q.answer}
                                onChange={(e) => handleUpdateQuestion(index, { ...q, answer: e.target.value })}
                            />
                            <button
                                className="text-red-500 hover:underline"
                                onClick={() => handleDeleteQuestion(index)}
                            >
                                Delete
                            </button>
                        </div>
                    ))}
                    <div className="p-4 bg-[#1e293b] rounded-lg mb-4">
                        <h3 className="text-lg font-bold mb-2">Add New Question</h3>
                        <input
                            type="text"
                            className="form-input mb-2 w-full"
                            placeholder="New question"
                            value={newQuestion.question}
                            onChange={(e) => setNewQuestion({ ...newQuestion, question: e.target.value })}
                        />
                        <input
                            type="text"
                            className="form-input mb-2 w-full"
                            placeholder="New answer"
                            value={newQuestion.answer}
                            onChange={(e) => setNewQuestion({ ...newQuestion, answer: e.target.value })}
                        />
                        <button
                            className="form-button w-full"
                            onClick={handleAddNewQuestionToTest}
                        >
                            Add Question
                        </button>
                    </div>
                    <button className="form-button w-full" onClick={saveEditedTest}>
                        Save Changes
                    </button>
                </div>
            </div>
        );
    }

    if (selectedTest && mode) {
        switch (mode) {
            case "solve":
                return (
                    <SolveTest
                        test={selectedTest}
                        setMode={setMode}
                        setSelectedTest={setSelectedTest}
                    />
                );
            case "matching":
                return (
                    <MatchingGame
                        test={selectedTest}
                        setMode={setMode}
                        setSelectedTest={setSelectedTest}
                    />
                );
            case "learning":
                return (
                    <LearningMode
                        test={selectedTest}
                        setMode={setMode}
                        setSelectedTest={setSelectedTest}
                    />
                );
            default:
                break;
        }
    }

    return (
        <div className="bg-[#0f172a] min-h-screen flex flex-col items-center py-12 px-6 text-white">
            <h1 className="text-4xl font-bold mb-8">My Tests</h1>

            {!isAddingQuestions ? (
                <div className="w-full max-w-md mb-6">
                    <input
                        type="text"
                        className="form-input mb-4"
                        placeholder="Enter test name"
                        value={newTestName}
                        onChange={(e) => setNewTestName(e.target.value)}
                        required
                    />
                    {errorMessage && <p className="text-red-500 text-sm mb-4">{errorMessage}</p>}
                    <button
                        className="form-button w-full"
                        onClick={handleStartAddingQuestions}
                    >
                        Add Questions
                    </button>
                </div>
            ) : (
                <div className="w-full max-w-md mb-6">
                    <h2 className="text-center text-xl font-bold mb-4">Add Questions</h2>
                    <div className="form-group">
                        <input
                            type="text"
                            className="form-input mb-2"
                            placeholder="Enter question"
                            value={currentQuestion.question}
                            onChange={(e) =>
                                setCurrentQuestion({ ...currentQuestion, question: e.target.value })
                            }
                            required
                        />
                        <input
                            type="text"
                            className="form-input mb-4"
                            placeholder="Enter answer"
                            value={currentQuestion.answer}
                            onChange={(e) =>
                                setCurrentQuestion({ ...currentQuestion, answer: e.target.value })
                            }
                            required
                        />
                        {errorMessage && <p className="text-red-500 text-sm mb-4">{errorMessage}</p>}
                        <button className="form-button w-full mb-2" onClick={handleAddQuestion}>
                            Add Question
                        </button>
                    </div>
                    {questions.length > 0 && (
                        <div className="bg-[#1e293b] p-4 rounded-lg mb-4">
                            <h3 className="text-lg font-bold mb-2">Questions:</h3>
                            <ul className="space-y-2">
                                {questions.map((q, index) => (
                                    <li key={index} className="text-gray-300">
                                        {index + 1}. {q.question} (Answer: {q.answer})
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                    <button className="form-button w-full" onClick={handleAddTest}>
                        Save Test
                    </button>
                </div>
            )}

            <div className="w-full max-w-lg">
                {tests.length === 0 ? (
                    <p className="text-center text-gray-300">
                        No tests available. Add a new test to get started!
                    </p>
                ) : (
                    <ul className="space-y-4">
                        {tests.map((test) => (
                            <li
                                key={test.id}
                                className="flex flex-col items-start bg-[#1e293b] p-4 rounded-lg"
                            >
                                <span className="font-bold mb-2 text-lg text-center w-full block">{test.name}</span>
                                <div className="flex gap-4 flex-wrap justify-center w-full">
                                      <button
                                          className="border border-blue-400 text-blue-400 hover:bg-blue-400 hover:text-white px-4 py-2 rounded-lg"
                                          onClick={() => {
                                              setSelectedTest(test);
                                              setMode("solve");
                                          }}
                                      >
                                          Solve Test
                                      </button>
                                      <button
                                          className="border border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-black px-4 py-2 rounded-lg"
                                          onClick={() => {
                                              setSelectedTest(test);
                                              setMode("learning");
                                          }}
                                      >
                                          Learning Mode
                                      </button>
                                      <button
                                          className="border border-green-400 text-green-400 hover:bg-green-400 hover:text-black px-4 py-2 rounded-lg"
                                          onClick={() => {
                                              setSelectedTest(test);
                                              setMode("matching");
                                          }}
                                      >
                                          Matching Game
                                      </button>
                                      <button
                                          className="border border-purple-400 text-purple-400 hover:bg-purple-400 hover:text-white px-4 py-2 rounded-lg"
                                          onClick={() => handleEditQuestions(test)}
                                      >
                                          Browse/Edit Questions
                                      </button>
                                      <button
                                          className="border border-red-400 text-red-400 hover:bg-red-400 hover:text-white px-4 py-2 rounded-lg"
                                          onClick={() => handleDeleteTest(test.id)}
                                      >
                                          Delete
                                      </button>
                                  </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default MyTests;
