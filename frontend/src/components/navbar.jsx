import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

const Navbar = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";

    const handleLogout = () => {
        localStorage.removeItem("isLoggedIn");
        localStorage.removeItem("userName");
        alert("Logged out successfully!");
        window.location.reload();
    };

    const handleMyTestsClick = (e) => {
        if (!isLoggedIn) {
            e.preventDefault();
            alert("You must be logged in to access My Tests.");
            navigate("/login");
        }
    };

    return (
        <nav className="bg-[#1e293b] px-6 md:px-24 py-4 flex justify-between items-center font-bold">
            {/* Logo */}
            <Link to="/" className="text-white text-lg md:text-xl cursor-pointer">
                Exam Crack
            </Link>

            {/* Mobile menu toggle */}
            <div className="md:hidden">
                <button
                    className="text-white"
                    onClick={() => {
                        document.getElementById("mobile-menu").classList.toggle("hidden");
                    }}
                >
                    ☰
                </button>
            </div>

            {/* Menu links */}
            <div
                id="mobile-menu"
                className="hidden md:flex flex-col md:flex-row gap-6 items-center absolute md:relative top-14 md:top-auto left-0 md:left-auto w-full md:w-auto bg-[#1e293b] md:bg-transparent py-4 md:py-0 px-6 md:px-0"
            >
                <Link
                    to="/"
                    className={`px-4 py-2 rounded text-white hover:underline ${
                        location.pathname === "/" ? "bg-[#2563eb]" : ""
                    }`}
                >
                    Home
                </Link>

                <Link
                    to="/mytests"
                    onClick={handleMyTestsClick}
                    className={`px-4 py-2 rounded text-white hover:underline ${
                        location.pathname === "/mytests" ? "bg-[#2563eb]" : ""
                    }`}
                >
                    MyTests
                </Link>

                {/* Ikona profilu prowadząca do Dashboard */}
                {isLoggedIn && (
                    <button
                        onClick={() => navigate("/dashboard")}
                        className="w-10 h-10 bg-white rounded-full overflow-hidden p-1 flex-shrink-0"
                    >
                        {localStorage.getItem("profilePic") ? (
                            <img
                                src={localStorage.getItem("profilePic")}
                                alt="avatar"
                                className="w-full h-full object-cover rounded-full"
                            />
                        ) : (
                            <span className="text-[#1e293b] text-center block w-full h-full leading-8 font-bold">
                                {localStorage.getItem("userName")?.charAt(0) || "U"}
                            </span>
                        )}
                    </button>
                )}

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
                            className={`px-4 py-2 rounded text-white hover:underline ${
                                location.pathname === "/login" ? "bg-[#2563eb]" : ""
                            }`}
                        >
                            Login
                        </Link>
                        <Link
                            to="/register"
                            className={`px-4 py-2 rounded text-white hover:underline ${
                                location.pathname === "/register" ? "bg-[#2563eb]" : ""
                            }`}
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
