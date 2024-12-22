import React from "react";
import { useNavigate } from "react-router-dom";

const Button = ({ label, path, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="navbar-button"
      style={{
        backgroundColor: path === window.location.pathname ? "#2563eb" : "#1f2937", // Highlight active button
        color: "#ffffff",
        whiteSpace: "nowrap", // Prevent button text from breaking into new line
      }}
      onMouseOver={(e) => e.target.style.backgroundColor = "#3b82f6"} // Lighter blue on hover
      onMouseOut={(e) =>
        e.target.style.backgroundColor = path === window.location.pathname ? "#2563eb" : "#1f2937"
      } // Reset color
    >
      {label}
    </button>
  );
};

const Navbar = () => {
  const navigate = useNavigate();

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <nav className="bg-[#1e293b] px-24 py-8 flex justify-between items-center font-bold fixed top-0 left-0 w-full z-10">
      {/* Logo */}
      <div className="text-white text-xl cursor-pointer">Exam Crack</div>

      {/* Dynamic Links */}
      <div className="flex gap-6">
        <Button label="Home" path="/" onClick={() => handleNavigation("/")} />
        <Button label="Register" path="/register" onClick={() => handleNavigation("/register")} />
        <Button label="Login" path="/login" onClick={() => handleNavigation("/login")} />
        <Button label="Settings" path="/settings" onClick={() => handleNavigation("/settings")} />
        <Button label="Test" path="/test" onClick={() => handleNavigation("/test")} />
      </div>
    </nav>
  );
};

export default Navbar;
