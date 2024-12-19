import React from "react";

const Homepage = () => {
    return (
        <div className="bg-[#0f172a] min-h-screen flex flex-col items-center justify-start py-12 px-6 text-white">
            {/* Header */}
            <div className="max-w-lg text-center mb-8">
                <h1 className="text-4xl font-bold">
                    THE NEXT GENERATION OF LEARNING
                </h1>
            </div>

            {/* Registration and login */}
            <div className="form-container">
                <h2 className="form-title">Exam Crack</h2>
                <form>
                    <div className="form-group">
                        <label htmlFor="email" className="form-label">Email*</label>
                        <input
                            type="email"
                            id="email"
                            className="form-input"
                            placeholder="Enter your email"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password" className="form-label">Password*</label>
                        <input
                            type="password"
                            id="password"
                            className="form-input"
                            placeholder="Enter your password"
                            required
                        />
                    </div>
                    <button type="submit" className="form-button">
                        Log in
                    </button>
                    <p className="form-separator">or</p>
                    <button type="button" className="form-button">
                        Sign up
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Homepage;
