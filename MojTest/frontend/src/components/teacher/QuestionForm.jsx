import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';

const QuestionForm = ({ onSubmit, isEditing, initialData = {} }) => {
    const { user } = useAuth();
    const [formData, setFormData] = useState({
        questionType: 'MULTIPLE_CHOICE',
        description: '',
        points: 1,
        negativePointsPerAnswer: 0,
        formula: '',
        hint: '',
        answers: [],
        ...initialData
    });

    const [answers, setAnswers] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (isEditing && initialData.answers) {
            setAnswers(initialData.answers);
        } else {
            // Initialize with empty answers based on question type
            resetAnswersForType(formData.questionType);
        }
    }, [isEditing, initialData]);

    const resetAnswersForType = (type) => {
        switch (type) {
            case 'MULTIPLE_CHOICE':
                setAnswers([
                    { answerText: '', isCorrect: false },
                    { answerText: '', isCorrect: false },
                    { answerText: '', isCorrect: false },
                    { answerText: '', isCorrect: false }
                ]);
                break;
            case 'TRUE_FALSE':
                setAnswers([
                    { answerText: 'True', isCorrect: false },
                    { answerText: 'False', isCorrect: false }
                ]);
                break;
            case 'FILL_IN_THE_BLANK':
            case 'NUMERIC':
                setAnswers([{ answerText: '', isCorrect: true }]);
                break;
            case 'ESSAY':
                setAnswers([]); // Essay questions don't have predefined answers
                break;
            default:
                setAnswers([]);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        if (name === 'questionType') {
            resetAnswersForType(value);
        }
    };

    const handleAnswerChange = (index, field, value) => {
        const newAnswers = [...answers];
        newAnswers[index] = {
            ...newAnswers[index],
            [field]: value
        };
        setAnswers(newAnswers);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        // Validation
        if (!formData.description.trim()) {
            setError('Question description is required');
            return;
        }

        if (formData.questionType !== 'ESSAY' && answers.length === 0) {
            setError('At least one answer is required');
            return;
        }

        if (formData.questionType === 'MULTIPLE_CHOICE' && !answers.some(a => a.isCorrect)) {
            setError('At least one correct answer must be selected');
            return;
        }

        try {
            await onSubmit({
                ...formData,
                answers: answers.filter(a => a.answerText.trim() !== '')
            });
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                    {error}
                </div>
            )}

            <div className="space-y-4">
                {/* Question Type Selection */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Question Type
                    </label>
                    <select
                        name="questionType"
                        value={formData.questionType}
                        onChange={handleInputChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    >
                        <option value="MULTIPLE_CHOICE">Multiple Choice</option>
                        <option value="TRUE_FALSE">True/False</option>
                        <option value="FILL_IN_THE_BLANK">Fill in the Blank</option>
                        <option value="ESSAY">Essay</option>
                        <option value="NUMERIC">Numeric</option>
                    </select>
                </div>

                {/* Question Description */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Question Description
                    </label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        rows="3"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        required
                    />
                </div>

                {/* Points */}
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Points
                        </label>
                        <input
                            type="number"
                            name="points"
                            value={formData.points}
                            onChange={handleInputChange}
                            min="1"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Negative Points per Wrong Answer
                        </label>
                        <input
                            type="number"
                            name="negativePointsPerAnswer"
                            value={formData.negativePointsPerAnswer}
                            onChange={handleInputChange}
                            min="0"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        />
                    </div>
                </div>

                {/* Hint */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Hint (Optional)
                    </label>
                    <input
                        type="text"
                        name="hint"
                        value={formData.hint}
                        onChange={handleInputChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                </div>

                {/* Formula (for numeric questions) */}
                {formData.questionType === 'NUMERIC' && (
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Formula (Optional)
                        </label>
                        <input
                            type="text"
                            name="formula"
                            value={formData.formula}
                            onChange={handleInputChange}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        />
                    </div>
                )}

                {/* Answers Section */}
                {formData.questionType !== 'ESSAY' && (
                    <div className="space-y-4">
                        <h3 className="text-lg font-medium text-gray-900">Answers</h3>
                        {answers.map((answer, index) => (
                            <div key={index} className="flex items-center gap-4">
                                <input
                                    type="text"
                                    value={answer.answerText}
                                    onChange={(e) => handleAnswerChange(index, 'answerText', e.target.value)}
                                    className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    placeholder="Enter answer"
                                    disabled={formData.questionType === 'TRUE_FALSE'}
                                />
                                {formData.questionType === 'MULTIPLE_CHOICE' && (
                                    <label className="flex items-center">
                                        <input
                                            type="checkbox"
                                            checked={answer.isCorrect}
                                            onChange={(e) => handleAnswerChange(index, 'isCorrect', e.target.checked)}
                                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                        />
                                        <span className="ml-2 text-sm text-gray-600">Correct</span>
                                    </label>
                                )}
                                {formData.questionType === 'TRUE_FALSE' && (
                                    <label className="flex items-center">
                                        <input
                                            type="radio"
                                            name="correctAnswer"
                                            checked={answer.isCorrect}
                                            onChange={() => {
                                                const newAnswers = answers.map((a, i) => ({
                                                    ...a,
                                                    isCorrect: i === index
                                                }));
                                                setAnswers(newAnswers);
                                            }}
                                            className="border-gray-300 text-blue-600 focus:ring-blue-500"
                                        />
                                        <span className="ml-2 text-sm text-gray-600">Correct</span>
                                    </label>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div className="flex justify-end space-x-4">
                <button
                    type="button"
                    onClick={() => window.history.back()}
                    className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                    {isEditing ? 'Update Question' : 'Create Question'}
                </button>
            </div>
        </form>
    );
};

export default QuestionForm;