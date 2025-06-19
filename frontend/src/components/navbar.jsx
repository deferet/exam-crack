import React, { useEffect, useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";

const Navbar = () => {
  const location = useLocation();
  const navigate  = useNavigate();

  const [token,    setToken]    = useState(localStorage.getItem("token")    || "");
  const [userName, setUserName] = useState(localStorage.getItem("userName") || "User");

  
  const parseJwtName = (jwt) => {
    try {
      const payload = JSON.parse(atob(jwt.split(".")[1]));
      return payload.username || payload.email || payload.sub || null;
    } catch {
      return null;
    }
  };
  // ───────────────────────────────────────────────────────────

  
  useEffect(() => {
    setToken(localStorage.getItem("token")    || "");
    setUserName(localStorage.getItem("userName") || "User");
  }, [location]);

  // update username
  useEffect(() => {
    if (!token) return;

    
    const nameFromJwt = parseJwtName(token);
    if (nameFromJwt) {
      setUserName(nameFromJwt);
      localStorage.setItem("userName", nameFromJwt);
      return;
    }

    
    (async () => {
      try {
        const res = await fetch("/v1/users/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) return;
        const { user } = await res.json();
        if (user?.username) {
          setUserName(user.username);
          localStorage.setItem("userName", user.username);
        }
      } catch {/* ignores error */}
    })();
  }, [token]);

  const isLoggedIn = Boolean(token);
  const initial    = userName.charAt(0).toUpperCase();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userName");
    setToken("");
    setUserName("User");
    navigate("/");
  };

  return (
    <nav className="bg-[#1e293b] px-6 md:px-24 py-4 flex justify-between items-center font-bold text-white">
      <NavLink to="/" className="text-xl md:text-2xl hover:text-gray-300">
        Exam&nbsp;Crack
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
          My&nbsp;Tests
        </NavLink>

        {isLoggedIn ? (
          <>
            {/* avatar */}
            <button
              onClick={() => navigate("/dashboard")}
              className="w-10 h-10 flex items-center justify-center rounded-full bg-white text-[#0f172a] font-semibold border-2 border-white"
              title="Go to dashboard"
            >
              {initial}
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
