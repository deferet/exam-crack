import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Navbar from "./components/navbar";
import Homepage from "./pages/homepage";
import Login from "./pages/login";
import Register from "./pages/register";
import Dashboard from "./pages/Dashboard";
import MyTests from "./pages/MyTests";

// Komponent chroniący trasy
const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  return token
    ? children
    : <Navigate to="/login" replace />;
};

const App = () => (
  <Router>
    <Navbar />

    <div className="bg-[#0f172a] min-h-screen text-white">
      <Routes>
        {/* PUBLICZNE */}
        <Route path="/" element={<Homepage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* CHRONIONE */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/mytests"
          element={
            <PrivateRoute>
              <MyTests />
            </PrivateRoute>
          }
        />

        {/* WSZYSTKIE INNE → strona główna */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  </Router>
);

export default App;
