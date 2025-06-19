import React, { useState, useEffect } from "react";

const MatchingGame = ({ test, setMode, setSelectedTest }) => {
  // Shuffled question cards
  const [questionsList, setQuestionsList] = useState([]);
  // Shuffled answer cards
  const [answersList, setAnswersList] = useState([]);
  // Currently selected question & answer
  const [selectedQ, setSelectedQ] = useState(null);
  const [selectedA, setSelectedA] = useState(null);
  // Set of matched question IDs
  const [matchedIds, setMatchedIds] = useState(new Set());
  // Error feedback
  const [errorMsg, setErrorMsg] = useState("");

  // On mount: validate & shuffle
  useEffect(() => {
    // ↓ 1. ochrona przed brakiem pytań
    const qs = Array.isArray(test.questions) ? test.questions : [];
  
    if (qs.length < 4) {
      alert("Matching Game requires at least 4 questions.");
      setMode(null);
      setSelectedTest(null);
      return;
    }
  
   
    const qList = qs.map((q, idx) => ({
      id:   q.id ?? idx,            
      text: q.question
    }));
  
    const aList = qs.map((q, idx) => {
      
      if (Array.isArray(q.answers)) {
        const correct = q.answers.find(a => a.correct);
        return { id: q.id ?? idx, text: correct?.content ?? "" };
      }
      
      return { id: q.id ?? idx, text: q.answer ?? "" };
    });
  
    //shuffle
    const shuffle = arr => {
      const a = [...arr];
      for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
      }
      return a;
    };
  
    setQuestionsList(shuffle(qList));
    setAnswersList(shuffle(aList));
  }, [test.questions, setMode, setSelectedTest]);

  // click handlers
  const pickQuestion = (q) => {
    if (matchedIds.has(q.id)) return;
    setSelectedQ(q);
    setErrorMsg("");
  };
  const pickAnswer = (a) => {
    if (matchedIds.has(a.id)) return;
    setSelectedA(a);
    setErrorMsg("");
  };

  // check match
  const checkMatch = () => {
    if (!selectedQ || !selectedA) return;
    if (selectedQ.id === selectedA.id) {
      setMatchedIds((s) => new Set(s).add(selectedQ.id));
      setSelectedQ(null);
      setSelectedA(null);
    } else {
      setErrorMsg("Wrong pair – try again!");
    }
  };

  const isDisabled = (id) => matchedIds.has(id);

  return (
    <div className="bg-[#0f172a] min-h-screen flex flex-col items-center text-white p-8">
      <h1 className="text-4xl font-bold mb-6">Matching Game</h1>

      <div className="grid grid-cols-2 gap-8 w-full max-w-4xl">
        {/* Questions */}
        <div>
          <h2 className="text-xl mb-4">Questions</h2>
          <div className="space-y-2">
            {questionsList.map((q) => (
              <div
                key={q.id}
                onClick={() => pickQuestion(q)}
                className={`
                  p-4 rounded-lg cursor-pointer bg-blue-600 text-center
                  ${isDisabled(q.id) ? "opacity-50 pointer-events-none" : ""}
                  ${selectedQ?.id === q.id ? "ring-4 ring-yellow-400" : ""}
                `}
              >
                {q.text}
              </div>
            ))}
          </div>
        </div>

        {/* Answers */}
        <div>
          <h2 className="text-xl mb-4">Answers</h2>
          <div className="space-y-2">
            {answersList.map((a) => (
              <div
                key={a.id}
                onClick={() => pickAnswer(a)}
                className={`
                  p-4 rounded-lg cursor-pointer bg-green-600 text-center
                  ${isDisabled(a.id) ? "opacity-50 pointer-events-none" : ""}
                  ${selectedA?.id === a.id ? "ring-4 ring-yellow-400" : ""}
                `}
              >
                {a.text}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="mt-8 text-center">
        {errorMsg && <p className="text-red-500 mb-4">{errorMsg}</p>}
        <button
          className="form-button mr-4"
          onClick={checkMatch}
          disabled={!selectedQ || !selectedA}
        >
          Check Match
        </button>
        <button
          className="form-button"
          onClick={() => {
            setMode(null);
            setSelectedTest(null);
          }}
        >
          Back to Tests
        </button>
      </div>

      {/* Win message */}
      {matchedIds.size === test.questions.length && (
        <p className="text-green-400 text-xl mt-8">
          🎉 You’ve matched all pairs! 🎉
        </p>
      )}
    </div>
  );
};

export default MatchingGame;
