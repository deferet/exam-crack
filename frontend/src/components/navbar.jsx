import React from 'react';
import { useNavigate } from 'react-router-dom';

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
    }}>
      <h1 style={{
        fontSize: '1.5rem',
        fontWeight: 'bold',
        margin: 0,
      }}>Exam Crack</h1>
      <div style={{
        display: 'flex',
        gap: '1rem',
      }}>
        <button onClick={() => handleNavigation('/')} style={{
          padding: '0.5rem 1rem',
          backgroundColor: '#2563eb',
          color: '#ffffff',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
        }}>Home</button>
        <button onClick={() => handleNavigation('/register')} style={{
          padding: '0.5rem 1rem',
          backgroundColor: '#1f2937',
          color: '#ffffff',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
        }}>Register</button>
        <button onClick={() => handleNavigation('/login')} style={{
          padding: '0.5rem 1rem',
          backgroundColor: '#1f2937',
          color: '#ffffff',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
        }}>Login</button>
        <button onClick={() => handleNavigation('/settings')} style={{
          padding: '0.5rem 1rem',
          backgroundColor: '#1f2937',
          color: '#ffffff',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
        }}>Settings</button>
        <button onClick={() => handleNavigation('/test')} style={{
          padding: '0.5rem 1rem',
          backgroundColor: '#1f2937',
          color: '#ffffff',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
        }}>Test</button>
      </div>
    </div>
  );
};

export default Navbar;
