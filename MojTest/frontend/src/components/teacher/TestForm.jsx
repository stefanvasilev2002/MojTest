import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';

// Test Form Component
const TestForm = ({ initialData, onSubmit, isEditing }) => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        timeLimit: 60,
        ...initialData
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl mx-auto">
            <div>
                <label className="block text-sm font-medium text-gray-700">Title</label>
                <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="mt-1 block w-full rounded-md border border-gray-300 p-2"
                    required
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="mt-1 block w-full rounded-md border border-gray-300 p-2"
                    rows="3"
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700">Time Limit (minutes)</label>
                <input
                    type="number"
                    value={formData.timeLimit}
                    onChange={(e) => setFormData({ ...formData, timeLimit: parseInt(e.target.value) })}
                    className="mt-1 block w-full rounded-md border border-gray-300 p-2"
                    min="1"
                    required
                />
            </div>
            <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700"
            >
                {isEditing ? 'Update Test' : 'Create Test'}
            </button>
        </form>
    );
};