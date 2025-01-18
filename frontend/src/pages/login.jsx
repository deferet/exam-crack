import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleLogin = async () => {
        try {
            // Wysyłanie żądania do backendu
            const response = await fetch("http://localhost:4000/v1/login", { // Zastąp port swoim, jeśli inny
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password }), // Dane wysyłane w JSON
            });

            if (!response.ok) {
                throw new Error("Invalid login credentials");
            }

            // Odczyt odpowiedzi JSON z backendu
            const data = await response.json();

            // Przechowaj token i nazwę użytkownika w localStorage (symulacja sesji)
            localStorage.setItem("token", data.token);
            localStorage.setItem("userName", data.userName);

            alert("Logged in successfully!");
            navigate("/mytests"); // Przekierowanie na stronę z testami
        } catch (error) {
            alert(error.message); // Wyświetlenie błędu logowania
        }
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
                        e.preventDefault(); // Zapobiega domyślnej akcji
                        handleLogin(); // Obsługuje logowanie
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
                            onChange={(e) => setEmail(e.target.value)}
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
                            onChange={(e) => setPassword(e.target.value)}
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
