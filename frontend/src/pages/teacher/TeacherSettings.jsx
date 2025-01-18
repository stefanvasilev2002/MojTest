import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuth } from '../../context/AuthContext.jsx';
import useAuthActions from "../../hooks/useAuthActions";
import {ArrowLeft} from "lucide-react";

const TeacherSettings = () => {
    const { t } = useTranslation('common');
    const { user , role} = useAuth();  // Get the logged-in user
    const { handleUpdate, loading, error } = useAuthActions();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        username: "",
        email: "",
        fullName: "",
    });

    const [validationErrors, setValidationErrors] = useState({});

    // Prefill form data with user info when the component mounts
    useEffect(() => {
        if (user) {
            setFormData({
                username: user.username || "",
                email: user.email || "",
                fullName: user.fullName || "",
            });
        }
    }, [user]);

    const validateForm = () => {
        const errors = {};

        if (!formData.username) {
            errors.username = t('Username is Required');
        }

        if (!formData.email) {
            errors.email = t('Email is Required');
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            errors.email = t('Email is Invalid');
        }

        if (!formData.fullName) {
            errors.fullName = t('Full Name is Required');
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

        const updatedData = {
            id: user.id,
            username: formData.username,
            email: formData.email,
            fullName: formData.fullName,
        };

        const { success, data, error } = await handleUpdate(updatedData);

        if (success) {
            navigate("/teacher-dashboard");
        }
    };

    const handleChangePasswordClick = () => {
        navigate("/change-password");
    };
    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
                <button
                    onClick={() => navigate(-1)}
                    className="mb-6 text-gray-600 hover:text-gray-900 flex items-center gap-2 text-sm"
                > {/* Removed absolute positioning, added mb-6 */}
                    <ArrowLeft className="w-4 h-4"/>
                    {t('common.back')}
                </button>
                <h2 className="text-2xl font-semibold text-center mb-4">
                    {role === "teacher" ? t('settings.teacherTitle') : "Admin"}
                </h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Username field */}
                    <div>
                        <label className="block mb-2 text-gray-600">
                            {t('settings.username')}:
                        </label>
                        <input
                            type="text"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            className={`w-full p-3 border rounded-lg ${
                                validationErrors.username ? 'border-red-500' : ''
                            }`}
                            placeholder={t('settings.username')}
                        />
                        {validationErrors.username && (
                            <p className="text-red-500 text-sm mt-1">{validationErrors.username}</p>
                        )}
                    </div>

                    {/* Email field */}
                    <div>
                        <label className="block mb-2 text-gray-600">
                            {t('settings.email')}:
                        </label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className={`w-full p-3 border rounded-lg ${
                                validationErrors.email ? 'border-red-500' : ''
                            }`}
                            placeholder={t('settings.email')}
                        />
                        {validationErrors.email && (
                            <p className="text-red-500 text-sm mt-1">{validationErrors.email}</p>
                        )}
                    </div>

                    {/* Full Name field */}
                    <div>
                        <label className="block mb-2 text-gray-600">
                            {t('settings.fullName')}:
                        </label>
                        <input
                            type="text"
                            name="fullName"
                            value={formData.fullName}
                            onChange={handleChange}
                            className={`w-full p-3 border rounded-lg ${
                                validationErrors.fullName ? 'border-red-500' : ''
                            }`}
                            placeholder={t('settings.fullName')}
                        />
                        {validationErrors.fullName && (
                            <p className="text-red-500 text-sm mt-1">{validationErrors.fullName}</p>
                        )}
                    </div>


                    {/* Error Display */}
                    {error && (
                        <div className="p-3 bg-red-50 text-red-500 rounded-lg">
                            {t(`settingsPage.errors.${error}`) || error}
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
                        {loading ? t('settings.updating') : t('settings.update')}
                    </button>
                </form>
                <button
                    onClick={handleChangePasswordClick}
                    className="w-full mt-4 p-3 bg-green-500 text-white rounded-lg
                        hover:bg-green-600 transition-colors"
                >
                    {t('settings.changePassword')}
                </button>
            </div>
        </div>
    );
};

export default TeacherSettings;
