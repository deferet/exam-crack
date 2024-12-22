import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Homepage from "./pages/homepage";
import MyTests from "./pages/MyTests";
import Navbar from "./components/navbar";
import Register from "./pages/Register";
import Login from "./pages/Login";

const App = () => {
    return (
        <Router>
            <Navbar />
            <div className="bg-[#0f172a] min-h-screen text-white">
                <Routes>
                    <Route path="/" element={<Homepage />} />
                    <Route path="/mytests" element={<MyTests />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/login" element={<Login />} />
                </Routes>
            </div>
        </Router>
    );
};

export default App;
