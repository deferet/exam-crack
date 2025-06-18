import React, { useState, useEffect } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [token, setToken]         = useState(localStorage.getItem("token") || "");
  const [userName, setUserName]   = useState(localStorage.getItem("userName") || "");
  const [profilePic, setProfilePic] = useState(localStorage.getItem("profilePic") || "");

  useEffect(() => {
    setToken(localStorage.getItem("token") || "");
    setUserName(localStorage.getItem("userName") || "");
    setProfilePic(localStorage.getItem("profilePic") || "");
  }, [location]);

  const isLoggedIn = Boolean(token);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken("");
    navigate("/");
  };

  return (
    <nav className="bg-[#1e293b] px-6 md:px-24 py-4 flex justify-between items-center font-bold text-white">
      <NavLink to="/" className="text-xl md:text-2xl hover:text-gray-300">
        Exam Crack
      </NavLink>

      <div className="flex gap-6 items-center">
        <NavLink
          to="/"
          end
          className={({ isActive }) =>
            `px-4 py-2 rounded hover:underline ${isActive ? "bg-[#2563eb]" : ""}`
          }
        >
          Home
        </NavLink>

        <NavLink
          to="/mytests"
          className={({ isActive }) =>
            `px-4 py-2 rounded hover:underline ${isActive ? "bg-[#2563eb]" : ""}`
          }
        >
          My Tests
        </NavLink>

        {isLoggedIn ? (
          <>
            <button
              onClick={() => navigate("/dashboard")}
              className="w-10 h-10 rounded-full overflow-hidden p-1 border-2 border-white"
            >
              {profilePic ? (
                <img src={profilePic} alt="avatar" className="w-full h-full object-cover" />
              ) : (
                <span className="block w-full h-full leading-8 text-center text-black bg-white rounded-full">
                  {userName.charAt(0).toUpperCase()}
                </span>
              )}
            </button>

            <button
              onClick={handleLogout}
              className="bg-red-500 px-4 py-2 rounded hover:bg-red-600"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <NavLink
              to="/login"
              className={({ isActive }) =>
                `px-4 py-2 rounded hover:underline ${isActive ? "bg-[#2563eb]" : ""}`
              }
            >
              Login
            </NavLink>
            <NavLink
              to="/register"
              className={({ isActive }) =>
                `px-4 py-2 rounded hover:underline ${isActive ? "bg-[#2563eb]" : ""}`
              }
            >
              Register
            </NavLink>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
