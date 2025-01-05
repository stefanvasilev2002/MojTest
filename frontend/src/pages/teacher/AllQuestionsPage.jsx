import React, { useState } from 'react';
import {Link, useNavigate} from 'react-router-dom';
import useQuestion from '../../hooks/crud/useQuestion.js';
import { useAuth } from '../../context/AuthContext.jsx';
import { useTranslation } from 'react-i18next';
import DeleteQuestionModal from "../../components/teacher/DeleteQuestionModal.jsx";

const AllQuestionsPage = () => {
    const { items: questions, loading: questionsLoading, error: questionsError, deleteItem: deleteQuestion } = useQuestion();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('myQuestions');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 4;
    const { t } = useTranslation("common");

    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [questionToDelete, setQuestionToDelete] = useState(null);

    const myQuestions = questions.filter(question => question.creatorId === user.id);
    const allQuestions = questions;

    const handleDeleteClick = (question) => {
        setQuestionToDelete(question);
        setDeleteModalOpen(true);
    };

    const handleDeleteConfirm = async () => {
        if (questionToDelete) {
            try {
                await deleteQuestion(questionToDelete.id);
                setDeleteModalOpen(false);
                setQuestionToDelete(null);
            } catch (error) {
                console.error('Error deleting question:', error);
            }
        }
    };

    // Get current questions based on pagination
    const getCurrentQuestions = () => {
        const currentQuestions = activeTab === 'myQuestions' ? myQuestions : allQuestions;
        const indexOfLastItem = currentPage * itemsPerPage;
        const indexOfFirstItem = indexOfLastItem - itemsPerPage;
        return currentQuestions.slice(indexOfFirstItem, indexOfLastItem);
    };

    // Calculate total pages
    const totalPages = Math.ceil(
        (activeTab === 'myQuestions' ? myQuestions.length : allQuestions.length) / itemsPerPage
    );

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const handleTabChange = (tab) => {
        setActiveTab(tab);
        setCurrentPage(1);
    };

    const handleCreateQuestion = () => {
        navigate('/teacher-dashboard/create-question');
    };

    const handleEditQuestion = (questionId) => {
        navigate(`/teacher-dashboard/questions/${questionId}/edit`);
    };

    const getQuestionTypeLabel = (type) => {
        return t(`questionTypes.${type}`) || t('questionTypes.MULTIPLE_CHOICE');
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

    const renderQuestion = (question) => {
        const isCreator = question.creatorId === user.id;

        return (
            <div key={question.id} className="bg-white rounded-lg shadow p-6">
                <div className="flex justify-between items-start">
                    <div className="flex-grow">
                        <div className="flex items-center gap-2 mb-2">
                            <h2 className="text-xl font-semibold">{question.description}</h2>
                            <span className="bg-blue-100 text-blue-800 text-sm px-2 py-1 rounded">
                                {getQuestionTypeLabel(question.type)}
                            </span>
                            {!isCreator && (
                                <span className="text-sm bg-gray-100 text-gray-600 px-2 py-1 rounded">
                                {t('dashboard.testDetails.createdBy')} {question.name}
                            </span>
                            )}
                        </div>
                        <div className="text-sm text-gray-500">
                            <span>{t('questionsPage.questionDetails.points')} {question.points}</span>
                            {question.negativePointsPerAnswer > 0 && (
                                <span className="ml-4">
                                    {t('questionsPage.questionDetails.negativePoints')}
                                    {question.negativePointsPerAnswer}
                                </span>
                            )}
                        </div>
                        {question.hint && (
                            <div className="mt-2 text-sm text-gray-600">
                                <strong>{t('questionsPage.questionDetails.hint')} </strong>{question.hint}
                            </div>
                        )}
                        <div className="mt-4">
                            <h3 className="font-medium mb-2">{t('questionsPage.questionDetails.answers')}</h3>
                            <ul className="list-disc list-inside space-y-1">
                                {question.answers?.map((answer, index) => (
                                    <li
                                        key={index}
                                        className={`${answer.isCorrect ? 'text-green-600' : 'text-gray-600'}`}
                                    >
                                        {answer.answerText}
                                        {answer.isCorrect && ' ✓'}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                    {isCreator && (
                        <div className="flex gap-2 ml-4">
                            <button
                                onClick={() => handleEditQuestion(question.id)}
                                className="bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700 transition-colors"
                            >
                                {t('questionsPage.questionDetails.actions.edit')}
                            </button>
                            <button
                                onClick={() => handleDeleteClick(question)}
                                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors"
                            >
                                {t('questionsPage.questionDetails.actions.delete')}
                            </button>
                        </div>
                    )}
                </div>
            </div>
        );
    };

    if (questionsLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <p className="text-lg">{t('questions.loading')}</p>
            </div>
        );
    }

    if (questionsError) {
        return (
            <div className="min-h-screen bg-gray-50 p-4">
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                    {t('questions.error')} {questionsError}
                </div>
            </div>
        );
    }

    return (
        <div className="p-6">
            <div className="max-w-6xl mx-auto">
                <div className="mb-6 flex items-center justify-between">
                    <Link
                        to="/teacher-dashboard"
                        className="text-blue-600 hover:text-blue-800 flex items-center gap-2"
                    >
                        {t('questionsPage.backToDashboard')}
                    </Link>
                </div>
                <div className="flex justify-between items-center mb-8">

                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => handleTabChange('myQuestions')}
                            className={`text-lg font-semibold px-4 py-2 rounded-lg transition-colors ${
                                activeTab === 'myQuestions'
                                    ? 'bg-blue-600 text-white'
                                    : 'text-blue-600 hover:bg-blue-50'
                            }`}
                        >
                            {t('questions.myQuestions')}
                        </button>
                        <button
                            onClick={() => handleTabChange('allQuestions')}
                            className={`text-lg font-semibold px-4 py-2 rounded-lg transition-colors ${
                                activeTab === 'allQuestions'
                                    ? 'bg-blue-600 text-white'
                                    : 'text-blue-600 hover:bg-blue-50'
                            }`}
                        >
                            {t('questions.allQuestions')}
                        </button>
                    </div>
                    <button
                        onClick={handleCreateQuestion}
                        className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
                    >
                        {t('questions.createNew')}
                    </button>
                </div>

                <div className="grid gap-6">
                    {getCurrentQuestions().length === 0 ? (
                        <div className="bg-white rounded-lg shadow p-6 text-center">
                            <p className="text-gray-600">
                                {activeTab === 'myQuestions'
                                    ? t('questions.noMyQuestionsAvailable')
                                    : t('questions.noQuestionsAvailable')}
                            </p>
                        </div>
                    ) : (
                        getCurrentQuestions().map(question => renderQuestion(question))
                    )}
                </div>

                {(activeTab === 'myQuestions' ? myQuestions : allQuestions).length > itemsPerPage && renderPagination()}

                <DeleteQuestionModal
                    isOpen={deleteModalOpen}
                    onClose={() => setDeleteModalOpen(false)}
                    onConfirm={handleDeleteConfirm}
                    questionText={questionToDelete?.description}
                />
            </div>
        </div>
    );
};

export default AllQuestionsPage;