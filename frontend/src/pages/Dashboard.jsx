import React, { useEffect, useState, useRef } from "react";

const Dashboard = () => {
  // Ref for the hidden file input to trigger profile picture upload
  const fileInputRef = useRef(null);

  // State to store the user's name, list of tests, and profile picture URL
  const [userName, setUserName] = useState("");
  const [tests, setTests] = useState([]);
  const [profilePic, setProfilePic] = useState(null);

  // On component mount, load user data from localStorage
  useEffect(() => {
    setUserName(localStorage.getItem("userName") || "User");
    setTests(JSON.parse(localStorage.getItem("userTests")) || []);
    const storedPic = localStorage.getItem("profilePic");
    if (storedPic) setProfilePic(storedPic);
  }, []);

  // Calculate total tests and questions for statistics
  // Compute average questions per test, with one decimal
  const totalTests = tests.length;
  const totalQuestions = tests.reduce((acc, t) => acc + t.questions.length, 0);
  const averageQuestions = totalTests > 0 ? (totalQuestions / totalTests).toFixed(1) : 0;

  // Handle file selection and read the selected image
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result;
      // Update state and persist the new profile picture
      setProfilePic(dataUrl);
      localStorage.setItem("profilePic", dataUrl);
    };
    reader.readAsDataURL(file);
  };

  // Programmatically trigger the file input click
  const triggerFileSelect = () => fileInputRef.current.click();

  return (
    <div className="bg-[#0f172a] min-h-screen p-8 text-white">
      <div className="max-w-5xl mx-auto text-center">
        {/* Profile Section */}
        <div className="flex flex-col items-center mb-8">
          <div
            className="w-24 h-24 bg-white rounded-full overflow-hidden cursor-pointer"
            onClick={triggerFileSelect} // Click avatar to change photo
          >
            {profilePic ? (
              // Show uploaded profile picture
              <img src={profilePic} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              // Show first letter of userName if no picture
              <span className="text-2xl text-gray-600 leading-[6rem]">
                {userName.charAt(0)}
              </span>
            )}
          </div>
          {/* Hidden file input for image upload */}
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            className="hidden"
            onChange={handleFileChange}
          />
          {/* Button to change profile photo */}
          <button
            className="mt-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded"
            onClick={triggerFileSelect}
          >
            Change Photo
          </button>

          {/* Welcome message */}
          <h1 className="text-3xl font-bold mt-4">Welcome, {userName}!</h1>
        </div>

        {/* Statistics Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-[#1e293b] p-6 rounded-lg text-center">
            <h2 className="text-xl font-semibold">Total Tests</h2>
            <p className="text-3xl mt-2 font-bold">{totalTests}</p>
          </div>
          <div className="bg-[#1e293b] p-6 rounded-lg text-center">
            <h2 className="text-xl font-semibold">Total Questions</h2>
            <p className="text-3xl mt-2 font-bold">{totalQuestions}</p>
          </div>
          <div className="bg-[#1e293b] p-6 rounded-lg text-center">
            <h2 className="text-xl font-semibold">Avg. Questions/Test</h2>
            <p className="text-3xl mt-2 font-bold">{averageQuestions}</p>
          </div>
        </div>

        {/* Recent Tests Section */}
        <div>
          <h2 className="text-2xl font-bold mb-4">Recent Tests</h2>
          {tests.length === 0 ? (
            // Message when no tests are available
            <p className="text-gray-400">You haven't created any tests yet.</p>
          ) : (
            // List up to 5 most recent tests
            <ul className="space-y-4">
              {tests.slice(0, 5).map((test) => (
                <li
                  key={test.id}
                  className="bg-[#1e293b] p-4 rounded-lg flex justify-between"
                >
                  {/* Test name and question count */}
                  <span className="font-semibold text-lg">{test.name}</span>
                  <span className="text-sm text-gray-400">
                    {test.questions.length} question{test.questions.length !== 1 ? "s" : ""}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
