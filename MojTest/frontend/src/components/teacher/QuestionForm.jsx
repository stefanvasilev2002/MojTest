import React, {useState, useEffect, useCallback, useRef} from 'react';
import { useAuth } from '../../context/AuthContext';
import { predefinedKeyValues } from "../../constants/metadata.js";
import FormulaInput from "../FormulaInput.jsx";
import FormulaDisplay from "../FormulaDisplay.jsx";

const QuestionForm = ({ onSubmit, isEditing = false, initialData = {}, loading = false }) => {
    const { user } = useAuth();
    const [error, setError] = useState(null);
    const [selectedType, setSelectedType] = useState(initialData.type || 'MULTIPLE_CHOICE');
    const [formData, setFormData] = useState({
        description: initialData.description || '',
        points: initialData.points || 1,
        negativePointsPerAnswer: initialData.negativePointsPerAnswer || 0,
        hint: initialData.hint || '',
        formula: initialData.formula || '',
        type: initialData.type || 'MULTIPLE_CHOICE',
        creatorId: initialData.creatorId || user?.id,
        metadata: initialData.metadata || {},

        answers: []
    });
    const [isInitialValuesSet, setIsInitialValuesSet] = useState(false); // Ensure values are set once

    useEffect(() => {
        if (!isInitialValuesSet && initialData) {
            console.log("Re-Render");

            // Log raw initialData to verify backend output
            console.log("Initial Data:", JSON.stringify(initialData, null, 2));

            const questionType = initialData.type || 'MULTIPLE_CHOICE';
            setSelectedType(questionType);

            const processedAnswers = initialData.answers?.length > 0
                ? initialData.answers.map(answer => ({
                    answerText: answer.answerText || '',
                    // Map 'correct' to 'isCorrect' for consistency in frontend
                    isCorrect: Boolean(answer.correct),
                    id: answer.id,
                }))
                : getInitialAnswers(questionType);

            // Log processed answers for comparison
            console.log("Processed Answers:", JSON.stringify(processedAnswers, null, 2));

            const metadataDTOMap = {};
            if (initialData.metadata) {
                initialData.metadata.forEach(({ key, value }) => {
                    metadataDTOMap[key] = value;
                });
            }

            setFormData({
                description: initialData.description || '',
                points: initialData.points || 1,
                negativePointsPerAnswer: initialData.negativePointsPerAnswer || 0,
                hint: initialData.hint || '',
                formula: initialData.formula || '',
                type: questionType,
                creatorId: initialData.creatorId || user?.id,
                metadata: metadataDTOMap,
                answers: processedAnswers,
            });
            setIsInitialValuesSet(true);
        }
    }, [initialData, isInitialValuesSet, user?.id]);


    const getInitialAnswers = useCallback((type) => {
        switch (type) {
            case 'MULTIPLE_CHOICE':
                return Array(4).fill().map(() => ({ answerText: '', isCorrect: false }));
            case 'TRUE_FALSE':
                return [
                    { answerText: 'True', isCorrect: true },
                    { answerText: 'False', isCorrect: false }
                ];
            case 'FILL_IN_THE_BLANK':
            case 'NUMERIC':
            case 'ESSAY':
                return [{ answerText: '', isCorrect: true }];
            default:
                return [];
        }
    }, []);

    const handleTypeChange = useCallback((e) => {
        const type = e.target.value;
        setSelectedType(type);
        setFormData(prev => ({
            ...prev,
            type: type,
            answers: getInitialAnswers(type)
        }));
    }, [getInitialAnswers]);

    const handleInputChange = useCallback((e) => {
        const { name, value, type } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'number' ? Number(value) : value
        }));
    }, []);

    const handleAnswerChange = useCallback((index, field, value) => {
        setFormData(prev => {
            const newAnswers = [...prev.answers];
            newAnswers[index] = {
                ...newAnswers[index],
                [field]: value
            };
            return {
                ...prev,
                answers: newAnswers
            };
        });
    }, []);

    const handleMultipleChoiceChange = useCallback((index, isChecked) => {
        setFormData(prev => {
            const newAnswers = prev.answers.map((answer, i) => ({
                ...answer,
                isCorrect: i === index ? Boolean(isChecked) : Boolean(answer.isCorrect)
            }));
            console.log('Updated answers:', newAnswers); // Debug log
            return {
                ...prev,
                answers: newAnswers
            };
        });
    }, []);

    const handleTrueFalseChange = useCallback((index) => {
        setFormData(prev => {
            const newAnswers = prev.answers.map((answer, i) => ({
                ...answer,
                isCorrect: Boolean(i === index)
            }));
            console.log('Updated true/false answers:', newAnswers); // Debug log
            return {
                ...prev,
                answers: newAnswers
            };
        });
    }, []);

    const handleMetadataChange = useCallback((key, value) => {
        setFormData(prev => ({
            ...prev,
            metadata: {
                ...prev.metadata,
                [key]: value
            }
        }));
    }, []);

    const addAnswer = useCallback(() => {
        if (formData.answers.length < 8) {
            setFormData(prev => ({
                ...prev,
                answers: [...prev.answers, { answerText: '', isCorrect: false }]
            }));
        }
    }, [formData.answers.length]);

    const removeAnswer = useCallback((index) => {
        if (formData.answers.length > 2) {
            setFormData(prev => ({
                ...prev,
                answers: prev.answers.filter((_, i) => i !== index)
            }));
        }
    }, [formData.answers.length]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        try {
            console.log("Form Data at Submit Start:", JSON.stringify(formData, null, 2));
            if (!formData.description.trim()) {
                throw new Error('Question description is required');
            }

            if (!user?.id) {
                throw new Error('You must be logged in to create questions');
            }

            const validAnswers = formData.answers
                .filter(a => a.answerText.trim() !== '')
                .map(({ isCorrect, ...rest }) => ({
                    ...rest,
                    correct: isCorrect
                }));
            console.log("Valid Answers After Processing:", JSON.stringify(validAnswers, null, 2));

            if (selectedType !== 'ESSAY' && validAnswers.length === 0) {
                throw new Error('At least one answer is required');
            }

            if (selectedType === 'MULTIPLE_CHOICE' && !validAnswers.some(a => a.correct)) {
                throw new Error('At least one correct answer must be selected');
            }

            const metadataArray = Object.entries(formData.metadata).map(([key, value]) => ({
                key,
                value
            }));
            console.log("Metadata Array:", JSON.stringify(metadataArray, null, 2));

            const questionData = {
                ...formData,
                type: selectedType,
                answers: validAnswers,
                creatorId: user.id,
                metadata: metadataArray
            };
            console.log("Final Question Data for Submission:", JSON.stringify(questionData, null, 2));

            await onSubmit(questionData);
        } catch (err) {
            setError(err.message);
            console.error('Error handling question:', err);
        }
    };
    const setFormula = (newFormula) => {
        setFormData((prevState) => ({
            ...prevState,
            formula: newFormula
        }));
    };
    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
                    {error}
                </div>
            )}

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Question Type
                </label>
                <select
                    value={selectedType}
                    onChange={handleTypeChange}
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                    <option value="MULTIPLE_CHOICE">Multiple Choice</option>
                    <option value="TRUE_FALSE">True/False</option>
                    <option value="FILL_IN_THE_BLANK">Fill in the Blank</option>
                    <option value="ESSAY">Essay</option>
                    <option value="NUMERIC">Numeric</option>
                </select>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Question
                </label>
                <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    required
                    rows="3"
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    placeholder="Enter your question here..."
                />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Points
                    </label>
                    <input
                        type="number"
                        name="points"
                        value={formData.points}
                        onChange={handleInputChange}
                        min="1"
                        required
                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Negative Points per Wrong Answer
                    </label>
                    <input
                        type="number"
                        name="negativePointsPerAnswer"
                        value={formData.negativePointsPerAnswer}
                        onChange={handleInputChange}
                        min="0"
                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Hint (Optional)
                </label>
                <input
                    type="text"
                    name="hint"
                    value={formData.hint}
                    onChange={handleInputChange}
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    placeholder="Provide a hint for students..."
                />
            </div>

            <div>
                {selectedType === 'NUMERIC' && (
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Formula (Optional)
                        </label>
                        {/* Render FormulaDisplay component above the input field */}
                        <FormulaDisplay formula={formData.formula} isBlock={false}/>

                        <FormulaInput
                            formula={formData.formula}
                            setFormula={setFormula}  // Update formula in state
                        />
                    </div>
                )}
            </div>

            {selectedType === 'ESSAY' ? (
                <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900">Answer Template (Optional)</h3>
                    <textarea
                        value={formData.answers[0]?.answerText || ''}
                        onChange={(e) => handleAnswerChange(0, 'answerText', e.target.value)}
                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        rows="4"
                        placeholder="Enter answer template..."
                    />
                </div>
            ) : (
                <div className="space-y-4">
                    <div className="flex justify-between items-center">
                        <h3 className="text-lg font-medium text-gray-900">Answers</h3>
                        {selectedType === 'MULTIPLE_CHOICE' && (
                            <button
                                type="button"
                                onClick={addAnswer}
                                className="text-blue-600 hover:text-blue-800"
                                disabled={formData.answers.length >= 8}
                            >
                                + Add Answer Option
                            </button>
                        )}
                    </div>
                    {formData.answers.map((answer, index) => (
                        <div key={`answer-${index}`} className="flex items-center gap-4">
                            <input
                                type="text"
                                value={answer.answerText}
                                onChange={(e) => handleAnswerChange(index, 'answerText', e.target.value)}
                                className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                placeholder="Enter answer"
                                disabled={selectedType === 'TRUE_FALSE'}
                            />

                            {selectedType === 'MULTIPLE_CHOICE' && (
                                <>
                                    <label className="flex items-center">
                                        <input
                                            type="checkbox"
                                            checked={Boolean(answer.isCorrect)}
                                            onChange={(e) => handleMultipleChoiceChange(index, e.target.checked)}
                                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                        />
                                        <span className="ml-2">Correct</span>
                                    </label>
                                    {formData.answers.length > 2 && (
                                        <button
                                            type="button"
                                            onClick={() => removeAnswer(index)}
                                            className="text-red-600 hover:text-red-800"
                                        >
                                            Remove
                                        </button>
                                    )}
                                </>
                            )}

                            {selectedType === 'TRUE_FALSE' && (
                                <label className="flex items-center">
                                    <input
                                        type="radio"
                                        name="correctAnswer"
                                        checked={Boolean(answer.isCorrect)}
                                        onChange={() => handleTrueFalseChange(index)}
                                        className="border-gray-300 text-blue-600 focus:ring-blue-500"
                                    />
                                    <span className="ml-2">Correct</span>
                                </label>
                            )}
                        </div>
                    ))}
                </div>
            )}

            <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900">Question Metadata</h3>
                {Object.entries(predefinedKeyValues).map(([key, values]) => (
                    <div key={key}>
                        <label htmlFor={key} className="block text-sm font-medium text-gray-700">
                            {key}
                        </label>
                        <select
                            id={key}
                            value={formData.metadata[key] || ''}
                            onChange={(e) => handleMetadataChange(key, e.target.value)}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
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
                    disabled={loading}
                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                >
                    {isEditing ? 'Update Question' : 'Create Question'}
                </button>
            </div>
        </form>
    );
}
export default QuestionForm;