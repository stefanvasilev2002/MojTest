import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

const QuestionList = ({ questions, onEdit, onRemove, onDelete, onAddToTest }) => {
    const { t } = useTranslation("common");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 4; // Number of questions per page

    // Get current questions
    const indexOfLastQuestion = currentPage * itemsPerPage;
    const indexOfFirstQuestion = indexOfLastQuestion - itemsPerPage;
    const currentQuestions = questions.slice(indexOfFirstQuestion, indexOfLastQuestion);

    // Calculate total pages
    const totalPages = Math.ceil(questions.length / itemsPerPage);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const getQuestionTypeLabel = (type) => {
        const typeKey = type?.toLowerCase().replace(/_/g, '') || 'multiplechoice';
        return t(`questionList.questionTypes.${typeKey}`);
    };

    const renderPagination = () => {
        const pages = [];
        for (let i = 1; i <= totalPages; i++) {
            pages.push(
                <button
                    key={i}
                    onClick={() => handlePageChange(i)}
                    className={`px-3 py-1 mx-1 rounded ${
                        currentPage === i
                            ? 'bg-blue-600 text-white'
                            : 'bg-white text-blue-600 hover:bg-blue-50'
                    }`}
                >
                    {i}
                </button>
            );
        }

        return (
            <div className="flex justify-center items-center mt-6 space-x-2">
                <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`px-4 py-2 rounded ${
                        currentPage === 1
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            : 'bg-white text-blue-600 hover:bg-blue-50'
                    }`}
                >
                    {t('pagination.previous')}
                </button>
                {pages}
                <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`px-4 py-2 rounded ${
                        currentPage === totalPages
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            : 'bg-white text-blue-600 hover:bg-blue-50'
                    }`}
                >
                    {t('pagination.next')}
                </button>
            </div>
        );
    };

    return (
        <div className="mb-12">
            <h2 className="text-2xl font-semibold mb-4">{t('questionList.title')}</h2>
            <div className="grid gap-4">
                {questions.length === 0 ? (
                    <div className="bg-white rounded-lg shadow p-6 text-center">
                        <p className="text-gray-600">{t('questionList.noQuestions')}</p>
                    </div>
                ) : (
                    currentQuestions.map(question => (
                        <div key={question.id} className="bg-white rounded-lg shadow p-6">
                            <div className="flex justify-between items-start">
                                <div>
                                    <div className="flex items-center gap-2 mb-2">
                                        <h3 className="text-xl font-semibold">{question.description}</h3>
                                        <span className="bg-blue-100 text-blue-800 text-sm px-2 py-1 rounded">
                                            {getQuestionTypeLabel(question.type)}
                                        </span>
                                    </div>

                                    <div className="text-sm text-gray-500">
                                        <span>{t('questionList.questionDetails.points')} {question.points}</span>
                                        {question.negativePointsPerAnswer > 0 && (
                                            <span className="ml-4">
                                                {t('questionList.questionDetails.negativePoints')} {question.negativePointsPerAnswer}
                                            </span>
                                        )}
                                    </div>

                                    {question.hint && (
                                        <div className="mt-2 text-sm text-gray-600">
                                            <strong>{t('questionList.questionDetails.hint')}</strong> {question.hint}
                                        </div>
                                    )}

                                    <div className="mt-4">
                                        <h3 className="font-medium mb-2">{t('questionList.questionDetails.answers')}</h3>
                                        <ul className="list-disc list-inside space-y-1">
                                            {question.answers?.map((answer, index) => (
                                                <li
                                                    key={index}
                                                    className={`${answer.correct ? 'text-green-600' : 'text-gray-600'}`}
                                                >
                                                    {answer.answerText}
                                                    {answer.correct && ' ✓'}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>

                                <div className="flex gap-2">
                                    {onAddToTest && (
                                        <button
                                            onClick={() => onAddToTest(question)}
                                            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
                                        >
                                            {t('questionList.buttons.addToTest')}
                                        </button>
                                    )}

                                    {onEdit && (
                                        <button
                                            onClick={() => onEdit(question.id)}
                                            className="bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700 transition-colors"
                                        >
                                            {t('questionList.buttons.edit')}
                                        </button>
                                    )}

                                    {onRemove && (
                                        <button
                                            onClick={() => onRemove(question.id)}
                                            className="bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-700 transition-colors"
                                        >
                                            {t('questionList.buttons.remove')}
                                        </button>
                                    )}

                                    {onDelete && (
                                        <button
                                            onClick={() => onDelete(question.id)}
                                            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors"
                                        >
                                            {t('questionList.buttons.delete')}
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {questions.length > itemsPerPage && renderPagination()}
        </div>
    );
};

export default QuestionList;