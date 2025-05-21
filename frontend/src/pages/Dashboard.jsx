import React, { useEffect, useState } from "react";

const Dashboard = () => {
  const [userName, setUserName] = useState("");
  const [tests, setTests] = useState([]);

  useEffect(() => {
    const storedName = localStorage.getItem("userName") || "User";
    setUserName(storedName);

    // Simulate fetching test data (you can replace this with real backend call)
    const storedTests = JSON.parse(localStorage.getItem("userTests")) || [];
    setTests(storedTests);
  }, []);

  const totalTests = tests.length;
  const totalQuestions = tests.reduce((acc, test) => acc + test.questions.length, 0);
  const averageQuestions = totalTests > 0 ? (totalQuestions / totalTests).toFixed(1) : 0;

  return (
    <div className="bg-[#0f172a] min-h-screen p-8 text-white">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold mb-6">Welcome, {userName}!</h1>

        {/* Stats Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-[#1e293b] p-6 rounded-lg text-center">
            <h2 className="text-xl font-semibold">Total Tests</h2>
            <p className="text-3xl mt-2 font-bold">{totalTests}</p>
          </div>
          <div className="bg-[#1e293b] p-6 rounded-lg text-center">
            <h2 className="text-xl font-semibold">Total Questions</h2>
            <p className="text-3xl mt-2 font-bold">{totalQuestions}</p>
          </div>
          <div className="bg-[#1e293b] p-6 rounded-lg text-center">
            <h2 className="text-xl font-semibold">Avg. Questions/Test</h2>
            <p className="text-3xl mt-2 font-bold">{averageQuestions}</p>
          </div>
        </div>

        {/* Latest Tests List */}
        <div>
          <h2 className="text-2xl font-bold mb-4">Recent Tests</h2>
          {tests.length === 0 ? (
            <p className="text-gray-400">You haven't created any tests yet.</p>
          ) : (
            <ul className="space-y-4">
              {tests.slice(0, 5).map((test) => (
                <li key={test.id} className="bg-[#1e293b] p-4 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-lg">{test.name}</span>
                    <span className="text-sm text-gray-400">
                      {test.questions.length} question{test.questions.length !== 1 ? "s" : ""}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
