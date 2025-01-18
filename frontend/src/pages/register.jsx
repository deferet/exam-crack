import React, { useState } from 'react';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

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
    setLoading(true);

    try {
      const response = await fetch('http://localhost:4000/v1/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        if (errorData.errors) {
          setError(Object.values(errorData.errors).join(' '));
        } else {
          setError('An error occurred while registering. Please try again.');
        }
        return;
      }

      const data = await response.json();
      console.log('Registration successful:', data);
      alert('Registration successful! You can now log in.');
    } catch (err) {
      console.error('Error:', err);
      setError('Something went wrong. Please try again later.');
    } finally {
      setLoading(false);
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
            disabled={loading}
          >
            {loading ? 'Submitting...' : 'Sign up'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;
