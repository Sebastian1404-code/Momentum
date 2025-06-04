import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard.jsx";
import ReceiptEntryPage from "./pages/ReceiptEntryPage.jsx";
import ReceiptUploader from "./pages/ReceiptUploader.jsx";
import MyReceipts from "./pages/MyReceipts.jsx";
import ReceiptDetail from "./pages/ReceiptDetail.jsx";
import CreateTask from "./pages/CreateTask.jsx";

function App() {
    return (
        <Router>
            <div className="min-h-screen w-full bg-gray-900 text-white">
                <Routes>
                    <Route path="/" element={<Navigate to="/login" />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/receipt" element={<ReceiptEntryPage />} />
                    <Route path="/upload" element={<ReceiptUploader />} />
                    <Route path="/my-receipts" element={<MyReceipts />} />
                    <Route path="/receipt/:id" element={<ReceiptDetail />} />
                    <Route path="/task" element={<CreateTask />} />




                    {/* Add more routes here as needed */}
                </Routes>
            </div>
        </Router>
    );
}

export default App;
