import React from "react";
import flashcardImage from "../assets/flashcard.webp";
import teenagersImage from "../assets/teenagers.webp";
import scoreImage from "../assets/100.webp";

const Homepage = () => {
    return (
        <div className="bg-[#0f172a] min-h-screen flex flex-col items-center py-12 px-6 text-white">
            <div className="bg-[#1e293b] p-12 rounded-lg border border-gray-500 text-center max-w-6xl">
                
                <div className="mb-12">
                    <h1 className="text-4xl font-bold mb-6">Welcome to Exam Crack</h1>
                    <p className="text-lg">
                        Exam Crack is your ultimate study partner. Create flashcards, engage in interactive learning, and ace your exams with our advanced tools and resources. Join our community and start your journey toward academic success today!
                    </p>
                </div>

                
                <div className="flex flex-wrap justify-center items-center gap-8 mb-12">
                    <div className="w-80 h-56 bg-cover bg-center rounded-lg" style={{ backgroundImage: `url(${flashcardImage})` }}></div>
                    <div className="w-80 h-56 bg-cover bg-center rounded-lg" style={{ backgroundImage: `url(${teenagersImage})` }}></div>
                    <div className="w-80 h-56 bg-cover bg-center rounded-lg" style={{ backgroundImage: `url(${scoreImage})` }}></div>
                </div>

                
                <div className="text-center">
                    <h2 className="text-2xl font-bold mb-6">Join Today</h2>
                    <div className="flex flex-wrap justify-center gap-6">
                        <a href="/register" className="form-button w-60">Register</a>
                        <a href="/login" className="form-button w-60">Login</a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Homepage;
