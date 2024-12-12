
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const QuestionForm = ({ initialData, onSubmit, isEditing }) => {
    const [formData, setFormData] = useState({
        description: '',
        points: 1,
        answers: [
            { answerText: '', isCorrect: false },
            { answerText: '', isCorrect: false }
        ],
        ...initialData
    });

    const handleAnswerChange = (index, field, value) => {
        const newAnswers = [...formData.answers];
        newAnswers[index] = { ...newAnswers[index], [field]: value };
        setFormData({ ...formData, answers: newAnswers });
    };

    const addAnswer = () => {
        setFormData({
            ...formData,
            answers: [...formData.answers, { answerText: '', isCorrect: false }]
        });
    };

    const removeAnswer = (index) => {
        const newAnswers = formData.answers.filter((_, i) => i !== index);
        setFormData({ ...formData, answers: newAnswers });
    };

    return (
        <form onSubmit={(e) => {
            e.preventDefault();
            onSubmit(formData);
        }} className="space-y-6">
            <div>
                <label className="block text-sm font-medium text-gray-700">Question Text</label>
                <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="mt-1 block w-full rounded-md border border-gray-300 p-2"
                    rows="3"
                    required
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700">Points</label>
                <input
                    type="number"
                    value={formData.points}
                    onChange={(e) => setFormData({ ...formData, points: parseInt(e.target.value) })}
                    className="mt-1 block w-full rounded-md border border-gray-300 p-2"
                    min="1"
                    required
                />
            </div>

            <div className="space-y-4">
                <label className="block text-sm font-medium text-gray-700">Answers</label>
                {formData.answers.map((answer, index) => (
                    <div key={index} className="flex gap-4 items-center">
                        <input
                            type="text"
                            value={answer.answerText}
                            onChange={(e) => handleAnswerChange(index, 'answerText', e.target.value)}
                            className="flex-1 rounded-md border border-gray-300 p-2"
                            placeholder="Answer text"
                            required
                        />
                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                checked={answer.isCorrect}
                                onChange={(e) => handleAnswerChange(index, 'isCorrect', e.target.checked)}
                                className="h-4 w-4 text-blue-600"
                            />
                            <label className="text-sm text-gray-600">Correct</label>
                        </div>
                        {formData.answers.length > 2 && (
                            <button
                                type="button"
                                onClick={() => removeAnswer(index)}
                                className="text-red-600 hover:text-red-700"
                            >
                                Remove
                            </button>
                        )}
                    </div>
                ))}
                <button
                    type="button"
                    onClick={addAnswer}
                    className="text-blue-600 hover:text-blue-700"
                >
                    + Add Answer
                </button>
            </div>

            <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700"
            >
                {isEditing ? 'Update Question' : 'Create Question'}
            </button>
        </form>
    );
};