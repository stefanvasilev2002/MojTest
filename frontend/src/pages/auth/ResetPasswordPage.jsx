import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Eye, EyeOff } from "lucide-react";
import authService from "../../services/authService";

const ResetPasswordPage = () => {
    const { t } = useTranslation('common');
    const { token } = useParams();
    const navigate = useNavigate();
    const [passwords, setPasswords] = useState({
        password: "",
        confirmPassword: ""
    });
    const [showPassword, setShowPassword] = useState({
        password: false,
        confirmPassword: false
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const [tokenValidated, setTokenValidated] = useState(false);
    const [tokenValid, setTokenValid] = useState(false);

    // Validate token when component mounts
    useEffect(() => {
        const validateToken = async () => {
            try {
                const response = await authService.validateResetToken(token);
                setTokenValidated(true);
                setTokenValid(response.success);
                if (!response.success) {
                    setError(t('resetPassword.errors.invalidToken'));
                }
            } catch (err) {
                setTokenValidated(true);
                setTokenValid(false);
                setError(t('resetPassword.errors.invalidToken'));
            }
        };
        validateToken();
    }, [token, t]);

    const handleInputChange = (field) => (e) => {
        setPasswords(prev => ({
            ...prev,
            [field]: e.target.value
        }));
        setError(null);
    };

    const togglePasswordVisibility = (field) => () => {
        setShowPassword(prev => ({
            ...prev,
            [field]: !prev[field]
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (passwords.password !== passwords.confirmPassword) {
            setError(t('resetPassword.errors.passwordsMismatch'));
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const response = await authService.resetPassword(token, passwords.password);
            if (response.success) {
                setSuccess(true);
                // Only redirect after successful password reset
                setTimeout(() => {
                    navigate('/login');
                }, 3000);
            } else {
                setError(response.error || t('resetPassword.errors.default'));
            }
        } catch (err) {
            setError(t('resetPassword.errors.default'));
        } finally {
            setLoading(false);
        }
    };

    // Show loading state while validating token
    if (!tokenValidated) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-gray-100">
                <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md text-center">
                    <p className="text-gray-600">
                        {t('resetPassword.validating')}
                    </p>
                </div>
            </div>
        );
    }

    // Show invalid token message
    if (!tokenValid) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-gray-100">
                <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md text-center">
                    <h2 className="text-2xl font-semibold mb-4 text-red-500">
                        {t('resetPassword.invalidToken')}
                    </h2>
                    <p className="text-gray-600 mb-6">
                        {t('resetPassword.requestNewLink')}
                    </p>
                    <button
                        onClick={() => navigate('/forgot-password')}
                        className="text-blue-500 hover:text-blue-600"
                    >
                        {t('resetPassword.backToForgotPassword')}
                    </button>
                </div>
            </div>
        );
    }

    // Show success message
    if (success) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-gray-100">
                <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md text-center">
                    <h2 className="text-2xl font-semibold mb-4 text-green-500">
                        {t('resetPassword.success')}
                    </h2>
                    <p className="text-gray-600 mb-6">
                        {t('resetPassword.redirecting')}
                    </p>
                </div>
            </div>
        );
    }

    // Show reset password form
    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
                <h2 className="text-2xl font-semibold text-center mb-4">
                    {t('resetPassword.title')}
                </h2>
                <p className="text-gray-600 mb-6 text-center">
                    {t('resetPassword.description')}
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Password field */}
                    <div>
                        <label className="block mb-2 text-gray-600">
                            {t('resetPassword.newPassword')}
                        </label>
                        <div className="relative">
                            <input
                                type={showPassword.password ? "text" : "password"}
                                value={passwords.password}
                                onChange={handleInputChange('password')}
                                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                required
                            />
                            <button
                                type="button"
                                onClick={togglePasswordVisibility('password')}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                            >
                                {showPassword.password ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>
                    </div>

                    {/* Confirm Password field */}
                    <div>
                        <label className="block mb-2 text-gray-600">
                            {t('resetPassword.confirmPassword')}
                        </label>
                        <div className="relative">
                            <input
                                type={showPassword.confirmPassword ? "text" : "password"}
                                value={passwords.confirmPassword}
                                onChange={handleInputChange('confirmPassword')}
                                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                required
                            />
                            <button
                                type="button"
                                onClick={togglePasswordVisibility('confirmPassword')}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                            >
                                {showPassword.confirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>
                    </div>

                    {error && (
                        <div className="p-3 bg-red-50 text-red-500 rounded-lg">
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading || !passwords.password || !passwords.confirmPassword}
                        className="w-full p-3 bg-blue-500 text-white rounded-lg
                            disabled:bg-blue-300 disabled:cursor-not-allowed
                            hover:bg-blue-600 transition-colors"
                    >
                        {loading ? t('resetPassword.resetting') : t('resetPassword.reset')}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ResetPasswordPage;