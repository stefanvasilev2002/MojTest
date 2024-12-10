import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuthActions from "../hooks/useAuthActions";
import { useTranslation } from "react-i18next";  // Import useTranslation hook

const LoginPage = () => {
    const { t } = useTranslation('common');  // Initialize translation hook
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState(null);
    const navigate = useNavigate();
    const { handleLogin, loading, error } = useAuthActions();

    const handleSubmit = async () => {
        const { success } = await handleLogin(username, password, role);
        if (success) {
            // if (role === "Teacher") {
            //     navigate("/teacher-dashboard");
            // } else if (role === "Student") {
                navigate("/student-dashboard");
            // } else if (role === "admin") {
            //     navigate("/crud/hub"); // Redirect to admin hub
            // }
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
                <h2 className="text-2xl font-semibold text-center mb-4">{t('loginPage.title')}</h2>

                {/* Login Form */}
                <div>
                    <label className="block mb-2 text-gray-600">{t('loginPage.username')}</label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="w-full p-3 mb-4 border rounded-lg"
                        placeholder={t('loginPage.enterUsername')}
                    />
                </div>

                <div>
                    <label className="block mb-2 text-gray-600">{t('loginPage.password')}</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full p-3 mb-4 border rounded-lg"
                        placeholder={t('loginPage.enterPassword')}
                    />
                </div>

                {/* Role selection */}
                <div className="mb-4">
                    <label className="block mb-2 text-gray-600">{t('loginPage.selectRole')}</label>  {/* Translated label */}
                    <div className="flex gap-4">
                        <button
                            onClick={() => setRole("teacher")}
                            className={`w-1/3 p-3 border rounded-lg ${role === "teacher" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
                        >
                            {t('loginPage.roleTeacher')}
                        </button>
                        <button
                            onClick={() => setRole("student")}
                            className={`w-1/3 p-3 border rounded-lg ${role === "student" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
                        >
                            {t('loginPage.roleStudent')}
                        </button>
                        <button
                            onClick={() => setRole("admin")}
                            className={`w-1/3 p-3 border rounded-lg ${role === "admin" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
                        >
                            {t('loginPage.roleAdmin')} {/* Translated Admin button */}
                        </button>
                    </div>
                </div>

                {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

                <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="w-full p-3 bg-blue-500 text-white rounded-lg"
                >
                    {loading ? t('loginPage.loggingIn') : t('loginPage.login')}
                </button>
            </div>
        </div>
    );
};

export default LoginPage;
