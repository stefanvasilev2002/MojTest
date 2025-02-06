import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import { endpoints } from '../../config/api.config.jsx';
import MetadataFilter from "../../components/MetadataFilter.jsx";
import ConfirmModal from "../../components/teacher/ConfirmModal.jsx";
import QuestionCard from "../../components/teacher/QuestionCard.jsx";

const AddMultipleQuestionsPage = () => {
    const { t } = useTranslation("common");
    const { testId } = useParams();
    const [allQuestions, setAllQuestions] = useState([]);
    const [filteredQuestions, setFilteredQuestions] = useState([]);
    const [filterOptions, setFilterOptions] = useState({});
    const [selectedQuestions, setSelectedQuestions] = useState(new Set());
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showConfirmModal, setShowConfirmModal] = useState(false);

    useEffect(() => {
        const fetchQuestions = async () => {
            try {
                const response = await axios.get(endpoints.questions.getNotInTest(testId));
                setAllQuestions(response.data);
                setFilteredQuestions(response.data);
            } catch (err) {
                console.error(t('addMultipleQuestions.error.fetchQuestions'), err);
            }
        };

        fetchQuestions();
    }, [t, testId]);

    const filterQuestions = () => {
        if (Object.keys(filterOptions).every((key) => filterOptions[key].length === 0)) {
            const nonCopyQuestions = allQuestions.filter((question) => !question.isCopy);
            setFilteredQuestions(nonCopyQuestions);
            console.log(nonCopyQuestions);
            return;
        }
        const filtered = allQuestions.filter((question) => {
            let matches = true;

            if (question.isCopy) {
                matches = false;
            }

            Object.keys(filterOptions).forEach((key) => {
                const selectedValues = filterOptions[key].map((opt) => opt.value);
                const questionMetadata = question.metadata || [];
                const hasMatchingMetadata = questionMetadata.some((metadataItem) =>
                    selectedValues.includes(metadataItem.value) && metadataItem.key === key
                );

                if (selectedValues.length > 0 && !hasMatchingMetadata) {
                    matches = false;
                }
            });

            return matches;
        });

        setFilteredQuestions(filtered);
    };

    useEffect(() => {
        filterQuestions();
    }, [filterOptions, allQuestions]);

    const handleCheckboxChange = (questionId) => {
        const newSelected = new Set(selectedQuestions);
        if (newSelected.has(questionId)) {
            newSelected.delete(questionId);
        } else {
            newSelected.add(questionId);
        }
        setSelectedQuestions(newSelected);
    };

    const handleSubmit = async () => {
        if (selectedQuestions.size === 0) return;

        setIsSubmitting(true);
        try {
            const promises = Array.from(selectedQuestions).map(questionId =>
                axios.post(endpoints.questions.addToTest(testId, questionId))
            );

            await Promise.all(promises);

            setSelectedQuestions(new Set());
            const response = await axios.get(endpoints.questions.getNotInTest(testId));
            setAllQuestions(response.data);
            setFilteredQuestions(response.data);
        } catch (error) {
            console.error('Error adding questions:', error);
        } finally {
            setIsSubmitting(false);
        }
    };
    const handleConfirmSubmit = async () => {
        setShowConfirmModal(false);
        handleSubmit();
    };
    return (
        <div className="min-h-screen bg-gray-50">
            <div className="px-4 sm:px-6 lg:px-8 py-6 max-w-[95%] mx-auto">
                <h1 className="text-2xl sm:text-3xl font-bold text-blue-600 mb-6 sm:mb-8">
                    {t('addMultipleQuestions.title')}
                </h1>

                <div className="space-y-6">
                    <MetadataFilter
                        filterOptions={filterOptions}
                        setFilterOptions={setFilterOptions}
                    />

                    <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 border border-gray-200">
                        {selectedQuestions.size > 0 && (
                            <div className="mb-4 flex justify-between items-center">
                                <span className="text-sm text-gray-600">
                                    {t('addMultipleQuestions.selectedCount', { count: selectedQuestions.size })}
                                </span>
                                <button
                                    onClick={() => setShowConfirmModal(true)}
                                    disabled={isSubmitting}
                                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors duration-200 disabled:bg-blue-400"
                                >
                                    {isSubmitting
                                        ? t('addMultipleQuestions.adding')
                                        : t('addMultipleQuestions.addSelected')}
                                </button>
                            </div>
                        )}

                        <div className="space-y-4">
                            {filteredQuestions.map((question) => (
                                <QuestionCard
                                    key={question.id}
                                    question={question}
                                    checked={selectedQuestions.has(question.id)}
                                    onChange={() => handleCheckboxChange(question.id)}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <ConfirmModal
                isOpen={showConfirmModal}
                onClose={() => setShowConfirmModal(false)}
                onConfirm={handleConfirmSubmit}
                count={selectedQuestions.size}
            />
        </div>
    );
};

export default AddMultipleQuestionsPage;