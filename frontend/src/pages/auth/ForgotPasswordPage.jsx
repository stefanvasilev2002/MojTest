import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import authService from "../../services/authService";
import i18n from "i18next";

const ForgotPasswordPage = () => {
    const { t } = useTranslation('common');
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const currentLanguage = i18n.language;
            const response = await authService.forgotPassword(email, currentLanguage);
            if (response.success) {
                setSuccess(true);
            } else {
                setError(response.error);
            }
        } catch (err) {
            setError(t('forgotPassword.errors.default'));
        } finally {
            setLoading(false);
        }
    };

    const handleBackToLogin = () => {
        navigate('/login');
    };

    if (success) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-gray-100">
                <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
                    <div className="text-center">
                        <h2 className="text-2xl font-semibold mb-4">
                            {t('forgotPassword.checkEmail')}
                        </h2>
                        <p className="text-gray-600 mb-6">
                            {t('forgotPassword.resetLinkSent')}
                        </p>
                        <button
                            onClick={handleBackToLogin}
                            className="text-blue-500 hover:text-blue-600"
                        >
                            {t('forgotPassword.backToLogin')}
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
                <h2 className="text-2xl font-semibold text-center mb-4">
                    {t('forgotPassword.title')}
                </h2>
                <p className="text-gray-600 mb-6 text-center">
                    {t('forgotPassword.description')}
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block mb-2 text-gray-600">
                            {t('forgotPassword.emailLabel')}
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder={t('forgotPassword.emailPlaceholder')}
                            required
                        />
                    </div>

                    {error && (
                        <div className="p-3 bg-red-50 text-red-500 rounded-lg">
                            {error}
                        </div>
                    )}

                    <div className="space-y-4">
                        <button
                            type="submit"
                            disabled={loading || !email}
                            className="w-full p-3 bg-blue-500 text-white rounded-lg
                                disabled:bg-blue-300 disabled:cursor-not-allowed
                                hover:bg-blue-600 transition-colors"
                        >
                            {loading ? t('forgotPassword.sending') : t('forgotPassword.sendLink')}
                        </button>

                        <button
                            type="button"
                            onClick={handleBackToLogin}
                            className="w-full p-3 border border-gray-300 text-gray-700 rounded-lg
                                hover:bg-gray-50 transition-colors"
                        >
                            {t('forgotPassword.backToLogin')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ForgotPasswordPage;