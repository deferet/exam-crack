import React from "react";

const Navbar = () => {
    return (
        <nav className="bg-[#1e293b] px-24 py-8 flex justify-between items-center font-bold">
            {/* Logo */}
            <div className="text-white text-xl cursor-pointer">
                Exam Crack
            </div>

            {/* Links */}
            <div className="flex gap-6 px-4">
                <button className="navbar-button">Mytests</button>
                <button className="navbar-button">Settings</button>
                <button className="navbar-button">Login</button>
                <button className="navbar-button">Register</button>
            </div>
        </nav>
    );
};

export default Navbar;
