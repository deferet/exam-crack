import React from 'react';

const Register = () => {
  return (
    <div style={{
      backgroundColor: '#0f172a', 
      color: '#ffffff', 
      minHeight: '100vh',
      padding: '3rem 4rem', 
      display: 'flex',
      flexDirection: 'column', 
      justifyContent: 'flex-start',
      alignItems: 'center',
      fontFamily: 'Inter, sans-serif'
    }}>
      {/* Header */}
      <div style={{
        maxWidth: '600px',
        textAlign: 'center',
        marginBottom: '2rem' 
      }}>
        <h1 style={{
          fontSize: '2.5rem', 
          fontWeight: 'bold'
        }}>THE NEXT GENERATION OF LEARNING</h1>
        
      </div>

      {/* Registration and login */}
      <div style={{
        maxWidth: '400px',
        width: '100%',
        padding: '3rem',
        backgroundColor: '#1e293b', 
        borderRadius: '8px'
      }}>
        <h2 style={{
          fontSize: '2rem',
          marginBottom: '1rem',
          textAlign: 'center'
        }}>Exam Crack</h2>
        <form>
          <div style={{
            marginBottom: '1rem'
          }}>
            <label htmlFor="email" style={{
              display: 'block',
              marginBottom: '0.5rem'
            }}>Email*</label>
            <input
              type="email"
              id="email"
              style={{
                width: '100%',
                padding: '0.75rem',
                borderRadius: '4px',
                border: '1px solid #cbd5e1',
                backgroundColor: '#334155',
                color: '#ffffff'
              }}
              required
            />
          </div>
          <div style={{
            marginBottom: '1rem'
          }}>
            <label htmlFor="password" style={{
              display: 'block',
              marginBottom: '0.5rem'
            }}>Password*</label>
            <input
              type="password"
              id="password"
              style={{
                width: '100%',
                padding: '0.75rem',
                borderRadius: '4px',
                border: '1px solid #cbd5e1',
                backgroundColor: '#334155',
                color: '#ffffff'
              }}
              required
            />
          </div>
          <button type="button" style={{
            width: '100%',
            padding: '1rem',
            backgroundColor: '#2563eb',
            color: '#ffffff',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '1.25rem',
            marginBottom: '1rem'
          }}>Log in</button>
          <p style={{
            textAlign: 'center',
            margin: '1rem 0'
          }}>or</p>
          <button type="submit" style={{
            width: '100%',
            padding: '1rem',
            backgroundColor: '#2563eb',
            color: '#ffffff',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '1.25rem'
          }}>Sign up</button>
        </form>
      </div>
    </div>
  );
};

export default Register;
