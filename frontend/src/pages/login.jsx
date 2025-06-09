import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    setError(""); // wyczyść poprzedni błąd
    try {
      const response = await axios.post("http://localhost:4000/v1/tokens/authentication", {
        email,
        password,
      });

      const { token } = response.data;
      localStorage.setItem("authToken", token); // zapis tokena
      localStorage.setItem("isLoggedIn", "true");

      alert("Logged in successfully!");
      navigate("/mytests");
    } catch (err) {
      if (err.response?.data?.error) {
        const errorObj = err.response.data.error;
        const firstError = Object.values(errorObj)[0];
        setError(firstError || "Login failed");
      } else {
        setError("Server error. Please try again later.");
      }
    }
  };

  return (
    <div className="bg-gray-900 text-white min-h-screen p-12 pt-16 flex flex-col items-center font-sans">
      <div className="max-w-xl text-center mb-8">
        <h1 className="text-4xl font-bold">THE NEXT GENERATION OF LEARNING</h1>
      </div>

      <div className="max-w-md w-full p-12 bg-gray-800 rounded-lg">
        <h2 className="text-2xl mb-4 text-center">Exam Crack</h2>
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
          {error && <p className="text-red-500 mb-4">{error}</p>}
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
