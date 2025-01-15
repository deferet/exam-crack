import React from "react";
import { Link, useLocation } from "react-router-dom";

const Navbar = () => {
  const location = useLocation();

  return (
    <nav className="bg-[#1e293b] px-6 md:px-24 py-4 flex justify-between items-center font-bold">
      {/* Logo */}
      <Link
        to="/"
        className="text-white text-lg md:text-xl cursor-pointer"
        style={{
          display: "flex",
          alignItems: "center",
        }}
      >
        Exam Crack
      </Link>

      {/* Hamburger Menu for Mobile */}
      <div className="md:hidden">
        <button
          className="text-white"
          onClick={() => {
            const menu = document.getElementById("mobile-menu");
            menu.classList.toggle("hidden");
          }}
        >
          ☰
        </button>
      </div>

      {/* Links */}
      <div
        id="mobile-menu"
        className="hidden md:flex gap-6 items-center absolute md:relative top-14 md:top-auto left-0 md:left-auto w-full md:w-auto bg-[#1e293b] md:bg-transparent py-4 md:py-0 px-6 md:px-0"
      >
        <Link
          to="/"
          className={`${
            location.pathname === "/"
              ? "bg-[#2563eb] text-white"
              : "bg-transparent text-white"
          } px-4 py-2 rounded cursor-pointer text-base font-bold hover:underline`}
        >
          Home
        </Link>
        <Link
          to="/mytests"
          className={`${
            location.pathname === "/mytests"
              ? "bg-[#2563eb] text-white"
              : "bg-transparent text-white"
          } px-4 py-2 rounded cursor-pointer text-base font-bold hover:underline`}
        >
          Mytests
        </Link>
        <Link
          to="/login"
          className={`${
            location.pathname === "/login"
              ? "bg-[#2563eb] text-white"
              : "bg-transparent text-white"
          } px-4 py-2 rounded cursor-pointer text-base font-bold hover:underline`}
        >
          Login
        </Link>
        <Link
          to="/register"
          className={`${
            location.pathname === "/register"
              ? "bg-[#2563eb] text-white"
              : "bg-transparent text-white"
          } px-4 py-2 rounded cursor-pointer text-base font-bold hover:underline`}
        >
          Register
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;