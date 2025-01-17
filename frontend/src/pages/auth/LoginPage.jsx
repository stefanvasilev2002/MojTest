import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import useAuthActions from "../../hooks/useAuthActions.js";
import { useTranslation } from "react-i18next";
import { Eye, EyeOff } from "lucide-react";

const LoginPage = () => {
    const { t } = useTranslation('common');
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();
    const { handleLogin, loading, error } = useAuthActions();
    const [localError, setLocalError] = useState(null);
    const passwordRef = useRef(null);

    useEffect(() => {
        if (error) {
            setLocalError(error);
        }
    }, [error]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!username || !password) {
            setLocalError("Please fill in all fields");
            return;
        }

        const { success, data } = await handleLogin(username, password);
        if (success) {
            setLocalError(null);
            const userRole = data?.role?.toLowerCase();
            const routes = {
                'teacher': '/teacher-dashboard',
                'student': '/student-dashboard',
                'admin': '/admin/hub'
            };
            navigate(routes[userRole] || '/student-dashboard');
        }

    };

    const handleKeyDown = (e, nextRef) => {
        if (e.key === 'Enter' && nextRef) {
            e.preventDefault();
            nextRef.current?.focus();
        }
    };

    const handleInputChange = (setter) => (e) => {
        setter(e.target.value);
        if (localError) {
            setLocalError(null);
        }
    };

    const handleForgotPassword = () => {
        navigate('/forgot-password');
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
                <h2 className="text-2xl font-semibold text-center mb-4">
                    {t('loginPage.title')}
                </h2>

                <form onSubmit={handleSubmit} className="space-y-4" autoComplete="on">
                    <div>
                        <label className="block mb-2 text-gray-600">
                            {t('loginPage.username')}
                        </label>
                        <input
                            type="text"
                            name="username"
                            autoComplete="username"
                            value={username}
                            onChange={handleInputChange(setUsername)}
                            onKeyDown={(e) => handleKeyDown(e, passwordRef)}
                            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder={t('loginPage.enterUsername')}
                            required
                        />
                    </div>

                    <div>
                        <label className="block mb-2 text-gray-600">
                            {t('loginPage.password')}
                        </label>
                        <div className="relative">
                            <input
                                ref={passwordRef}
                                type={showPassword ? "text" : "password"}
                                name="password"
                                autoComplete="current-password"
                                value={password}
                                onChange={handleInputChange(setPassword)}
                                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder={t('loginPage.enterPassword')}
                                required
                            />
                            <button
                                type="button"
                                onClick={togglePasswordVisibility}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                            >
                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>
                    </div>

                    <div className="text-right">
                        <button
                            type="button"
                            onClick={handleForgotPassword}
                            className="text-blue-500 hover:text-blue-600 text-sm"
                        >
                            {t('loginPage.forgotPassword')}
                        </button>
                    </div>

                    {localError && (
                        <div className="p-3 bg-red-50 text-red-500 rounded-lg">
                            {typeof localError === 'string'
                                ? t(`loginPage.errors.${localError}`) || localError
                                : t('loginPage.errors.default')}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading || !username || !password}
                        className="w-full p-3 bg-blue-500 text-white rounded-lg
                            disabled:bg-blue-300 disabled:cursor-not-allowed
                            hover:bg-blue-600 transition-colors"
                    >
                        {loading ? t('loginPage.loggingIn') : t('loginPage.login')}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default LoginPage;