import React from "react";


//Account creatin confirmation 
const CreateAccountPage = () => {
  return (
    <div className="bg-[#0f172a] min-h-screen flex items-center justify-center px-6">
      {/* Container holding the button */}
      <div className="bg-[#1e293b] p-8 rounded-lg shadow-md text-center">
        <h1 className="text-3xl font-bold text-white mb-6">
          Welcome!
        </h1>
        <button className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition">
          Create Account
        </button>
      </div>
    </div>
  );
};

export default CreateAccountPage;
