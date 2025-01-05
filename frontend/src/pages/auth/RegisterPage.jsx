import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import useAuthActions from "../../hooks/useAuthActions.js";
import {predefinedKeyValues} from "../../config/predefinedKeyValues.js";

const RegisterPage = () => {
    const { t } = useTranslation('common');
    const [formData, setFormData] = useState({
        username: "",
        password: "",
        confirmPassword: "",
        email: "",
        fullName: "",
        grade: ""
    });
    const [validationErrors, setValidationErrors] = useState({});
    const navigate = useNavigate();
    const { handleRegister, loading, error } = useAuthActions();

    const validateForm = () => {
        const errors = {};

        if (!formData.username) {
            errors.username = t('registerPage.validation.usernameRequired');
        } else if (formData.username.length < 3) {
            errors.username = t('registerPage.validation.usernameTooShort');
        }

        if (!formData.password) {
            errors.password = t('registerPage.validation.passwordRequired');
        } else if (formData.password.length < 6) {
            errors.password = t('registerPage.validation.passwordTooShort');
        }

        if (!formData.confirmPassword) {
            errors.confirmPassword = t('registerPage.validation.confirmPasswordRequired');
        } else if (formData.password !== formData.confirmPassword) {
            errors.confirmPassword = t('registerPage.validation.passwordsDontMatch');
        }

        if (!formData.email) {
            errors.email = t('registerPage.validation.emailRequired');
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            errors.email = t('registerPage.validation.emailInvalid');
        }

        if (!formData.fullName) {
            errors.fullName = t('registerPage.validation.fullNameRequired');
        }

        if (!formData.grade) {
            errors.grade = t('registerPage.validation.gradeRequired');
        }

        return errors;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        if (validationErrors[name]) {
            setValidationErrors(prev => ({
                ...prev,
                [name]: null
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const errors = validateForm();
        if (Object.keys(errors).length > 0) {
            setValidationErrors(errors);
            return;
        }

        const registerData = {
            username: formData.username,
            password: formData.password,
            email: formData.email,
            fullName: formData.fullName,
            grade: formData.grade,
            registrationDate: new Date().toISOString().split("T")[0]
        };

        const { success, data } = await handleRegister(registerData);

        if (success) {
            navigate("/student-dashboard");
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
                <h2 className="text-2xl font-semibold text-center mb-4">
                    {t('registerPage.title')}
                </h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Username field */}
                    <div>
                        <label className="block mb-2 text-gray-600">
                            {t('registerPage.username')}
                        </label>
                        <input
                            type="text"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            className={`w-full p-3 border rounded-lg ${
                                validationErrors.username ? 'border-red-500' : ''
                            }`}
                            placeholder={t('registerPage.placeholders.username')}
                        />
                        {validationErrors.username && (
                            <p className="text-red-500 text-sm mt-1">{validationErrors.username}</p>
                        )}
                    </div>

                    {/* Password field */}
                    <div>
                        <label className="block mb-2 text-gray-600">
                            {t('registerPage.password')}
                        </label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            className={`w-full p-3 border rounded-lg ${
                                validationErrors.password ? 'border-red-500' : ''
                            }`}
                            placeholder={t('registerPage.placeholders.password')}
                        />
                        {validationErrors.password && (
                            <p className="text-red-500 text-sm mt-1">{validationErrors.password}</p>
                        )}
                    </div>

                    {/* Confirm Password field */}
                    <div>
                        <label className="block mb-2 text-gray-600">
                            {t('registerPage.confirmPassword')}
                        </label>
                        <input
                            type="password"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            className={`w-full p-3 border rounded-lg ${
                                validationErrors.confirmPassword ? 'border-red-500' : ''
                            }`}
                            placeholder={t('registerPage.placeholders.confirmPassword')}
                        />
                        {validationErrors.confirmPassword && (
                            <p className="text-red-500 text-sm mt-1">{validationErrors.confirmPassword}</p>
                        )}
                    </div>

                    {/* Email field */}
                    <div>
                        <label className="block mb-2 text-gray-600">
                            {t('registerPage.email')}
                        </label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className={`w-full p-3 border rounded-lg ${
                                validationErrors.email ? 'border-red-500' : ''
                            }`}
                            placeholder={t('registerPage.placeholders.email')}
                        />
                        {validationErrors.email && (
                            <p className="text-red-500 text-sm mt-1">{validationErrors.email}</p>
                        )}
                    </div>

                    {/* Full Name field */}
                    <div>
                        <label className="block mb-2 text-gray-600">
                            {t('registerPage.fullName')}
                        </label>
                        <input
                            type="text"
                            name="fullName"
                            value={formData.fullName}
                            onChange={handleChange}
                            className={`w-full p-3 border rounded-lg ${
                                validationErrors.fullName ? 'border-red-500' : ''
                            }`}
                            placeholder={t('registerPage.placeholders.fullName')}
                        />
                        {validationErrors.fullName && (
                            <p className="text-red-500 text-sm mt-1">{validationErrors.fullName}</p>
                        )}
                    </div>

                    {/* Grade Selection */}
                    <div>
                        <label className="block mb-2 text-gray-600">
                            {t('Choose grade')}
                        </label>
                        <select
                            name="grade"
                            value={formData.grade}
                            onChange={handleChange}
                            className={`w-full p-3 border rounded-lg ${
                                validationErrors.grade ? 'border-red-500' : ''
                            }`}
                        >
                            <option value="">Choose your grade if you are a student</option>
                            {predefinedKeyValues.Grade.map((grade) => (
                                <option key={grade} value={grade}>
                                    {grade}
                                </option>
                            ))}
                        </select>
                        {validationErrors.grade && (
                            <p className="text-red-500 text-sm mt-1">{validationErrors.grade}</p>
                        )}
                    </div>

                    {/* Error Display */}
                    {error && (
                        <div className="p-3 bg-red-50 text-red-500 rounded-lg">
                            {t(`registerPage.errors.${error}`) || error}
                        </div>
                    )}

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full p-3 bg-blue-500 text-white rounded-lg
                            disabled:bg-blue-300 disabled:cursor-not-allowed
                            hover:bg-blue-600 transition-colors"
                    >
                        {loading ? t('registerPage.registering') : t('registerPage.register')}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default RegisterPage;