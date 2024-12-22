import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import Navbar from './components/navbar.jsx';
import Homepage from './pages/homepage.jsx';
import Login from './pages/login.jsx';
import Register from './pages/register.jsx';

const App = () => {
  return (
    <Router>
      <div>
        <Navbar />
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
