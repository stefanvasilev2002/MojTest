import React, {useState, useEffect, useCallback} from 'react';
import { useAuth } from '../../context/AuthContext';
import { predefinedKeyValues } from "../../config/predefinedKeyValues.js";
import FormulaInput from "../FormulaInput.jsx";
import FormulaDisplay from "../FormulaDisplay.jsx";
import { useTranslation } from 'react-i18next';
import {getTranslatedMetadata} from "../../config/translatedMetadata.js";
import ImageUploader from "../ImageUploader.jsx";
import { Plus, Minus, Check, X, ArrowLeft } from 'lucide-react';

const QuestionForm = ({ onSubmit, isEditing = false, initialData = {}, mode = 'create', loading = false }) => {
    const { t , i18n} = useTranslation("common");
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
        answers: [],
        file: initialData.file || null,
    });
    const [originalData, setOriginalData] = useState(null);
    const [isInitialValuesSet, setIsInitialValuesSet] = useState(false);

    useEffect(() => {
        if (!isInitialValuesSet && initialData) {
            const questionType = initialData.type || 'MULTIPLE_CHOICE';
            setSelectedType(questionType);

            const processedAnswers = initialData.answers?.length > 0
                ? initialData.answers.map(answer => ({
                    answerText: answer.answerText || '',
                    isCorrect: Boolean(answer.correct),
                    id: answer.id,
                }))
                : getInitialAnswers(questionType);

            const metadataDTOMap = {};
            if (initialData.metadata) {
                initialData.metadata.forEach(({ key, value }) => {
                    metadataDTOMap[key] = value;
                });
            }

            const fullData = {
                description: initialData.description || '',
                points: initialData.points || 1,
                negativePointsPerAnswer: initialData.negativePointsPerAnswer || 0,
                hint: initialData.hint || '',
                formula: initialData.formula || '',
                type: questionType,
                creatorId: initialData.creatorId || user?.id,
                metadata: metadataDTOMap,
                answers: processedAnswers,
                file: initialData.file || null,
            };

            setFormData(fullData);

            if (mode === 'copy' || (mode === 'edit' && initialData.isCopy)) {
                setOriginalData(fullData);
            }

            setIsInitialValuesSet(true);
        }
    }, [initialData, isInitialValuesSet, mode, user?.id]);


    const getInitialAnswers = useCallback((type) => {
        switch (type) {
            case 'MULTIPLE_CHOICE':
                return Array(4).fill().map(() => ({ answerText: '', isCorrect: false }));
            case 'TRUE_FALSE':
                return [
                    { answerText: `${t("trueFalse.true")}`, isCorrect: true },
                    { answerText: `${t("trueFalse.false")}`, isCorrect: false }
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

    const compareMetadata = (formData, originalData) => {
        // Convert metadata to key-value pairs if it's an object
        const metadata1 = Array.isArray(formData.metadata)
            ? formData.metadata
            : Object.entries(formData.metadata || {});  // Convert to an array if it's an object

        const metadata2 = Array.isArray(originalData.metadata)
            ? originalData.metadata
            : Object.entries(originalData.metadata || {});  // Convert to an array if it's an object

        // Sort both metadata arrays by key for normalization
        metadata1.sort((a, b) => a[0].localeCompare(b[0]));
        metadata2.sort((a, b) => a[0].localeCompare(b[0]));

        // Check if lengths are different
        if (metadata1.length !== metadata2.length) return false;

        // Compare each key-value pair
        for (let i = 0; i < metadata1.length; i++) {
            const [key1, value1] = metadata1[i];
            const [key2, value2] = metadata2[i];

            // Ensure both items have the same key and value
            if (key1 !== key2 || value1 !== value2) {
                return false;
            }
        }

        // Return true if no differences were found
        return true;
    };
    const compareAnswers = (formData, originalData) => {
        const answers1 = Array.isArray(formData.answers) ? formData.answers : [];
        const answers2 = Array.isArray(originalData.answers) ? originalData.answers : [];

        // Sort the answers by their 'id' to ensure consistent ordering
        answers1.sort((a, b) => a.id - b.id);  // Sorting by 'id' field
        answers2.sort((a, b) => a.id - b.id);  // Sorting by 'id' field

        // Check if lengths are different
        if (answers1.length !== answers2.length) return false;

        // Compare each answer
        for (let i = 0; i < answers1.length; i++) {
            const a1 = answers1[i];
            const a2 = answers2[i];

            // Map 'correct' to 'isCorrect' before comparison
            const isCorrect1 = a1.correct !== undefined ? a1.correct : a1.isCorrect;
            const isCorrect2 = a2.correct !== undefined ? a2.correct : a2.isCorrect;

            // Ensure both answers have the same text, id, and correctness
            if (a1.answerText !== a2.answerText || a1.id !== a2.id || isCorrect1 !== isCorrect2) {
                return false;
            }
        }

        // Return true if no differences were found
        return true;
    };
    const compareOtherFields = (formData, originalData) => {
        const fieldsToCompare = [
            'description',
            'points',
            'negativePointsPerAnswer',
            'hint',
            'formula',
            'type'
        ];

        // Check if the field values in both formData and originalData are equal
        for (let field of fieldsToCompare) {
            if (formData[field] !== originalData[field]) {
                return false; // If any field does not match, return false
            }
        }

        return true; // All fields are the same
    };

    const handleImageUploadComplete = (uploadedFile) => {
        setFormData((prev) => ({
            ...prev,
            file: { id: uploadedFile.fileId }, // Store image ID in formData
        }));
    };

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

            const questionData = {
                ...formData,
                type: selectedType,
                answers: validAnswers,
                creatorId: user.id,
                metadata: metadataArray,
            };

            // Check if copying and detect changes in metadata, answers, and other fields
            if (mode === 'copy' || (mode === 'edit' && initialData.isCopy)) {
                const metadataUnchanged = compareMetadata(formData, originalData); // Check metadata
                const answersUnchanged = compareAnswers(formData, originalData);  // Check answers
                const otherFieldsUnchanged = compareOtherFields(formData, originalData);  // Check other fields
                questionData.isCopy = metadataUnchanged && answersUnchanged && otherFieldsUnchanged; // If all are unchanged, mark as copy

                console.log("Metadata Unchanged?", metadataUnchanged);
                console.log("Answers Unchanged?", answersUnchanged);
                console.log("Other Fields Unchanged?", otherFieldsUnchanged);
                console.log("Final isCopy:", questionData.isCopy);
            } else {
                questionData.isCopy = false;
            }

            console.log("Final Data to Submit:", JSON.stringify(questionData, null, 2));
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
        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto space-y-6 p-4 sm:p-6">
            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6 text-sm sm:text-base">
                    {error}
                </div>
            )}

            {/* Question Type Selection */}
            <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                    {t('questionForm.labels.type')}
                </label>
                <select
                    value={selectedType}
                    onChange={handleTypeChange}
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm sm:text-base"
                >
                    <option value="MULTIPLE_CHOICE">{t('questionForm.types.multipleChoice')}</option>
                    <option value="TRUE_FALSE">{t('questionForm.types.trueFalse')}</option>
                    <option value="FILL_IN_THE_BLANK">{t('questionForm.types.fillBlank')}</option>
                    <option value="ESSAY">{t('questionForm.types.essay')}</option>
                    <option value="NUMERIC">{t('questionForm.types.numeric')}</option>
                </select>
            </div>

            {/* Question Description */}
            <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                    {t('questionForm.labels.question')}
                </label>
                <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    required
                    rows="3"
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm sm:text-base"
                    placeholder={t('questionForm.placeholders.question')}
                />
            </div>

            {/* Points Section */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                        {t('questionForm.labels.points')}
                    </label>
                    <input
                        type="number"
                        name="points"
                        value={formData.points}
                        onChange={handleInputChange}
                        min="1"
                        required
                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm sm:text-base"
                    />
                </div>
                <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                        {t('questionForm.labels.negativePoints')}
                    </label>
                    <input
                        type="number"
                        name="negativePointsPerAnswer"
                        value={formData.negativePointsPerAnswer}
                        onChange={handleInputChange}
                        min="0"
                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm sm:text-base"
                    />
                </div>
            </div>

            {/* Hint */}
            <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                    {t('questionForm.labels.hint')}
                </label>
                <input
                    type="text"
                    name="hint"
                    value={formData.hint}
                    onChange={handleInputChange}
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm sm:text-base"
                    placeholder={t('questionForm.placeholders.hint')}
                />
            </div>

            {/* Image Upload */}
            <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                    Optional Image
                </label>
                <div className="w-full sm:w-auto">
                    <ImageUploader
                        label="Upload Image"
                        onUploadComplete={handleImageUploadComplete}
                        initialFile={formData.file}
                    />
                </div>
            </div>

            {/* Formula Input for Numeric Questions */}
            {selectedType === 'NUMERIC' && (
                <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                        {t('questionForm.labels.formula')}
                    </label>
                    <div className="space-y-2">
                        <FormulaDisplay formula={formData.formula} isBlock={false} />
                        <FormulaInput
                            formula={formData.formula}
                            setFormula={setFormula}
                        />
                    </div>
                </div>
            )}

            {/* Answers Section */}
            {selectedType === 'ESSAY' ? (
                <div className="space-y-2">
                    <h3 className="text-lg font-medium text-gray-900">
                        {t('questionForm.labels.answerTemplate')}
                    </h3>
                    <textarea
                        value={formData.answers[0]?.answerText || ''}
                        onChange={(e) => handleAnswerChange(0, 'answerText', e.target.value)}
                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm sm:text-base"
                        rows="4"
                        placeholder={t('questionForm.placeholders.answerTemplate')}
                    />
                </div>
            ) : (
                <div className="space-y-4">
                    <div className="flex justify-between items-center">
                        <h3 className="text-lg font-medium text-gray-900">
                            {t('questionForm.labels.answers')}
                        </h3>
                        {selectedType === 'MULTIPLE_CHOICE' && (
                            <button
                                type="button"
                                onClick={addAnswer}
                                disabled={formData.answers.length >= 8}
                                className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
                            >
                                <Plus className="w-4 h-4" />
                                {t('questionForm.buttons.addAnswer')}
                            </button>
                        )}
                    </div>
                    <div className="space-y-3">
                        {formData.answers.map((answer, index) => (
                            <div key={`answer-${index}`} className="flex flex-col sm:flex-row gap-2 sm:items-center">
                                <input
                                    type="text"
                                    value={answer.answerText}
                                    onChange={(e) => handleAnswerChange(index, 'answerText', e.target.value)}
                                    className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm sm:text-base"
                                    placeholder={t('questionForm.placeholders.answer')}
                                    disabled={selectedType === 'TRUE_FALSE'}
                                />

                                <div className="flex items-center gap-2 justify-end sm:justify-start">
                                    {selectedType === 'MULTIPLE_CHOICE' && (
                                        <>
                                            <label className="inline-flex items-center gap-2 text-sm">
                                                <input
                                                    type="checkbox"
                                                    checked={Boolean(answer.isCorrect)}
                                                    onChange={(e) => handleMultipleChoiceChange(index, e.target.checked)}
                                                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                                />
                                                <span>{t('questionForm.labels.correct')}</span>
                                            </label>
                                            {formData.answers.length > 2 && (
                                                <button
                                                    type="button"
                                                    onClick={() => removeAnswer(index)}
                                                    className="text-red-600 hover:text-red-800"
                                                >
                                                    <Minus className="w-4 h-4" />
                                                </button>
                                            )}
                                        </>
                                    )}

                                    {selectedType === 'TRUE_FALSE' && (
                                        <label className="inline-flex items-center gap-2 text-sm">
                                            <input
                                                type="radio"
                                                name="correctAnswer"
                                                checked={Boolean(answer.isCorrect)}
                                                onChange={() => handleTrueFalseChange(index)}
                                                className="border-gray-300 text-blue-600 focus:ring-blue-500"
                                            />
                                            <span>{t('questionForm.labels.correct')}</span>
                                        </label>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Metadata Section */}
            <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900">
                    {t('questionForm.labels.metadata')}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {Object.entries(predefinedKeyValues).map(([key, values]) => (
                        <div key={key} className="space-y-2">
                            <label htmlFor={key} className="block text-sm font-medium text-gray-700">
                                {t(`metadata.${key}`)}
                            </label>
                            <select
                                id={key}
                                value={formData.metadata[key] || ''}
                                onChange={(e) => handleMetadataChange(key, e.target.value)}
                                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm sm:text-base"
                            >
                                <option value="">
                                    {t('questionForm.placeholders.selectMetadata', {field: t(`metadata.${key}`)})}
                                </option>
                                {values.map(value => (
                                    <option key={value} value={value}>
                                        {getTranslatedMetadata(key, value, i18n.language) || value}
                                    </option>
                                ))}
                            </select>
                        </div>
                    ))}
                </div>
            </div>

            {/* Form Actions */}
            <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 sm:gap-4 pt-4">
                <button
                    type="button"
                    onClick={() => window.history.back()}
                    className="w-full sm:w-auto px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 flex items-center justify-center gap-2"
                >
                    <ArrowLeft className="w-4 h-4" />
                    {t('questionForm.buttons.cancel')}
                </button>
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full sm:w-auto px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                    {loading ? (
                        <span className="animate-spin">⌛</span>
                    ) : (
                        <Check className="w-4 h-4" />
                    )}
                    {isEditing ? t('questionForm.buttons.update') : t('questionForm.buttons.create')}
                </button>
            </div>
        </form>
    );
};

export default QuestionForm;