import React, { useEffect, useState } from "react";
import ChangePassword from "../components/ChangePassword";

const Dashboard = () => {
  // ---------- states ----------
  const [userName, setUserName] = useState(
    localStorage.getItem("userName") || "User"
  );
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showPw, setShowPw] = useState(false);

  const token = localStorage.getItem("token") || "";

  // ---------- helper ----------
  const parseJwtName = (jwt) => {
    try {
      const p = JSON.parse(atob(jwt.split(".")[1]));
      return p.username || p.email || p.sub || null;
    } catch {
      return null;
    }
  };

  // ---------- username ----------
  useEffect(() => {
    if (userName !== "User") return;
    const name = parseJwtName(token);
    if (name) {
      setUserName(name);
      localStorage.setItem("userName", name);
      return;
    }
    (async () => {
      try {
        const res = await fetch("/v1/users/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) return;
        const { user } = await res.json();
        if (user?.username) {
          setUserName(user.username);
          localStorage.setItem("userName", user.username);
        }
      } catch {/* ignore */}
    })();
  }, [token, userName]);

  // ---------- tests ----------
  useEffect(() => {
    if (!token) { setLoading(false); return; }
    (async () => {
      try {
        const res = await fetch("/v1/tests", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Cannot load tests");
        const { tests: arr } = await res.json();
        const norm = (arr || []).map(t => ({
          ...t,
          questions: Array.isArray(t.questions) ? t.questions : [],
        }));
        setTests(norm);
        localStorage.setItem("userTests", JSON.stringify(norm));
      } catch (err) {
        setError(err.message);
        const cached = JSON.parse(localStorage.getItem("userTests") || "[]");
        setTests(cached);
      } finally { setLoading(false); }
    })();
  }, [token]);

  // ---------- statistics ----------
  const totalTests = tests.length;
  const totalQuestions = tests.reduce((s, t) => s + t.questions.length, 0);
  const avgQuestions = totalTests ? (totalQuestions / totalTests).toFixed(1) : 0;
  const initial = userName.charAt(0).toUpperCase();

  if (loading) {
    return (
      <div className="bg-[#0f172a] min-h-screen flex items-center justify-center text-white">
        Loading...
      </div>
    );
  }

  // ---------- render ----------
  return (
    <div className="bg-[#0f172a] min-h-screen p-8 text-white">
      <div className="max-w-5xl mx-auto text-center">

        {/* avatar + greeting + change password button */}
        <div className="flex flex-col items-center mb-10">
          <div className="w-24 h-24 rounded-full bg-white text-[#0f172a] font-semibold flex items-center justify-center text-3xl">
            {initial}
          </div>
          <h1 className="text-3xl font-bold mt-4">Hello, {userName}!</h1>

          <button
            onClick={() => setShowPw(true)}
            className="mt-4 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded"
          >
            Change password
          </button>
        </div>

        {/* statistics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-12">
          <StatBox title="Total Tests" value={totalTests} />
          <StatBox title="Total Questions" value={totalQuestions} />
          <StatBox title="Avg. Questions/Test" value={avgQuestions} />
        </div>

        {/* recent tests */}
        <div>
          <h2 className="text-2xl font-bold mb-4">Recent Tests</h2>
          {error && (
            <p className="text-red-400 mb-4">⚠ {error} (cached data shown)</p>
          )}
          {tests.length === 0 ? (
            <p className="text-gray-400">You haven't created any tests yet.</p>
          ) : (
            <ul className="space-y-4">
              {tests.slice(0, 4).map(t => (
                <li key={t.id} className="bg-[#1e293b] p-4 rounded-lg flex justify-between">
                  <span className="font-semibold text-lg">{t.name}</span>
                  <span className="text-sm text-gray-400">
                    {t.questions.length} question{t.questions.length !== 1 && "s"}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {showPw && <ChangePassword onClose={() => setShowPw(false)} />}
    </div>
  );

  function StatBox({ title, value }) {
    return (
      <div className="bg-[#1e293b] p-6 rounded-lg text-center">
        <h2 className="text-xl font-semibold">{title}</h2>
        <p className="text-3xl mt-2 font-bold">{value}</p>
      </div>
    );
  }
};

export default Dashboard;