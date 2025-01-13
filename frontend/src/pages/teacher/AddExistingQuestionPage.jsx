import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import testQuestionService from "../../services/testQuestionService";
import QuestionList from "../../components/teacher/QuestionList";
import MetadataFilter from "../../components/MetadataFilter.jsx";

const AddExistingQuestionPage = ({ onSelectQuestion }) => {
    const { t } = useTranslation("common");
    const { testId } = useParams();
    const [allQuestions, setAllQuestions] = useState([]);
    const [filteredQuestions, setFilteredQuestions] = useState([]);
    const [filterOptions, setFilterOptions] = useState({});

    useEffect(() => {
        const fetchQuestions = async () => {
            try {
                const questions = await testQuestionService.getAllQuestionsNotInTest(testId);
                setAllQuestions(questions);
                setFilteredQuestions(questions);
            } catch (err) {
                console.error(t('addExistingQuestion.error.fetchQuestions'), err);
            }
        };

        fetchQuestions();
    }, [t, testId]);

    const filterQuestions = () => {
        if (Object.keys(filterOptions).every((key) => filterOptions[key].length === 0)) {
            const nonCopyQuestions = allQuestions.filter((question) => !question.isCopy);
            setFilteredQuestions(nonCopyQuestions);
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

    const handleAddToTest = (question) => {
        onSelectQuestion(question);
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="px-4 sm:px-6 lg:px-8 py-6 max-w-[95%] mx-auto">
                <h1 className="text-2xl sm:text-3xl font-bold text-blue-600 mb-6 sm:mb-8">
                    {t('addExistingQuestion.title')}
                </h1>

                <div className="space-y-6">
                    <MetadataFilter
                        filterOptions={filterOptions}
                        setFilterOptions={setFilterOptions}
                    />

                    <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 border border-gray-200">
                        <QuestionList
                            questions={filteredQuestions}
                            onAddToTest={handleAddToTest}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddExistingQuestionPage;