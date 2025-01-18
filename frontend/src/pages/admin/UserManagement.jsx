import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import useUsers from "../../hooks/crud/useUsers.js";
import { predefinedKeyValues } from "../../config/predefinedKeyValues.js";
import { useTranslation} from "react-i18next";
import {getTranslatedMetadata} from "../../config/translatedMetadata.js";
import i18n from "i18next";

const UserManagement = ({ defaultType = 'All' }) => {
    const { items: users, loading, error: crudError, create, update, remove } = useUsers();
    const [selectedUser, setSelectedUser] = useState(null);
    const [isCreating, setIsCreating] = useState(false);
    const [error, setError] = useState(null);
    const [selectedType, setSelectedType] = useState(defaultType);
    const [validationErrors, setValidationErrors] = useState({});
    const navigate = useNavigate();
    const location = useLocation();
    const { t } = useTranslation("common");
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        email: '',
        fullName: '',
        dtype: 'Student',
        grade: ''
    });

    const validateForm = () => {
        const errors = {};

        if (!formData.username) {
            errors.username = 'Username is required';
        } else if (formData.username.length < 3) {
            errors.username = 'Username must be at least 3 characters';
        }

        if (isCreating && !formData.password) {
            errors.password = 'Password is required for new users';
        } else if (isCreating && formData.password.length < 6) {
            errors.password = 'Password must be at least 6 characters';
        }

        if (!formData.email) {
            errors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            errors.email = 'Email is invalid';
        }

        if (!formData.fullName) {
            errors.fullName = 'Full name is required';
        }

        if (formData.dtype === 'Student' && !formData.grade) {
            errors.grade = 'Grade is required for students';
        }

        return errors;
    };

    useEffect(() => {
        setSelectedType(defaultType);
    }, [defaultType]);

    const handleTypeChange = (type) => {
        setSelectedType(type);
        const baseUrl = '/admin/users';
        if (type === 'All') {
            navigate(baseUrl);
        } else {
            navigate(`${baseUrl}/${type.toLowerCase()}s`);
        }
    };

    const filteredUsers = users.filter(user =>
        selectedType === 'All' ? true : user.dtype === selectedType
    );

    const handleInputChange = (e) => {
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

    const prepareDataForSubmission = () => {
        const baseData = {
            username: formData.username,
            email: formData.email,
            fullName: formData.fullName,
            password: formData.password,
            registrationDate: new Date().toISOString().split('T')[0],
            dtype: formData.dtype
        };

        if (formData.dtype === 'Student') {
            return {
                ...baseData,
                grade: formData.grade
            };
        } else if (formData.dtype === 'Teacher') {
            return {
                ...baseData,
                createdTests: [],
                createdQuestions: []
            };
        }

        return baseData;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        const errors = validateForm();
        if (Object.keys(errors).length > 0) {
            setValidationErrors(errors);
            return;
        }

        try {
            const userData = prepareDataForSubmission();

            if (isCreating) {
                await create(userData);
                resetForm();
                setIsCreating(false);
            } else if (selectedUser) {
                await update(selectedUser.id, userData);
                console.log("userData editing",userData);
                resetForm();
            }
        } catch (err) {
            console.error('Error in handleSubmit:', err);
            setError(err.response?.data?.message || err.message || 'An error occurred while saving the user');
        }
    };

    const handleEdit = (user) => {
        setSelectedUser(user);
        setIsCreating(false);
        setFormData({
            username: user.username,
            email: user.email,
            fullName: user.fullName,
            dtype: user.dtype,
            grade: user.dtype === 'Student' ? user.grade || '' : '',
            password: ''
        });
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this user?')) {
            try {
                await remove(id);
            } catch (err) {
                setError(err.response?.data?.message || err.message || 'Error deleting user');
            }
        }
    };

    const resetForm = () => {
        setFormData({
            username: '',
            password: '',
            email: '',
            fullName: '',
            dtype: selectedType === 'All' ? 'Student' : selectedType,
            grade: ''
        });
        setSelectedUser(null);
        setError(null);
        setValidationErrors({});
    };

    if (loading) return (
        <div className="flex justify-center items-center min-h-screen">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
    );

    if (crudError) return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="p-4 bg-red-50 text-red-500 rounded-lg">
                Error: {crudError}
            </div>
        </div>
    );

    return (
        <div className="p-4 md:p-6 max-w-7xl mx-auto mt-16 md:mt-20 min-h-screen bg-gray-50">
            <div className="mb-6 md:mb-8">
                <h1 className="text-2xl md:text-3xl font-bold mb-4 md:mb-6 text-gray-800">
                    {t('userManagement.title')}
                </h1>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                    <div className="flex flex-wrap gap-2 md:gap-3 w-full md:w-auto">
                        {['All', 'Admin', 'Teacher', 'Student'].map(type => (
                            <button
                                key={type}
                                onClick={() => handleTypeChange(type)}
                                className={`px-3 md:px-5 py-2 md:py-2.5 rounded-lg transition-all duration-200 font-medium text-sm md:text-base flex-1 md:flex-none ${
                                    selectedType === type
                                        ? 'bg-blue-500 text-white shadow-lg'
                                        : 'bg-white hover:bg-gray-100 text-gray-700 border border-gray-200'
                                }`}
                            >
                                {t(`userTypes.${type.toLowerCase()}`)}
                            </button>
                        ))}
                    </div>
                    <button
                        onClick={() => {
                            setIsCreating(true);
                            resetForm();
                        }}
                        className="w-full md:w-auto bg-green-500 text-white px-4 md:px-5 py-2 md:py-2.5 rounded-lg
                             hover:bg-green-600 transition-colors duration-200 font-medium shadow-md text-sm md:text-base"
                    >
                        {t('userManagement.createNew')}
                    </button>
                </div>
            </div>

            {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm">
                    {error}
                </div>
            )}

            {(isCreating || selectedUser) && (
                <div className="mb-8 bg-white p-4 md:p-6 rounded-xl shadow-md">
                    <h2 className="text-xl md:text-2xl font-semibold mb-6 text-gray-800">
                        {isCreating ? t('userManagement.createNewUser') : t('userManagement.editUser')}
                    </h2>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                            <div>
                                <label className="block mb-2 text-gray-700 font-medium text-sm">
                                    {t('userForm.username')}
                                </label>
                                <input
                                    type="text"
                                    name="username"
                                    value={formData.username}
                                    onChange={handleInputChange}
                                    className={`w-full p-2.5 md:p-3 border rounded-lg transition-colors text-sm
                                    ${validationErrors.username
                                        ? 'border-red-500 focus:border-red-500'
                                        : 'border-gray-300 focus:border-blue-500'} 
                                    focus:outline-none`}
                                    placeholder={t('userForm.usernamePlaceholder')}
                                />
                                {validationErrors.username && (
                                    <p className="mt-1 text-red-500 text-xs">{t(`validation.${validationErrors.username}`)}</p>
                                )}
                            </div>

                            <div>
                                <label className="block mb-2 text-gray-700 font-medium text-sm">
                                    {t('userForm.password')}
                                    {!isCreating && t('userForm.passwordOptional')}
                                </label>
                                <input
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    className={`w-full p-2.5 md:p-3 border rounded-lg transition-colors text-sm
                                    ${validationErrors.password
                                        ? 'border-red-500 focus:border-red-500'
                                        : 'border-gray-300 focus:border-blue-500'} 
                                    focus:outline-none`}
                                    placeholder={t('userForm.passwordPlaceholder')}
                                    required={isCreating}
                                />
                                {validationErrors.password && (
                                    <p className="mt-1 text-red-500 text-xs">{t(`validation.${validationErrors.password}`)}</p>
                                )}
                            </div>

                            <div>
                                <label className="block mb-2 text-gray-700 font-medium text-sm">
                                    {t('userForm.email')}
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    className={`w-full p-2.5 md:p-3 border rounded-lg transition-colors text-sm
                                    ${validationErrors.email
                                        ? 'border-red-500 focus:border-red-500'
                                        : 'border-gray-300 focus:border-blue-500'} 
                                    focus:outline-none`}
                                    placeholder={t('userForm.emailPlaceholder')}
                                />
                                {validationErrors.email && (
                                    <p className="mt-1 text-red-500 text-xs">{t(`validation.${validationErrors.email}`)}</p>
                                )}
                            </div>

                            <div>
                                <label className="block mb-2 text-gray-700 font-medium text-sm">
                                    {t('userForm.fullName')}
                                </label>
                                <input
                                    type="text"
                                    name="fullName"
                                    value={formData.fullName}
                                    onChange={handleInputChange}
                                    className={`w-full p-2.5 md:p-3 border rounded-lg transition-colors text-sm
                                    ${validationErrors.fullName
                                        ? 'border-red-500 focus:border-red-500'
                                        : 'border-gray-300 focus:border-blue-500'} 
                                    focus:outline-none`}
                                    placeholder={t('userForm.fullNamePlaceholder')}
                                />
                                {validationErrors.fullName && (
                                    <p className="mt-1 text-red-500 text-xs">{t(`validation.${validationErrors.fullName}`)}</p>
                                )}
                            </div>

                            <div>
                                <label className="block mb-2 text-gray-700 font-medium text-sm">
                                    {t('userForm.type')}
                                </label>
                                <select
                                    name="dtype"
                                    value={formData.dtype}
                                    onChange={handleInputChange}
                                    className="w-full p-2.5 md:p-3 border border-gray-300 rounded-lg
                                         focus:border-blue-500 focus:outline-none transition-colors text-sm"
                                >
                                    <option value="Student">{t('userTypes.student')}</option>
                                    <option value="Teacher">{t('userTypes.teacher')}</option>
                                    <option value="Admin">{t('userTypes.admin')}</option>
                                </select>
                            </div>

                            {formData.dtype === 'Student' && (
                                <div>
                                    <label className="block mb-2 text-gray-700 font-medium text-sm">
                                        {t('userForm.grade')}
                                    </label>
                                    <select
                                        name="grade"
                                        value={formData.grade}
                                        onChange={handleInputChange}
                                        className={`w-full p-2.5 md:p-3 border rounded-lg transition-colors text-sm
                                        ${validationErrors.grade
                                            ? 'border-red-500 focus:border-red-500'
                                            : 'border-gray-300 focus:border-blue-500'} 
                                        focus:outline-none`}
                                    >
                                        <option value="">{t('userForm.selectGrade')}</option>
                                        {predefinedKeyValues.Grade.map((grade) => (
                                            <option key={grade} value={grade}>
                                                {getTranslatedMetadata("Grade",grade,i18n.language)}
                                            </option>
                                        ))}

                                    </select>
                                    {validationErrors.grade && (
                                        <p className="mt-1 text-red-500 text-xs">{t(`validation.${validationErrors.grade}`)}</p>
                                    )}
                                </div>
                            )}

                            <div className="flex gap-3 mt-6 flex-col md:flex-row w-full">
                                <button
                                    type="submit"
                                    className="w-full md:w-auto px-4 md:px-6 py-2.5 bg-blue-500 text-white rounded-lg
                                         hover:bg-blue-600 transition-colors duration-200 font-medium shadow-md text-sm"
                                >
                                    {isCreating ? t('userForm.createButton') : t('userForm.updateButton')}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        resetForm();
                                        setIsCreating(false);
                                    }}
                                    className="w-full md:w-auto px-4 md:px-6 py-2.5 bg-gray-500 text-white rounded-lg
                                         hover:bg-gray-600 transition-colors duration-200 font-medium shadow-md text-sm"
                                >
                                    {t('common.cancel')}
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            )}

            <div className="overflow-x-auto bg-white rounded-xl shadow-md">
                <table className="w-full min-w-[800px]">
                    <thead className="bg-gray-50">
                    <tr>
                        <th className="px-4 md:px-6 py-3 md:py-4 text-left text-xs md:text-sm font-semibold text-gray-600">
                            {t('userTable.username')}
                        </th>
                        <th className="px-4 md:px-6 py-3 md:py-4 text-left text-xs md:text-sm font-semibold text-gray-600">
                            {t('userTable.fullName')}
                        </th>
                        <th className="px-4 md:px-6 py-3 md:py-4 text-left text-xs md:text-sm font-semibold text-gray-600">
                            {t('userTable.email')}
                        </th>
                        <th className="px-4 md:px-6 py-3 md:py-4 text-left text-xs md:text-sm font-semibold text-gray-600">
                            {t('userTable.type')}
                        </th>
                        <th className="px-4 md:px-6 py-3 md:py-4 text-left text-xs md:text-sm font-semibold text-gray-600">
                            {t('userTable.grade')}
                        </th>
                        <th className="px-4 md:px-6 py-3 md:py-4 text-left text-xs md:text-sm font-semibold text-gray-600">
                            {t('userTable.actions')}
                        </th>
                    </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                    {filteredUsers.map((user) => (
                        <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                            <td className="px-4 md:px-6 py-3 md:py-4 text-xs md:text-sm text-gray-700">
                                {user.username}
                            </td>
                            <td className="px-4 md:px-6 py-3 md:py-4 text-xs md:text-sm text-gray-700">
                                {user.fullName}
                            </td>
                            <td className="px-4 md:px-6 py-3 md:py-4 text-xs md:text-sm text-gray-700">
                                {user.email}
                            </td>
                            <td className="px-4 md:px-6 py-3 md:py-4">
                            <span className={`inline-flex items-center px-2 md:px-2.5 py-0.5 rounded-full text-xs font-medium
                                ${user.dtype === 'Admin'
                                ? 'bg-purple-100 text-purple-800'
                                : user.dtype === 'Teacher'
                                    ? 'bg-blue-100 text-blue-800'
                                    : 'bg-green-100 text-green-800'
                            }`}>
                                {t(`userTypes.${user.dtype.toLowerCase()}`)}
                            </span>
                            </td>
                            <td className="px-4 md:px-6 py-3 md:py-4 text-xs md:text-sm text-gray-700">
                                {getTranslatedMetadata("Grade",user.grade,i18n.language) || '-'}
                            </td>
                            <td className="px-4 md:px-6 py-3 md:py-4">
                                <div className="flex gap-2 md:gap-3">
                                    <button
                                        onClick={() => handleEdit(user)}
                                        className="text-blue-600 hover:text-blue-800 font-medium transition-colors
                                             duration-200 text-xs md:text-sm"
                                    >
                                        {t('common.edit')}
                                    </button>
                                    <button
                                        onClick={() => handleDelete(user.id)}
                                        className="text-red-600 hover:text-red-800 font-medium transition-colors
                                             duration-200 text-xs md:text-sm"
                                    >
                                        {t('common.delete')}
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>

                {filteredUsers.length === 0 && (
                    <div className="text-center py-8 text-gray-500 text-sm md:text-base">
                        {t('userTable.noUsers')}
                    </div>
                )}
            </div>
        </div>
    );
};

export default UserManagement;