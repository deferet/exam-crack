import React, { useState, useEffect } from "react";
import SolveTest from "./SolveTest";
import MatchingGame from "./MatchingGame";
import LearningMode from "./LearningMode";
import MultipleChoiceMode from "./MultipleChoiceMode";

const MyTests = () => {
  // ----------------------
  // State declarations
  // ----------------------
  const [tests, setTests] = useState([]);
  const [newTestName, setNewTestName] = useState("");
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState({
    question: "",
    answer: "",
    wrongAnswers: [""],
  });
  const [isAddingQuestions, setIsAddingQuestions] = useState(false);
  const [editingTest, setEditingTest] = useState(null);
  const [newQuestion, setNewQuestion] = useState({
    question: "",
    answer: "",
    wrongAnswers: [""],
  });
  const [selectedTest, setSelectedTest] = useState(null);
  const [mode, setMode] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("default");
  const [openMenus, setOpenMenus] = useState({});
  const [currentPage, setCurrentPage] = useState(1);

  const testsPerPage = 5;
  const maxTests = 15;

  
  const token = localStorage.getItem("token") || "";

  
  useEffect(() => {
    async function fetchTests() {
      try {
        const res = await fetch("/v1/tests", {
          headers: { "Authorization": `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Nie udało się pobrać testów");
        const { tests: payloadTests } = await res.json();
        const testsFromServer = Array.isArray(payloadTests)
          ? payloadTests.map(t => ({
              ...t,
              questions: Array.isArray(t.questions) ? t.questions : [],
            }))
          : [];
        setTests(testsFromServer);
      } catch (err) {
        setErrorMessage(err.message);
      }
    }
    fetchTests();
  }, []);

  // ----------------------
  // Utility functions
  // ----------------------
  const toggleMenu = (id) =>
    setOpenMenus((prev) => ({ ...prev, [id]: !prev[id] }));

  // ----------------------
  // Handlers: Create flow
  // ----------------------
  const handleStartAddingQuestions = () => {
    if (!newTestName.trim()) {
      setErrorMessage("Test name is required.");
      return;
    }
    setIsAddingQuestions(true);
    setErrorMessage("");
  };

  const handleAddQuestion = () => {
    const { question, answer, wrongAnswers } = currentQuestion;
    if (!question.trim() || !answer.trim() || !wrongAnswers[0].trim()) {
      setErrorMessage(
        "Question, correct answer and at least one wrong answer are required."
      );
      return;
    }
    if (questions.some((q) => q.question === question)) {
      setErrorMessage("This question already exists.");
      return;
    }
    setQuestions([...questions, currentQuestion]);
    setCurrentQuestion({ question: "", answer: "", wrongAnswers: [""] });
    setErrorMessage("");
  };

  const handleAddTest = () => {
    if (questions.length === 0) {
      setErrorMessage("At least one question is required.");
      return;
    }
    if (tests.length >= maxTests) {
      setErrorMessage(`Maximum of ${maxTests} tests reached.`);
      return;
    }
    (async () => {
      try {
        const res = await fetch("/v1/tests", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
          body: JSON.stringify({
            name: newTestName,
            description: "",
            categories: ["all"],
            questions: questions.map(q => ({
              question: q.question,
              answer: String(q.answer),
              wrongAnswers: q.wrongAnswers
            }))
          }),
        });
        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.error || "Failed to save test");
        }
        const { test } = await res.json();
        setTests([{ ...test, questions }, ...tests]);

        setNewTestName("");
        setQuestions([]);
        setCurrentQuestion({ question: "", answer: "", wrongAnswers: [""] });
        setIsAddingQuestions(false);
        setErrorMessage("");
      } catch (err) {
        setErrorMessage(err.message);
      }
    })();
  };

  // ----------------------
  // Handlers: Edit flow
  // ----------------------
  const handleEditQuestions = (test) => {
    setEditingTest(test);
    setErrorMessage("");
  };

  const handleUpdateQuestion = (index, updated) => {
    const updatedQs = editingTest.questions.map((q, i) =>
      i === index ? updated : q
    );
    setEditingTest({ ...editingTest, questions: updatedQs });
  };

  const handleDeleteQuestion = (index) => {
    const updatedQs = editingTest.questions.filter((_, i) => i !== index);
    setEditingTest({ ...editingTest, questions: updatedQs });
  };

  const handleAddNewQuestionToTest = () => {
    const { question, answer, wrongAnswers } = newQuestion;
    if (!question.trim() || !answer.trim() || !wrongAnswers[0].trim()) {
      setErrorMessage(
        "Question, correct answer and at least one wrong answer are required."
      );
      return;
    }
    if (editingTest.questions.some((q) => q.question === question)) {
      setErrorMessage("This question already exists in the test.");
      return;
    }
    setEditingTest({
      ...editingTest,
      questions: [...editingTest.questions, newQuestion],
    });
    setNewQuestion({ question: "", answer: "", wrongAnswers: [""] });
    setErrorMessage("");
  };

  const handleSaveEditedTest = async () => {
    try {
      
      const normDescription =
        typeof editingTest.description === "string"
          ? editingTest.description
          : (editingTest.description?.String ?? "");
  
      const normCategories =
        Array.isArray(editingTest.categories) && editingTest.categories.length
          ? editingTest.categories
          : ["all"];
  
      
      const metaPayload = {
        name:        editingTest.name ?? "",
        description: normDescription,
        categories:  normCategories,
      };
  
      const resMeta = await fetch(`/v1/tests/${editingTest.id}`, {
        method:  "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization:  `Bearer ${token}`,
        },
        body: JSON.stringify(metaPayload),
      });
  
      if (!resMeta.ok) {
        const txt = await resMeta.text();
        throw new Error(`${resMeta.status} ${resMeta.statusText}: ${txt}`);
      }
  
      
      const resQ = await fetch(`/v1/tests/${editingTest.id}/questions`, {
        method:  "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization:  `Bearer ${token}`,
        },
        body: JSON.stringify({ questions: editingTest.questions }),
      });
  
      if (!resQ.ok) {
        const txt = await resQ.text();
        throw new Error(`${resQ.status} ${resQ.statusText}: ${txt}`);
      }
  
      
      const { test: updated } = await resMeta.json(); 
      setTests(ts =>
        ts.map(t =>
          t.id === updated.id
            ? { ...updated, questions: editingTest.questions }
            : t
        )
      );
      setEditingTest(null);
      setErrorMessage("");
  
    } catch (err) {
      console.error("SAVE ERROR", err);
      setErrorMessage(err.message);
    }
  };
  
  

  // ----------------------
  // Handler: Delete test
  // ----------------------
  const handleDeleteTest = (id) => {
    (async () => {
      try {
        const res = await fetch(`/v1/tests/${id}`, {
          method: "DELETE",
          headers: { "Authorization": `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Nie udało się usunąć testu");
        setTests(tests.filter((t) => t.id !== id));
      } catch (err) {
        setErrorMessage(err.message);
      }
    })();
  };

  // ----------------------
  // Filtering, sorting & pagination
  // ----------------------```

  const filteredSorted = tests
    .filter((t) =>
      t.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === "name") return a.name.localeCompare(b.name);
      if (sortBy === "name-desc") return b.name.localeCompare(a.name);
      if (sortBy === "questions")
        return (b.questions?.length ?? 0) - (a.questions?.length ?? 0);
      if (sortBy === "questions-asc")
        return (a.questions?.length ?? 0) - (b.questions?.length ?? 0);
      return 0;
    });

  const totalPages = Math.ceil(filteredSorted.length / testsPerPage);
  const paginated = filteredSorted.slice(
    (currentPage - 1) * testsPerPage,
    currentPage * testsPerPage
  );

  const handlePageChange = (n) => {
    if (n >= 1 && n <= totalPages) setCurrentPage(n);
  };

  // ----------------------
  // Render: Edit mode
  // ----------------------
  if (editingTest) {
    return (
      <div className="bg-[#0f172a] min-h-screen flex flex-col items-center py-12 px-6 text-white">
        <h1 className="text-4xl font-bold mb-8">Browse/Edit Questions</h1>
        <div className="w-full max-w-lg">
          {editingTest.questions.map((q, idx) => (
            <div
              key={idx}
              className="mb-4 p-4 bg-[#1e293b] rounded-lg text-black"
            >
              {/* question text */}
              <input
                type="text"
                className="form-input mb-2 w-full"
                value={q.question}
                onChange={(e) =>
                  handleUpdateQuestion(idx, { ...q, question: e.target.value })
                }
              />
              {/* correct answer */}
              <input
                type="text"
                className="form-input mb-2 w-full"
                value={q.answer}
                onChange={(e) =>
                  handleUpdateQuestion(idx, { ...q, answer: e.target.value })
                }
              />
              {/* wrong answers list */}
              {(q.wrongAnswers ?? []).map((w, i) => (
                <div key={i} className="flex items-center mb-2">
                  <input
                    type="text"
                    className="form-input flex-grow"
                    placeholder={`Wrong answer ${i + 1}`}
                    value={w}
                    onChange={(e) => {
                      const arr = [...q.wrongAnswers];
                      arr[i] = e.target.value;
                      handleUpdateQuestion(idx, { ...q, wrongAnswers: arr });
                    }}
                  />
                  {q.wrongAnswers.length > 1 && (
                    <button
                      type="button"
                      className="text-red-500 ml-2"
                      onClick={() => {
                        const arr = q.wrongAnswers.filter((_, j) => j !== i);
                        handleUpdateQuestion(idx, { ...q, wrongAnswers: arr });
                      }}
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}
              {/* add additional wrong answer */}
              {(q.wrongAnswers?.length ?? 0) < 4 && (
                <button
                  type="button"
                  className="w-full mb-2 py-2 rounded bg-red-500 text-white hover:bg-red-600"
                  onClick={() => {
                    const arr = [...q.wrongAnswers, ""];
                    handleUpdateQuestion(idx, { ...q, wrongAnswers: arr });
                  }}
                >
                  Add wrong answer
                </button>
              )}
              {/* delete question */}
              <button
                className="text-red-500 hover:underline mt-2"
                onClick={() => handleDeleteQuestion(idx)}
              >
                Delete question
              </button>
            </div>
          ))}

          {/* form to add a new question */}
          <div className="p-4 bg-[#1e293b] rounded-lg mb-4 text-white">
            <h3 className="text-lg font-bold mb-2">Add New Question</h3>
            <input
              type="text"
              className="form-input mb-2 w-full"
              placeholder="New question"
              value={newQuestion.question}
              onChange={(e) =>
                setNewQuestion({ ...newQuestion, question: e.target.value })
              }
            />
            <input
              type="text"
              className="form-input mb-2 w-full"
              placeholder="New correct answer"
              value={newQuestion.answer}
              onChange={(e) =>
                setNewQuestion({ ...newQuestion, answer: e.target.value })
              }
            />
            {(newQuestion.wrongAnswers ?? []).map((w, i) => (
              <div key={i} className="flex items-center mb-2">
                <input
                  type="text"
                  className="form-input flex-grow"
                  placeholder={`Wrong answer ${i + 1}`}
                  value={w}
                  onChange={(e) => {
                    const arr = [...newQuestion.wrongAnswers];
                    arr[i] = e.target.value;
                    setNewQuestion({ ...newQuestion, wrongAnswers: arr });
                  }}
                />
                {(newQuestion.wrongAnswers?.length ?? 0) < 4 && (
                  <button
                    type="button"
                    className="text-red-500 ml-2"
                    onClick={() => {
                      const arr = newQuestion.wrongAnswers.filter(
                        (_, j) => j !== i
                      );
                      setNewQuestion({ ...newQuestion, wrongAnswers: arr });
                    }}
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
            {newQuestion.wrongAnswers.length < 4 && (
              <button
                type="button"
                className="w-full mb-2 py-2 rounded bg-red-500 text-white hover:bg-red-600"
                onClick={() =>
                  setNewQuestion({
                    ...newQuestion,
                    wrongAnswers: [...newQuestion.wrongAnswers, ""],
                  })
                }
              >
                Add wrong answer
              </button>
            )}
            <button
              className="form-button w-full mt-2"
              onClick={handleAddNewQuestionToTest}
            >
              Add Question
            </button>
          </div>

          {/* save changes */}
          <button
            className="form-button w-full"
            onClick={handleSaveEditedTest}
          >
            Save Changes
        </button>
        </div>
      </div>
    );
  }

  // ----------------------
  // Render: Mode switch
  // ----------------------
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
      case "multiple":
        return (
          <MultipleChoiceMode
            test={selectedTest}
            setMode={setMode}
            setSelectedTest={setSelectedTest}
          />
        );
      default:
        return null;
    }
  }

  // ----------------------
  // Render: Main list & creation form
  // ----------------------
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
          />
          {errorMessage && (
            <p className="text-red-500 text-sm mb-4">{errorMessage}</p>
          )}
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
            {/* question field */}
            <input
              type="text"
              className="form-input mb-2"
              placeholder="Enter question"
              value={currentQuestion.question}
              onChange={(e) =>
                setCurrentQuestion({
                  ...currentQuestion,
                  question: e.target.value,
                })
              }
            />
            {/* correct answer field */}
            <input
              type="text"
              className="form-input mb-2"
              placeholder="Enter correct answer"
              value={currentQuestion.answer}
              onChange={(e) =>
                setCurrentQuestion({
                  ...currentQuestion,
                  answer: e.target.value,
                })
              }
            />
            {/* wrong answer fields */}
            {currentQuestion.wrongAnswers.map((w, i) => (
              <div key={i} className="flex items-center mb-2">
                <input
                  type="text"
                  className="form-input flex-grow"
                  placeholder={`Wrong answer ${i + 1}`}
                  value={w}
                  onChange={(e) => {
                    const arr = [...currentQuestion.wrongAnswers];
                    arr[i] = e.target.value;
                    setCurrentQuestion({
                      ...currentQuestion,
                      wrongAnswers: arr,
                    });
                  }}
                />
                {currentQuestion.wrongAnswers.length > 1 && (
                  <button
                    type="button"
                    className="text-red-500 ml-2"
                    onClick={() => {
                      const arr = currentQuestion.wrongAnswers.filter(
                        (_, j) => j !== i
                      );
                      setCurrentQuestion({
                        ...currentQuestion,
                        wrongAnswers: arr,
                      });
                    }}
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
            {/* add additional wrong answer */}
            {currentQuestion.wrongAnswers.length < 4 && (
              <button
                type="button"
                className="w-full mb-2 py-2 rounded bg-red-500 text-white hover:bg-red-600"
                onClick={() =>
                  setCurrentQuestion({
                    ...currentQuestion,
                    wrongAnswers: [
                      ...currentQuestion.wrongAnswers,
                      "",
                    ],
                  })
                }
              >
                Add wrong answer
              </button>
            )}
            {errorMessage && (
              <p className="text-red-500 text-sm mb-4">{errorMessage}</p>
            )}
            {/* submit question */}
            <button
              className="form-button w-full mb-2"
              onClick={handleAddQuestion}
            >
              Add Question
            </button>
          </div>

          {/* list of questions being built */}
          {questions.length > 0 && (
            <div className="bg-[#1e293b] p-4 rounded-lg mb-4 text-gray-300">
              <h3 className="text-lg font-bold mb-2">Questions:</h3>
              <ul className="space-y-2">
                {questions.map((q, idx) => (
                  <li key={idx}>
                    {idx + 1}. {q.question} (Correct: {q.answer})
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* save test */}
          <button onClick={() => handleAddTest()}>
            Save Test
          </button>

        </div>
      )}

      {/* search & sort */}
      <div className="w-full max-w-lg mb-4 flex flex-col gap-2">
        <input
          type="text"
          className="form-input text-black"
          placeholder="Search by name"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <select
          className="form-select text-black"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
        >
          <option value="default">Sort: None</option>
          <option value="name">Sort by Name (A-Z)</option>
          <option value="name-desc">Sort by Name (Z-A)</option>
          <option value="questions">By # Questions (desc)</option>
          <option value="questions-asc">By # Questions (asc)</option>
        </select>
      </div>

      {/* test list with pagination */}
      <div className="w-full max-w-lg">
        {paginated.length === 0 ? (
          <p className="text-center text-gray-300">No tests available.</p>
        ) : (
          <ul className="space-y-4">
            {paginated.map((test) => (
              <li
                key={test.id}
                className="bg-[#1e293b] p-4 rounded-lg text-white"
              >
                <div className="flex justify-between items-center mb-2">
                  <span className="font-bold text-lg">
                    {test.name} ({test.questions.length} Qs)
                  </span>
                  <button
                    onClick={() => toggleMenu(test.id)}
                    className="px-3 py-1 border border-white rounded hover:bg-white hover:text-black"
                  >
                    Menu
                  </button>
                </div>
                {openMenus[test.id] && (
                  <div className="flex gap-4 flex-wrap">
                    <button
                      className="border border-blue-400 px-4 py-2 rounded-lg text-blue-400 hover:bg-blue-400 hover:text-white"
                      onClick={() => {
                        setSelectedTest(test);
                        setMode("solve");
                      }}
                    >
                      Solve Test
                    </button>
                    <button
                      className="border border-green-400 px-4 py-2 rounded-lg text-green-400 hover:bg-green-400 hover:text-white"
                      onClick={() => {
                        setSelectedTest(test);
                        setMode("matching");
                      }}
                    >
                      Matching Game
                    </button>
                    <button
                      className="border border-yellow-400 px-4 py-2 rounded-lg text-yellow-400 hover:bg-yellow-400 hover:text-white"
                      onClick={() => {
                        setSelectedTest(test);
                        setMode("learning");
                      }}
                    >
                      Learning Mode
                    </button>
                    <button
                      className="border border-pink-400 px-4 py-2 rounded-lg text-pink-400 hover:bg-pink-400 hover:text-white"
                      onClick={() => {
                        if (test.questions.length < 1) {
                          alert("Need at least 1 question.");
                          return;
                        }
                        setSelectedTest(test);
                        setMode("multiple");
                      }}
                    >
                      Multiple Choice
                    </button>
                    <button
                      className="border border-purple-400 px-4 py-2 rounded-lg text-purple-400 hover:bg-purple-400 hover:text-white"
                      onClick={() => handleEditQuestions(test)}
                    >
                      Browse/Edit Questions
                    </button>
                    <button
                      className="border border-red-400 px-4 py-2 rounded-lg text-red-400 hover:bg-red-400 hover:text-white"
                      onClick={() => handleDeleteTest(test.id)}
                    >
                      Delete
                    </button>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
        {totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-4">
            <button
              className="px-3 py-1 border rounded disabled:opacity-50 hover:bg-white hover:text-black"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Previous
            </button>
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                className={`px-3 py-1 border rounded ${
                  currentPage === i + 1
                    ? "bg-white text-black font-bold"
                    : "hover:bg-white hover:text-black"
                }`}
                onClick={() => handlePageChange(i + 1)}
              >
                {i + 1}
              </button>
            ))}
            <button
              className="px-3 py-1 border rounded disabled:opacity-50 hover:bg-white hover:text-black"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyTests;
