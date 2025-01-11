import React from 'react';
import { useNavigate } from 'react-router-dom';

// Custom button component with hover and active state handling
const Button = ({ label, path, onClick }) => {
  return (
    <button
      onClick={onClick}
      style={{
        padding: '0.5rem 1rem',
        backgroundColor: path === window.location.pathname ? '#2563eb' : '#1f2937', // Highlight active button
        color: '#ffffff',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        flexGrow: 0,  // Prevents buttons from growing
        flexShrink: 0,  // Prevents buttons from shrinking
        width: 'auto',  // Ensure the width is not stretched
        whiteSpace: 'nowrap',  // Prevent button text from breaking into new line
        transition: 'background-color 0.3s ease', // Smooth transition for background color
      }}
      onMouseOver={(e) => e.target.style.backgroundColor = '#3b82f6'}  // Lighter blue on hover
      onMouseOut={(e) => e.target.style.backgroundColor = path === window.location.pathname ? '#2563eb' : '#1f2937'} // Reset color
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
    <div style={{
      backgroundColor: '#1e293b',
      padding: '1rem 2rem',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      width: '100%',
      boxSizing: 'border-box',
      position: 'fixed',
      top: 0,
      left: 0,
      zIndex: 10,
      margin: 0,
    }}>
      <h1 style={{
        fontSize: '1.5rem',
        fontWeight: 'bold',
        margin: 0,
        color: '#ffffff',
      }}>
        Exam Crack
      </h1>
      
      <div style={{
        display: 'flex',
        gap: '1rem',
        flexGrow: 0,
        flexShrink: 0,
        alignItems: 'center',
      }}>
        <Button label="Home" path="/" onClick={() => handleNavigation('/')} />
        <Button label="Register" path="/register" onClick={() => handleNavigation('/register')} />
        <Button label="Login" path="/login" onClick={() => handleNavigation('/login')} />
        <Button label="Settings" path="/settings" onClick={() => handleNavigation('/settings')} />
        <Button label="Test" path="/test" onClick={() => handleNavigation('/test')} />
      </div>
    </div>
  );
};

export default Navbar;
