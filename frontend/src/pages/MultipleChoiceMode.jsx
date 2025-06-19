import React, { useState, useEffect } from "react";

/**
 * Multiple-choice quiz dla pojedynczego testu.
 *
 * props:
 *   • test            : { questions: [{question, answer, wrongAnswers[]}, …] }
 *   • setMode         : fn   (null → powrót do listy)
 *   • setSelectedTest : fn   (null → wyczyść test)
 */
const MultipleChoiceMode = ({ test, setMode, setSelectedTest }) => {
  // ---------- lokalny stan ----------
  const [questions, setQuestions]   = useState([]);
  const [idx, setIdx]               = useState(0);
  const [selected, setSelected]     = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore]           = useState(0);

  // ---------- przygotuj pytania ----------
  useEffect(() => {
    if (!Array.isArray(test?.questions)) return;

    // 1) tasujemy listę pytań i bierzemy maks. 10
    const base = [...test.questions]
      .sort(() => Math.random() - 0.5)
      .slice(0, Math.min(10, test.questions.length));

    // 2) zbiór potencjalnych „dodatkowych” odpowiedzi
    const poolAll = test.questions
      .map((q) => q.answer)
      .filter((a) => a && a.trim() !== "");

    // 3) formatuj każde pytanie
    const prepared = base.map((q) => {
      const correct = q.answer;

      //  — błędne odpowiedzi z tego pytania, bez pustych, bez duplikatów z correct
      const wrongs = (q.wrongAnswers || [])
        .filter((w) => w && w.trim() !== "" && w !== correct);

      //  — dopełnij, jeśli potrzeba, do 3 błędnych (czyli 4 opcji razem)
      const available = poolAll.filter(
        (a) => a !== correct && !wrongs.includes(a)
      );
      while (wrongs.length < 3 && available.length) {
        const pickIdx = Math.floor(Math.random() * available.length);
        wrongs.push(available.splice(pickIdx, 1)[0]);
      }

      //  — shuffle, żeby poprawna nie była zawsze pierwsza
      const options = shuffle([correct, ...wrongs]);

      return { question: q.question, correctAnswer: correct, options };
    });

    setQuestions(prepared);
  }, [test]);

  // ---------- util: Fisher–Yates shuffle ----------
  const shuffle = (arr) => {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  };

  // ---------- wybór opcji ----------
  const handleSelect = (opt) => {
    if (showResult) return;
    setSelected(opt);
    setShowResult(true);
    if (opt === questions[idx].correctAnswer) setScore((s) => s + 1);
  };

  // ---------- następne pytanie ----------
  const handleNext = () => {
    setSelected(null);
    setShowResult(false);
    setIdx((i) => i + 1);
  };

  // ---------- widok ładowania ----------
  if (!questions.length) return null;

  // ---------- koniec testu ----------
  if (idx >= questions.length) {
    return (
      <div className="bg-[#0f172a] min-h-screen flex flex-col items-center justify-center p-6 text-white">
        <h1 className="text-3xl font-bold mb-4">Test Finished!</h1>
        <p className="text-xl mb-6">
          Your score: {score} / {questions.length}
        </p>
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
    );
  }

  // ---------- aktualne pytanie ----------
  const cur = questions[idx];

  return (
    <div className="bg-[#0f172a] min-h-screen flex flex-col items-center justify-center p-6 text-white">
      <div className="w-full max-w-xl">
        <h2 className="text-2xl font-bold mb-4">
          Question {idx + 1} / {questions.length}
        </h2>
        <p className="mb-6">{cur.question}</p>

        <div className="space-y-4">
          {cur.options.map((opt, i) => {
            let classes =
              "w-full p-4 rounded text-left border transition ";

            if (showResult) {
              if (opt === cur.correctAnswer) {
                classes += "bg-green-500 border-green-500 text-white";
              } else if (opt === selected) {
                classes += "bg-red-500 border-red-500 text-white";
              } else {
                classes += "bg-gray-800 border-gray-600 text-white";
              }
            } else {
              classes +=
                "bg-gray-800 border-gray-600 hover:bg-blue-500 hover:border-blue-500 hover:text-white";
            }

            return (
              <button
                key={i}
                disabled={showResult}
                className={classes}
                onClick={() => handleSelect(opt)}
              >
                {opt}
              </button>
            );
          })}
        </div>

        {showResult && (
          <button className="form-button mt-6" onClick={handleNext}>
            {idx + 1 === questions.length ? "See Results" : "Next"}
          </button>
        )}
      </div>
    </div>
  );
};

export default MultipleChoiceMode;
