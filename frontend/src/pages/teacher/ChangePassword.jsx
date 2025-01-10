import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import useAuthActions from "../../hooks/useAuthActions.js";
import { useAuth } from "../../context/AuthContext.jsx";
import { ArrowLeft } from 'lucide-react';

const ChangePassword = () => {
    const { t } = useTranslation('common');
    const navigate = useNavigate();
    const { handlePasswordChange, loading, error } = useAuthActions();
    const { user,role } = useAuth(); // Get the logged-in user

    const [formData, setFormData] = useState({
        currentPassword: "",
        newPassword: "",
        confirmNewPassword: "",
    });

    const [validationErrors, setValidationErrors] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
        if (validationErrors[name]) {
            setValidationErrors((prev) => ({
                ...prev,
                [name]: null,
            }));
        }
    };

    const validateForm = () => {
        const errors = {};

        if (!formData.currentPassword) {
            errors.currentPassword = t("Current password is required");
        }

        if (!formData.newPassword) {
            errors.newPassword = t("New password is required");
        } else if (formData.newPassword.length < 6) {
            errors.newPassword = t("New password must be at least 6 characters long");
        }

        if (!formData.confirmNewPassword) {
            errors.confirmNewPassword = t("Please confirm your new password");
        } else if (formData.newPassword !== formData.confirmNewPassword) {
            errors.confirmNewPassword = t("Passwords do not match");
        }

        return errors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const errors = validateForm();
        if (Object.keys(errors).length > 0) {
            setValidationErrors(errors);
            return;
        }

        const updatedData = {
            userId: user.id,
            password: formData.currentPassword,
            newPassword: formData.newPassword,
        };

        // Perform password update logic here
        const { success } = await handlePasswordChange(updatedData);
        if (success && role === "teacher") {
            navigate("/teacher-settings");
        } else if (success && role === "student") {
            navigate("/student-settings");
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
                <button
                    onClick={() => navigate(-1)}
                    className="absolute left-8 top-8 text-gray-600 hover:text-gray-900 flex items-center gap-2 text-sm"
                >
                    <ArrowLeft className="w-4 h-4"/>
                    {t('common.back')}
                </button>
                <h2 className="text-2xl font-semibold text-center mb-4">
                    {t('settings.changePasswordPage.title')}
                </h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Current Password Field */}
                    <div>
                        <label className="block mb-2 text-gray-600">
                            {t('settings.changePasswordPage.currentPassword')}
                            :</label>
                        <input
                            type="password"
                            name="currentPassword"
                            value={formData.currentPassword}
                            onChange={handleChange}
                            className={`w-full p-3 border rounded-lg ${
                                validationErrors.currentPassword ? 'border-red-500' : ''
                            }`}
                            placeholder={t('settings.changePasswordPage.currentPassword')}
                        />
                        {validationErrors.currentPassword && (
                            <p className="text-red-500 text-sm mt-1">
                                {validationErrors.currentPassword}
                            </p>
                        )}
                    </div>

                    {/* New Password Field */}
                    <div>
                        <label className="block mb-2 text-gray-600">
                            {t('settings.changePasswordPage.newPassword')}
                            :</label>
                        <input
                            type="password"
                            name="newPassword"
                            value={formData.newPassword}
                            onChange={handleChange}
                            className={`w-full p-3 border rounded-lg ${
                                validationErrors.newPassword ? 'border-red-500' : ''
                            }`}
                            placeholder={t('settings.changePasswordPage.newPassword')}
                        />
                        {validationErrors.newPassword && (
                            <p className="text-red-500 text-sm mt-1">
                                {validationErrors.newPassword}
                            </p>
                        )}
                    </div>

                    {/* Confirm New Password Field */}
                    <div>
                        <label className="block mb-2 text-gray-600">
                            {t('settings.changePasswordPage.confirmPassword')}
                            :</label>
                        <input
                            type="password"
                            name="confirmNewPassword"
                            value={formData.confirmNewPassword}
                            onChange={handleChange}
                            className={`w-full p-3 border rounded-lg ${
                                validationErrors.confirmNewPassword ? 'border-red-500' : ''
                            }`}
                            placeholder={t('settings.changePasswordPage.confirmPassword')}
                        />
                        {validationErrors.confirmNewPassword && (
                            <p className="text-red-500 text-sm mt-1">
                                {validationErrors.confirmNewPassword}
                            </p>
                        )}
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="p-3 bg-red-50 text-red-500 rounded-lg">
                            {t(`changePassword.errors.${error}`) || error}
                        </div>
                    )}

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full p-3 bg-blue-500 text-white rounded-lg
                            hover:bg-blue-600 transition-colors disabled:bg-blue-300 disabled:cursor-not-allowed"
                    >
                        {loading ? t('settings.updating') : t('settings.update')}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ChangePassword;
