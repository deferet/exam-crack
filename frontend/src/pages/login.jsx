import React from 'react';

const Login = () => {
  return (
    <div className="bg-gray-900 text-white min-h-screen p-12 pt-16 flex flex-col items-center font-sans">
      {/* Header */}
      <div className="max-w-xl text-center mb-8">
        <h1 className="text-4xl font-bold">THE NEXT GENERATION OF LEARNING</h1>
      </div>

      {/* Login form */}
      <div className="max-w-md w-full p-12 bg-gray-800 rounded-lg">
        <h2 className="text-2xl mb-4 text-center">Exam Crack</h2>
        <form>
          <div className="mb-4">
            <label htmlFor="email" className="block mb-2">Email*</label>
            <input
              type="email"
              id="email"
              className="w-full p-3 rounded-md border border-gray-400 bg-gray-700 text-white"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="block mb-2">Password*</label>
            <input
              type="password"
              id="password"
              className="w-full p-3 rounded-md border border-gray-400 bg-gray-700 text-white"
              required
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
