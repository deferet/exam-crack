import React from "react";
import { Link } from "react-router-dom"; 

const Navbar = () => {
    return (
        <nav className="bg-[#1e293b] px-24 py-8 flex justify-between items-center font-bold">
            <Link to="/" className="text-white text-xl cursor-pointer">
                Exam Crack
            </Link>

            <div className="flex gap-6 px-4">
                <Link to="/mytests" className="bg-transparent text-white border-none cursor-pointer text-base font-bold hover:underline">
                    Mytests
                </Link>
                <Link to="/settings" className="bg-transparent text-white border-none cursor-pointer text-base font-bold hover:underline">
                    Settings
                </Link>
                <Link to="/login" className="bg-transparent text-white border-none cursor-pointer text-base font-bold hover:underline">
                    Login
                </Link>
                <Link to="/register" className="bg-transparent text-white border-none cursor-pointer text-base font-bold hover:underline">
                    Register
                </Link>
            </div>
        </nav>
    );
};

export default Navbar;
