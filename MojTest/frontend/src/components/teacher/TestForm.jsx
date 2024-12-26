import React, { useState, useEffect } from 'react';
import {predefinedKeyValues} from "../../constants/metadata.js";

const TestForm = ({ initialData, onSubmit, isEditing, userId }) => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        timeLimit: 60,
        creatorId: userId,
        numQuestions: 1,
        metadata: {},
        ...initialData
    });

    const [errors, setErrors] = useState({});
    useEffect(() => {
        if (initialData) {
            setFormData({
                title: initialData.title || '',
                description: initialData.description || '',
                timeLimit: initialData.timeLimit || 60,
                creatorId: initialData.creatorId || userId,
                numQuestions: initialData.numQuestions || 1,
                metadata: initialData.metadata || {}
            });
        }
    }, [initialData, userId]);
    const handleMetadataChange = (key, value) => {
        setFormData(prev => ({
            ...prev,
            metadata: {
                ...prev.metadata,
                [key]: value
            }
        }));
    };
    const validateForm = () => {
        const newErrors = {};
        if (!formData.title.trim()) {
            newErrors.title = 'Title is required';
        }
        if (formData.timeLimit < 1) {
            newErrors.timeLimit = 'Time limit must be at least 1 minute';
        }
        if (!formData.creatorId) {
            newErrors.creatorId = 'Creator ID is required';
        }
        if (formData.numQuestions < 1) {
            newErrors.numQuestions = 'Test must have at least 1 question';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validateForm()) {
            // Convert metadata to array format for backend
            const metadataArray = Object.entries(formData.metadata).map(([key, value]) => ({
                key,
                value
            }));

            onSubmit({
                ...formData,
                metadata: metadataArray
            });
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'timeLimit' ? parseInt(value) || '' : value
        }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: undefined }));
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl mx-auto">
            <input type="hidden" name="creatorId" value={formData.creatorId}/>
            <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                    Title
                </label>
                <input
                    id="title"
                    name="title"
                    type="text"
                    value={formData.title}
                    onChange={handleChange}
                    className={`mt-1 block w-full rounded-md border p-2 
                        ${errors.title
                        ? 'border-red-500 focus:ring-red-500'
                        : 'border-gray-300 focus:ring-blue-500'
                    } focus:border-transparent focus:ring-2 transition-colors`}
                    required
                />
                {errors.title && (
                    <p className="mt-1 text-sm text-red-600">{errors.title}</p>
                )}
            </div>

            <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                    Description
                </label>
                <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border border-gray-300 p-2
                        focus:border-transparent focus:ring-2 focus:ring-blue-500 transition-colors"
                    rows="3"
                />
            </div>
            <div>
                <label htmlFor="numQuestions" className="block text-sm font-medium text-gray-700">
                    Number of questions in the test
                </label>
                <input
                    id="numQuestions"
                    name="numQuestions"
                    type="number"
                    value={formData.numQuestions}
                    onChange={handleChange}
                    className={`mt-1 block w-full rounded-md border p-2
                        ${errors.timeLimit
                        ? 'border-red-500 focus:ring-red-500'
                        : 'border-gray-300 focus:ring-blue-500'
                    } focus:border-transparent focus:ring-2 transition-colors`}
                    min="1"
                    required
                />
                {errors.numQuestions && (
                    <p className="mt-1 text-sm text-red-600">{errors.numQuestions}</p>
                )}
            </div>
            <div>
                <label htmlFor="timeLimit" className="block text-sm font-medium text-gray-700">
                    Time Limit (minutes)
                </label>
                <input
                    id="timeLimit"
                    name="timeLimit"
                    type="number"
                    value={formData.timeLimit}
                    onChange={handleChange}
                    className={`mt-1 block w-full rounded-md border p-2
                        ${errors.timeLimit
                        ? 'border-red-500 focus:ring-red-500'
                        : 'border-gray-300 focus:ring-blue-500'
                    } focus:border-transparent focus:ring-2 transition-colors`}
                    min="1"
                    required
                />
                {errors.timeLimit && (
                    <p className="mt-1 text-sm text-red-600">{errors.timeLimit}</p>
                )}
            </div>
            <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900">Test Metadata</h3>
                {Object.entries(predefinedKeyValues).map(([key, values]) => (
                    <div key={key}>
                        <label htmlFor={key} className="block text-sm font-medium text-gray-700">
                            {key}
                        </label>
                        <select
                            id={key}
                            value={formData.metadata[key] || ''}
                            onChange={(e) => handleMetadataChange(key, e.target.value)}
                            className="mt-1 block w-full rounded-md border border-gray-300 p-2
                                focus:border-transparent focus:ring-2 focus:ring-blue-500 transition-colors"
                        >
                            <option value="">Select {key}</option>
                            {values.map(value => (
                                <option key={value} value={value}>
                                    {value}
                                </option>
                            ))}
                        </select>
                    </div>
                ))}
            </div>
            <div className="flex gap-4 justify-end">
                <button
                    type="button"
                    onClick={() => window.history.back()}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300
                        rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2
                        focus:ring-blue-500 transition-colors"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600
                        rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2
                        focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                >
                    {isEditing ? 'Update Test' : 'Create Test'}
                </button>
            </div>
        </form>
    );
};

export default TestForm;