import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

const Navbar = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";

    const handleLogout = () => {
        localStorage.removeItem("isLoggedIn");
        alert("Logged out successfully!");
        window.location.reload(); // Refresh the page to update the navbar
    };

    const handleMyTestsClick = (e) => {
        if (!isLoggedIn) {
            e.preventDefault();
            alert("You must be logged in to access My Tests.");
            navigate("/login"); // Redirect to login
        }
    };

    return (
        <nav className="bg-[#1e293b] px-6 md:px-24 py-4 flex justify-between items-center font-bold">
            {/* Logo */}
            <Link to="/" className="text-white text-lg md:text-xl cursor-pointer">
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
                className="hidden md:flex flex-col md:flex-row gap-6 md:gap-6 items-center absolute md:relative top-14 md:top-auto left-0 md:left-auto w-full md:w-auto bg-[#1e293b] md:bg-transparent py-4 md:py-0 px-6 md:px-0"
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
                    onClick={handleMyTestsClick}
                    className={`${
                        location.pathname === "/mytests"
                            ? "bg-[#2563eb] text-white"
                            : "bg-transparent text-white"
                    } px-4 py-2 rounded cursor-pointer text-base font-bold hover:underline`}
                >
                    MyTests
                </Link>

                {isLoggedIn ? (
                    <button
                        onClick={handleLogout}
                        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                    >
                        Logout
                    </button>
                ) : (
                    <>
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
                    </>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
