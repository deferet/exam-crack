import React from "react";
import scoreImage from "../assets/100.webp";
import flashcardImage from "../assets/flashcard.webp";
import teenagersImage from "../assets/teenagers.webp";

const Homepage = () => {
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true"; // Sprawdź, czy użytkownik jest zalogowany

  return (
    <div className="bg-[#0f172a] min-h-screen flex flex-col items-center py-12 px-6 text-white">
      {/* Main Container */}
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

        {/* Call-to-Action Section */}
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-6">Join Today</h2>
          <div className="flex flex-wrap justify-center gap-6">
            {isLoggedIn ? (
              <a
                href="/mytests"
                className="form-button w-60 bg-green-600 hover:bg-green-700 text-white py-3 rounded-md text-lg text-center transition"
              >
                Browse Tests
              </a>
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
