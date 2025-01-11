import React from "react";
import { Link, useLocation } from "react-router-dom";

const Navbar = () => {
  const location = useLocation();

  return (
    <nav className="bg-[#1e293b] px-24 py-6 flex justify-between items-center font-bold">
      {/* Logo */}
      <Link
        to="/"
        className="text-white text-xl cursor-pointer"
        style={{
          display: "flex",
          alignItems: "center",
          height: "100%",
        }}
      >
        Exam Crack
      </Link>

      {/* Links */}
      <div className="flex gap-8">
        <Link
          to="/mytests"
          className={`${
            location.pathname === "/mytests" ? "bg-[#2563eb] text-white" : "bg-transparent text-white"
          } px-4 py-2 rounded cursor-pointer text-base font-bold hover:underline`}
        >
          Mytests
        </Link>
        <Link
          to="/settings"
          className={`${
            location.pathname === "/settings" ? "bg-[#2563eb] text-white" : "bg-transparent text-white"
          } px-4 py-2 rounded cursor-pointer text-base font-bold hover:underline`}
        >
          Settings
        </Link>
        <Link
          to="/login"
          className={`${
            location.pathname === "/login" ? "bg-[#2563eb] text-white" : "bg-transparent text-white"
          } px-4 py-2 rounded cursor-pointer text-base font-bold hover:underline`}
        >
          Login
        </Link>
        <Link
          to="/register"
          className={`${
            location.pathname === "/register" ? "bg-[#2563eb] text-white" : "bg-transparent text-white"
          } px-4 py-2 rounded cursor-pointer text-base font-bold hover:underline`}
        >
          Register
        </Link>
        <Link
          to="/test"
          className={`${
            location.pathname === "/test" ? "bg-[#2563eb] text-white" : "bg-transparent text-white"
          } px-4 py-2 rounded cursor-pointer text-base font-bold hover:underline`}
        >
          Test
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
