import React, { useState, useEffect } from "react";
import scoreImage from "../assets/100.webp";
import flashcardImage from "../assets/flashcard.webp";
import teenagersImage from "../assets/teenagers.webp";

const Homepage = () => {
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
  const [searchQuery, setSearchQuery] = useState("");
  const [userQuizzes, setUserQuizzes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch quizzes when searchQuery changes
  useEffect(() => {
    if (!searchQuery) {
      setUserQuizzes([]);
      return;
    }
    const fetchQuizzes = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/quizzes?search=${encodeURIComponent(searchQuery)}`);
        if (!res.ok) throw new Error("Failed to fetch quizzes");
        const data = await res.json();
        setUserQuizzes(data.quizzes || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    const timeout = setTimeout(fetchQuizzes, 300);
    return () => clearTimeout(timeout);
  }, [searchQuery]);

  return (
    <div className="bg-[#0f172a] min-h-screen flex flex-col items-center py-12 px-6 text-white">
      <div className="bg-[#1e293b] p-12 rounded-lg border border-gray-500 text-center max-w-6xl">
        {/* Header Section */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-6">Welcome to Exam Crack</h1>
          <p className="text-lg">
            Exam Crack is your ultimate study partner. Create flashcards, engage in interactive learning, and ace your exams with our advanced tools and resources. Join our community and start your journey toward academic success today!
          </p>
        </div>

        {/* Image Section */}
        <div className="flex flex-wrap justify-center items-center gap-8 mb-12">
          <div
            className="w-80 h-56 bg-cover bg-center rounded-lg"
            style={{ backgroundImage: `url(${flashcardImage})` }}
          ></div>
          <div
            className="w-80 h-56 bg-cover bg-center rounded-lg"
            style={{ backgroundImage: `url(${teenagersImage})` }}
          ></div>
          <div
            className="w-80 h-56 bg-cover bg-center rounded-lg"
            style={{ backgroundImage: `url(${scoreImage})` }}
          ></div>
        </div>

        {/* Call-to-Action & Search Section */}
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-6">Join Today</h2>
          <div className="flex flex-wrap justify-center gap-6 mb-6">
            {isLoggedIn ? (
              <>
                <a
                  href="/mytests"
                  className="form-button w-60 bg-green-600 hover:bg-green-700 text-white py-3 rounded-md text-lg text-center transition"
                >
                  Browse Tests
                </a>
                {/* Search Quizzes by Other Users */}
                <div className="w-full mt-8 text-left">
                  <h3 className="text-xl font-semibold mb-4">Search Quizzes by Other Users</h3>
                  <div className="flex mb-4">
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search quizzes..."
                      className="flex-grow p-3 rounded-l-md text-black"
                    />
                    <button
                      onClick={() => {}}
                      className="bg-blue-600 hover:bg-blue-700 p-3 rounded-r-md"
                    >
                      Search
                    </button>
                  </div>
                  {loading && <p>Loading quizzes...</p>}
                  {error && <p className="text-red-400">{error}</p>}
                  {userQuizzes.length > 0 && (
                    <ul className="max-h-60 overflow-y-auto">
                      {userQuizzes.map((quiz) => (
                        <li key={quiz.id} className="py-2 border-b border-gray-600">
                          <a href={`/quiz/${quiz.id}`} className="hover:underline">
                            {quiz.title} by {quiz.author}
                          </a>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </>
            ) : (
              <>
                <a
                  href="/register"
                  className="form-button w-60 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-md text-lg text-center transition"
                >
                  Register
                </a>
                <a
                  href="/login"
                  className="form-button w-60 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-md text-lg text-center transition"
                >
                  Login
                </a>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Homepage;
