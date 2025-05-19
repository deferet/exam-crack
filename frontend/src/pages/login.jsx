// Changes made to the original code:
// 1. Added `useState` and `useNavigate` hooks to manage email, password, and navigation logic.
// 2. Implemented a basic login simulation using hardcoded credentials ("test@example.com" and "password").
//    This temporary solution allows you to test the navbar functionality for a logged-in user.
// 3. If login is successful, user data is saved in `localStorage` to simulate a session.
// 4. The `handleLogin` function was added to validate the login credentials and navigate to `/mytests` upon success.
// 5. The login form now prevents the default form submission and calls `handleLogin` for logic execution. 

import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleLogin = async () => {
        // Temporary simulation of login functionality for testing navbar
        if (email === "test@example.com" && password === "password") {
            // Store login status and username in localStorage to simulate a session
            localStorage.setItem("isLoggedIn", "true");
            localStorage.setItem("userName", "Test User");
            alert("Logged in successfully!");
            navigate("/mytests"); // Redirect to MyTests page
            return;
        }

        alert("Invalid email or password."); // Handle invalid credentials
    };

    return (
        <div className="bg-gray-900 text-white min-h-screen p-12 pt-16 flex flex-col items-center font-sans">
            {/* Header */}
            <div className="max-w-xl text-center mb-8">
                <h1 className="text-4xl font-bold">THE NEXT GENERATION OF LEARNING</h1>
            </div>

            {/* Login form */}
            <div className="max-w-md w-full p-12 bg-gray-800 rounded-lg">
                <h2 className="text-2xl mb-4 text-center">Exam Crack</h2>
                <form
                    onSubmit={(e) => {
                        e.preventDefault(); // Prevent default form submission
                        handleLogin(); // Call the login handler
                    }}
                >
                    <div className="mb-4">
                        <label htmlFor="email" className="block mb-2">Email*</label>
                        <input
                            type="email"
                            id="email"
                            className="w-full p-3 rounded-md border border-gray-400 bg-gray-700 text-white"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)} // Update email state
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="password" className="block mb-2">Password*</label>
                        <input
                            type="password"
                            id="password"
                            className="w-full p-3 rounded-md border border-gray-400 bg-gray-700 text-white"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)} // Update password state
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full p-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-lg"
                    >
                        Log in
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;
