import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Navbar from "./components/navbar";
import Homepage from "./pages/homepage";
import Register from "./pages/login";
import MyTests from "./pages/MyTests";
import Login from "./pages/register";

const App = () => {
    return (
        <Router>
            <Navbar />
            <div className="bg-[#0f172a] min-h-screen text-white">
                <Routes>
                    <Route path="/" element={<Homepage />} />
                    <Route path="/mytests" element={<MyTests />} />
                    <Route path="/login" element={<Register />} />
                    <Route path="/register" element={<Login />} />
                </Routes>
            </div>
        </Router>
    );
};

export default App;
