import axios from 'axios';
import { useState } from 'react';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    surname: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setError('');

    try {
      // Rejestracja
      const registerResponse = await axios.post('http://localhost:4000/v1/users', {
        name: formData.name,
        surname: formData.surname,
        username: formData.username,
        email: formData.email,
        password: formData.password,
        userType: 'standard',
      });

      // Automatyczne logowanie po rejestracji
      const loginResponse = await axios.post('http://localhost:4000/v1/tokens/authentication', {
        email: formData.email,
        password: formData.password,
      });

      const { token } = loginResponse.data;
      localStorage.setItem('authToken', token);

      alert('Registration and login successful!');
      window.location.href = '/dashboard'; // zmień ścieżkę jeśli chcesz

    } catch (err) {
      if (err.response?.data?.error) {
        const errorObj = err.response.data.error;
        const firstError = Object.values(errorObj)[0];
        setError(firstError || 'Registration failed');
      } else {
        setError('Server error. Please try again later.');
      }
    }
  };

  return (
    <div className="bg-gray-900 text-white min-h-screen p-12 flex flex-col items-center">
      <div className="max-w-lg text-center mb-8">
        <h1 className="text-4xl font-bold">THE NEXT GENERATION OF LEARNING</h1>
      </div>

      <div className="bg-gray-800 p-8 rounded-lg max-w-md w-full">
        <h2 className="text-2xl mb-6 text-center">Exam Crack</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="name" className="block mb-2">Name*</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full p-3 rounded bg-gray-700 text-white"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="surname" className="block mb-2">Surname*</label>
            <input
              type="text"
              id="surname"
              name="surname"
              value={formData.surname}
              onChange={handleChange}
              required
              className="w-full p-3 rounded bg-gray-700 text-white"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="username" className="block mb-2">Username*</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              className="w-full p-3 rounded bg-gray-700 text-white"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="email" className="block mb-2">Email*</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full p-3 rounded bg-gray-700 text-white"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="block mb-2">Password*</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full p-3 rounded bg-gray-700 text-white"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="confirmPassword" className="block mb-2">Confirm Password*</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              className="w-full p-3 rounded bg-gray-700 text-white"
            />
          </div>
          {error && <p className="text-red-500 mb-4">{error}</p>}
          <button
            type="submit"
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 rounded text-white font-semibold"
          >
            Sign up
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;
