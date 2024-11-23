import React from 'react';

const Homepage = () => {
  return (
    <div style={{
      backgroundColor: '#0f172a', 
      color: '#ffffff', 
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column', 
      fontFamily: 'Inter, sans-serif'
    }}>
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
