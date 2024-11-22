import React from 'react';

const Navbar = () => {
  return (
    <nav style={{
      backgroundColor: '#1e293b', 
      padding: '2rem 6rem', 
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      fontWeight: 'bold' 
    }}>
      <div style={{
        color: '#ffffff', 
        fontSize: '1.5rem',
        fontWeight: 'bold',
        cursor:'pointer',
      }}>
        Exam-crack
      </div>

      <div style={{
        display: 'flex',
        gap: '1.5rem', 
        padding: '0 1rem' 
      }}>
        <button style={{
          backgroundColor: 'transparent',
          color: '#ffffff',
          border: 'none',
          cursor: 'pointer',
          fontSize: '1rem',
          fontWeight: 'bold' 
        }}>
          Mytests
        </button>
        <button style={{
          backgroundColor: 'transparent',
          color: '#ffffff',
          border: 'none',
          cursor: 'pointer',
          fontSize: '1rem',
          fontWeight: 'bold' 
        }}>
          Settings
        </button>
        <button style={{
          backgroundColor: 'transparent',
          color: '#ffffff',
          border: 'none',
          cursor: 'pointer',
          fontSize: '1rem',
          fontWeight: 'bold' 
        }}>
          Login
        </button>
        <button style={{
          backgroundColor: 'transparent',
          color: '#ffffff',
          border: 'none',
          cursor: 'pointer',
          fontSize: '1rem',
          fontWeight: 'bold' 
        }}>
          Register
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
