import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const API_BASE = "http://localhost:4000";

const Login = () => {
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [error, setError]       = useState("");
  const navigate                = useNavigate();

  const handleLogin = async () => {
    setError("");
    try {
      // 1) Pobierz token
      const authRes = await fetch(`${API_BASE}/v1/tokens/authentication`, {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ email, password }),
      });
      const authData = await authRes.json();
      if (!authRes.ok) {
        if (authData.errors) {
          const key = Object.keys(authData.errors)[0];
          setError(authData.errors[key]);
        } else {
          setError(authData.message || "Nieprawidłowe dane logowania");
        }
        return;
      }

      // 2) Zapisz token
      const token = authData.authentication_token.token;
      localStorage.setItem("token", token);

      // 3) Odłóż istniejące userName z rejestracji, nie nadpisuj
      // Jeśli chcesz, pobierz avatar z osobnego endpointu, zapisując profilePic

      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      setError("Błąd połączenia z serwerem");
    }
  };

  return (
    <div className="bg-gray-900 text-white min-h-screen p-12 pt-16 flex flex-col items-center">
      <div className="max-w-xl text-center mb-8">
        <h1 className="text-4xl font-bold">THE NEXT GENERATION OF LEARNING</h1>
      </div>

      {error && <p className="text-red-400 mb-4">{error}</p>}

      <div className="max-w-md w-full p-12 bg-gray-800 rounded-lg">
        <h2 className="text-2xl mb-4 text-center">Exam Crack – Log in</h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleLogin();
          }}
        >
          <div className="mb-4">
            <label htmlFor="email" className="block mb-2">Email*</label>
            <input
              type="email"
              id="email"
              className="w-full p-3 rounded border border-gray-400 bg-gray-700 text-white"
              required
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError("");
              }}
            />
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="block mb-2">Password*</label>
            <input
              type="password"
              id="password"
              className="w-full p-3 rounded border border-gray-400 bg-gray-700 text-white"
              required
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError("");
              }}
            />
          </div>
          <button
            type="submit"
            className="w-full p-4 bg-blue-600 text-white rounded hover:bg-blue-700 text-lg"
          >
            Log in
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
