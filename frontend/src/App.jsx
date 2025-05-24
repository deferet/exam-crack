import React from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Navbar from "./components/navbar";
import Homepage from "./pages/homepage";
import Register from "./pages/register";
import MyTests from "./pages/MyTests";
import Login from "./pages/login";
import Dashboard from "./pages/Dashboard";

const App = () => {
    return (
        <Router>
            <Navbar />
            <div className="bg-[#0f172a] min-h-screen text-white">
                <Routes>
                    <Route path="/" element={<Homepage />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/mytests" element={<MyTests />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                </Routes>
            </div>
        </Router>
    );
};

export default App;
