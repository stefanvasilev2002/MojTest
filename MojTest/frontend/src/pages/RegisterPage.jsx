// src/pages/RegisterPage.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuthActions from "../hooks/useAuthActions";

const RegisterPage = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState(null);
    const navigate = useNavigate();
    const { handleRegister, loading, error } = useAuthActions();

    const handleSubmit = async () => {
        const { success } = await handleRegister(username, password, role);
        if (success) {
            navigate(role === "teacher" ? "/teacher-dashboard" : "/student-dashboard");
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
                <h2 className="text-2xl font-semibold text-center mb-4">Register</h2>

                {/* Register Form */}
                <div>
                    <label className="block mb-2 text-gray-600">Username</label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="w-full p-3 mb-4 border rounded-lg"
                        placeholder="Enter your username"
                    />
                </div>

                <div>
                    <label className="block mb-2 text-gray-600">Password</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full p-3 mb-4 border rounded-lg"
                        placeholder="Enter your password"
                    />
                </div>

                {/* Role selection */}
                <div className="mb-4">
                    <label className="block mb-2 text-gray-600">Select Role</label>
                    <div className="flex gap-4">
                        <button
                            onClick={() => setRole("teacher")}
                            className={`w-1/2 p-3 border rounded-lg ${role === "teacher" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
                        >
                            Teacher
                        </button>
                        <button
                            onClick={() => setRole("student")}
                            className={`w-1/2 p-3 border rounded-lg ${role === "student" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
                        >
                            Student
                        </button>
                    </div>
                </div>

                {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

                <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="w-full p-3 bg-blue-500 text-white rounded-lg"
                >
                    {loading ? "Registering..." : "Register"}
                </button>
            </div>
        </div>
    );
};

export default RegisterPage;
