import React from 'react';
import { useNavigate } from 'react-router-dom';

const Homepage = () => {
  const navigate = useNavigate();

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <div style={{
      backgroundColor: '#0f172a', 
      color: '#ffffff', 
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column', 
      fontFamily: 'Inter, sans-serif'
    }}>
      {/* Navigation Bar */}
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

      {/* Main Content */}
      <div style={{
        flex: 1,
        padding: '3rem 4rem',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
      }}>
        <h1 style={{
          fontSize: '2.5rem',
          fontWeight: 'bold',
          marginBottom: '2rem',
        }}>THE NEXT GENERATION OF LEARNING</h1>
        <p style={{
          fontSize: '1.25rem',
          color: '#cbd5e1',
        }}>
          Welcome to Exam Crack. Empower your learning journey with us!
        </p>
      </div>
    </div>
  );
};

export default Homepage;
