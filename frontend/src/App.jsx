import React from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import Navbar from './components/navbar.jsx';
import Homepage from './pages/homepage.jsx';
import Register from './pages/register.jsx';

const App = () => {
  return (
    <Router>
      <div style={{}}>
        <Navbar style={{}} />
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;