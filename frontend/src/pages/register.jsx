import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [formData, setFormData] = useState({
    username:        "",
    email:           "",
    password:        "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const navigate         = useNavigate();

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError("");
  };

  const handleSubmit = async e => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setError("Hasła muszą być takie same");
      return;
    }

    try {
      const response = await fetch("http://localhost:4000/v1/users", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({
          username: formData.username,
          email:    formData.email,
          password: formData.password,
          userType: "standard",
          name:     "",
          surname:  "",
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.errors) {
          const key = Object.keys(data.errors)[0];
          setError(data.errors[key]);
        } else if (data.message) {
          setError(data.message);
        } else {
          setError("Coś poszło nie tak przy rejestracji");
        }
        return;
      }

      alert("Rejestracja przebiegła pomyślnie. Teraz możesz się zalogować.");
      navigate("/login");
    } catch (err) {
      console.error("Błąd fetch:", err);
      setError("Nie udało się połączyć z serwerem");
    }
  };

  return (
    <div className="bg-gray-900 text-white min-h-screen p-12 flex flex-col items-center font-sans">
      <div className="max-w-lg text-center mb-8">
        <h1 className="text-4xl font-bold">THE NEXT GENERATION OF LEARNING</h1>
      </div>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      <div className="bg-gray-800 p-8 rounded-lg max-w-md w-full">
        <h2 className="text-2xl mb-6 text-center">Rejestracja</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="username" className="block mb-2">Username*</label>
            <input
              id="username"
              name="username"
              type="text"
              required
              className="w-full p-3 rounded bg-gray-700 text-white"
              value={formData.username}
              onChange={handleChange}
            />
          </div>

          <div className="mb-4">
            <label htmlFor="email" className="block mb-2">Email*</label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="w-full p-3 rounded bg-gray-700 text-white"
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          <div className="mb-4">
            <label htmlFor="password" className="block mb-2">Hasło*</label>
            <input
              id="password"
              name="password"
              type="password"
              required
              className="w-full p-3 rounded bg-gray-700 text-white"
              value={formData.password}
              onChange={handleChange}
            />
          </div>

          <div className="mb-4">
            <label htmlFor="confirmPassword" className="block mb-2">Powtórz hasło*</label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              required
              className="w-full p-3 rounded bg-gray-700 text-white"
              value={formData.confirmPassword}
              onChange={handleChange}
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 rounded text-white font-semibold"
          >
            Zarejestruj się
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;
