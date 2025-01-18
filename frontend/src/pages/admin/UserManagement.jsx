import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import useUsers from "../../hooks/crud/useUsers.js";

const UserManagement = ({ defaultType = 'All' }) => {
    const { items: users, loading, error: crudError, create, update, remove } = useUsers();
    const [selectedUser, setSelectedUser] = useState(null);
    const [isCreating, setIsCreating] = useState(false);
    const [error, setError] = useState(null);
    const [selectedType, setSelectedType] = useState(defaultType);
    const navigate = useNavigate();
    const location = useLocation();


    const [formData, setFormData] = useState({
        username: '',
        password: '',
        email: '',
        fullName: '',
        dtype: 'Student',
        grade: ''
    });

    // Set initial filter based on route when component mounts
    useEffect(() => {
        setSelectedType(defaultType);
    }, [defaultType]);

    const handleTypeChange = (type) => {
        setSelectedType(type);
        // Update URL based on selected type
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

        // Add type-specific properties
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

        return baseData; // For Admins or default case
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        try {
            if (isCreating && !formData.password) {
                setError('Password is required for new users');
                return;
            }

            const userData = prepareDataForSubmission();

            if (isCreating) {
                console.log('Creating user with data:', userData);
                await create(userData);
                resetForm();
                setIsCreating(false);
            } else if (selectedUser) {
                console.log('Updating user with data:', userData);
                await update(selectedUser.id, userData);
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
            grade: user.dtype === 'Student' ? user.grade || '' : '', // Only set grade for students
            password: '' // Empty password field for security
        });
    };


    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this user?')) {
            try {
                await remove(id);
            } catch (err) {
                console.error('Error deleting user:', err);
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
            dtype: selectedType === 'All' ? 'Student' : selectedType, // Set type based on current filter
            grade: ''
        });
        setSelectedUser(null);
        setError(null);
    };

    if (loading) return <div className="p-4">Loading...</div>;
    if (crudError) return <div className="p-4 text-red-500">Error: {crudError}</div>;

    return (
        <div className="p-4 max-w-6xl mx-auto mt-20 min-h-screen">
            <div className="mb-8">
                <h1 className="text-2xl font-bold mb-4">User Management</h1>
                <div className="flex flex-wrap justify-between items-center mb-4 gap-2">
                    <div className="flex flex-wrap space-x-2 gap-2">
                        {['All', 'Admin', 'Teacher', 'Student'].map(type => (
                            <button
                                key={type}
                                onClick={() => handleTypeChange(type)}
                                className={`px-4 py-2 rounded transition-colors ${
                                    selectedType === type
                                        ? 'bg-blue-500 text-white'
                                        : 'bg-gray-200 hover:bg-gray-300'
                                }`}
                            >
                                {type}s
                            </button>
                        ))}
                    </div>
                    <button
                        onClick={() => {
                            setIsCreating(true);
                            resetForm();
                        }}
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    >
                        Create New User
                    </button>
                </div>
            </div>

            {/* Error Display */}
            {error && (
                <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
                    {error}
                </div>
            )}

            {/* Form Section */}
            {(isCreating || selectedUser) && (
                <form onSubmit={handleSubmit} className="mb-8 bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold mb-4">
                        {isCreating ? 'Create New User' : 'Edit User'}
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block mb-2">Username</label>
                            <input
                                type="text"
                                name="username"
                                value={formData.username}
                                onChange={handleInputChange}
                                className="w-full p-2 border rounded"
                                required
                            />
                        </div>

                        <div>
                            <label className="block mb-2">
                                Password {!isCreating && '(leave empty to keep current)'}
                            </label>
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleInputChange}
                                className="w-full p-2 border rounded"
                                required={isCreating}
                            />
                        </div>

                        <div>
                            <label className="block mb-2">Email</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                className="w-full p-2 border rounded"
                                required
                            />
                        </div>

                        <div>
                            <label className="block mb-2">Full Name</label>
                            <input
                                type="text"
                                name="fullName"
                                value={formData.fullName}
                                onChange={handleInputChange}
                                className="w-full p-2 border rounded"
                                required
                            />
                        </div>

                        <div>
                            <label className="block mb-2">User Type</label>
                            <select
                                name="dtype"
                                value={formData.dtype}
                                onChange={handleInputChange}
                                className="w-full p-2 border rounded"
                                required
                            >
                                <option value="Student">Student</option>
                                <option value="Teacher">Teacher</option>
                                <option value="Admin">Admin</option>
                            </select>
                        </div>

                        {formData.dtype === 'Student' && (
                            <div>
                                <label className="block mb-2">Grade</label>
                                <input
                                    type="text"
                                    name="grade"
                                    value={formData.grade}
                                    onChange={handleInputChange}
                                    className="w-full p-2 border rounded"
                                />
                            </div>
                        )}
                    </div>

                    <div className="mt-4 flex flex-wrap gap-2">
                        <button
                            type="submit"
                            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                        >
                            {isCreating ? 'Create' : 'Update'}
                        </button>
                        <button
                            type="button"
                            onClick={() => {
                                resetForm();
                                setIsCreating(false);
                            }}
                            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            )}

            {/* Users Table */}
            <div className="overflow-auto">
                <table className="w-full bg-white rounded-lg shadow-md">
                    <thead className="bg-gray-50">
                    <tr>
                        <th className="p-4 text-left">Username</th>
                        <th className="p-4 text-left">Full Name</th>
                        <th className="p-4 text-left">Email</th>
                        <th className="p-4 text-left">Type</th>
                        <th className="p-4 text-left">Grade</th>
                        <th className="p-4 text-left">Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {filteredUsers.map((user) => (
                        <tr key={user.id} className="border-t">
                            <td className="p-4">{user.username}</td>
                            <td className="p-4">{user.fullName}</td>
                            <td className="p-4">{user.email}</td>
                            <td className="p-4">{user.dtype}</td>
                            <td className="p-4">{user.grade || '-'}</td>
                            <td className="p-4">
                                <button
                                    onClick={() => handleEdit(user)}
                                    className="text-blue-500 hover:text-blue-700 mr-2"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => handleDelete(user.id)}
                                    className="text-red-500 hover:text-red-700"
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );

};

export default UserManagement;