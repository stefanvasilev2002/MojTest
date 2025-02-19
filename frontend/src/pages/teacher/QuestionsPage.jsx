import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTranslation } from 'react-i18next';
import testQuestionService from '../../services/testQuestionService';
import DeleteQuestionModal from "../../components/teacher/DeleteQuestionModal.jsx";
import { endpoints } from "../../config/api.config.jsx";
import { ArrowLeft, Check, X } from "lucide-react";

const TestQuestionsPage = () => {
    const { t } = useTranslation("common");
    const { testId } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [test, setTest] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 4;

    useEffect(() => {
        fetchTestAndQuestions();
    }, [testId]);

    const indexOfLastQuestion = currentPage * itemsPerPage;
    const indexOfFirstQuestion = indexOfLastQuestion - itemsPerPage;
    const currentQuestions = questions.slice(indexOfFirstQuestion, indexOfLastQuestion);
    const totalPages = Math.ceil(questions.length / itemsPerPage);

    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [questionToDelete, setQuestionToDelete] = useState(null);

    const handleDeleteClick = (question) => {
        setQuestionToDelete(question);
        setDeleteModalOpen(true);
    };

    const handleDeleteConfirm = async () => {
        if (questionToDelete) {
            try {
                await testQuestionService.deleteQuestion(questionToDelete.id, user.token);
                setDeleteModalOpen(false);
                setQuestionToDelete(null);
                fetchTestAndQuestions();
            } catch (error) {
                setError(error.message);
            }
        }
    };

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
        // Scroll to top when changing pages on mobile
        window.scrollTo(0, 0);
    };

    const fetchTestAndQuestions = async () => {
        try {
            setLoading(true);
            const testData = await fetch(endpoints.tests.getById(testId), {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${user.token}`,
                    'Content-Type': 'application/json'
                },
            });

            if (!testData.ok) {
                throw new Error('Failed to fetch test data');
            }

            setTest(await testData.json());
            const questionsData = await testQuestionService.getQuestionsByTestId(testId, user.token);
            setQuestions(questionsData);
            setError(null);
        } catch (err) {
            setError(err.message);
            console.error('Error fetching data:', err);
        } finally {
            setLoading(false);
        }
    };

    const renderPagination = () => {
        const pages = [];
        for (let i = 1; i <= totalPages; i++) {
            pages.push(
                <button
                    key={i}
                    onClick={() => handlePageChange(i)}
                    className={`px-2 py-1 mx-1 rounded text-sm md:text-base md:px-3 ${
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
            <div className="flex justify-center items-center mt-6 space-x-1 md:space-x-2">
                <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`px-2 py-1 md:px-4 md:py-2 rounded text-sm md:text-base ${
                        currentPage === 1
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            : 'bg-white text-blue-600 hover:bg-blue-50'
                    }`}
                >
                    {t('pagination.previous')}
                </button>
                <div className="flex overflow-x-auto max-w-[200px] md:max-w-none">
                    {pages}
                </div>
                <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`px-2 py-1 md:px-4 md:py-2 rounded text-sm md:text-base ${
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

    const isCreator = test?.creatorId === user.id;

    const handleCreateQuestion = () => {
        navigate(`/teacher-dashboard/test/${testId}/questions/create`);
    };

    const handleEditQuestion = (questionId) => {
        navigate(`/teacher-dashboard/test/${testId}/questions/${questionId}/edit`);
    };

    const getQuestionTypeLabel = (type) => {
        return t(`questionTypes.${type}`) || t('questionTypes.MULTIPLE_CHOICE');
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
                <p className="text-lg">{t('questionsPage.loading')}</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 p-4">
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                    {t('questionsPage.error')}{error}
                </div>
            </div>
        );
    }

    return (
        <div className="p-4 md:p-6">
            <div className="max-w-6xl mx-auto">
                <div className="mb-4 md:mb-6">
                    <Link
                        to="/teacher-dashboard"
                        className="text-blue-600 hover:text-blue-800 flex items-center text-sm md:text-base"
                    >
                        <ArrowLeft className="w-4 h-4 md:w-5 md:h-5" />
                        <span className="ml-1">{t('questionsPage.backToDashboard')}</span>
                    </Link>
                </div>

                <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 md:mb-8 gap-4">
                    <div>
                        <h1 className="text-2xl md:text-4xl font-bold text-blue-600">{t('questionsPage.title')}</h1>
                        {!isCreator && (
                            <p className="text-gray-600 mt-2 text-sm md:text-base">
                                {t('questionsPage.viewingQuestionsBy')} {test?.name}
                            </p>
                        )}
                    </div>
                    {isCreator && (
                        <button
                            onClick={handleCreateQuestion}
                            className="bg-green-600 text-white px-4 py-2 md:px-6 md:py-2 rounded-lg hover:bg-green-700
                                     transition-colors text-sm md:text-base w-full md:w-auto"
                        >
                            {t('questionsPage.addNewQuestion')}
                        </button>
                    )}
                </div>

                <div className="grid gap-4 md:gap-6">
                    {questions.length === 0 ? (
                        <div className="bg-white rounded-lg shadow p-4 md:p-6 text-center">
                            <p className="text-gray-600 text-sm md:text-base">
                                {isCreator
                                    ? t('questionsPage.noQuestionsCreator')
                                    : t('questionsPage.noQuestionsViewer')}
                            </p>
                        </div>
                    ) : (
                        currentQuestions.map(question => (
                            <div
                                key={question.id}
                                className="bg-white rounded-lg shadow p-4 md:p-6"
                            >
                                <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
                                    <div className="flex-grow">
                                        <div className="flex flex-col md:flex-row md:items-center gap-2 mb-2">
                                            <h2 className="text-lg md:text-xl font-semibold">{question.description}</h2>
                                            <span className="bg-blue-100 text-blue-800 text-xs md:text-sm px-2 py-1 rounded inline-block">
                                                {getQuestionTypeLabel(question.type)}
                                            </span>
                                        </div>
                                        <div className="text-xs md:text-sm text-gray-500">
                                            <span>{t('questionsPage.questionDetails.points')}{question.points}</span>
                                            {question.negativePointsPerAnswer > 0 && (
                                                <span className="ml-4">
                                                    {t('questionsPage.questionDetails.negativePoints')}
                                                    {question.negativePointsPerAnswer}
                                                </span>
                                            )}
                                        </div>
                                        {question.hint && (
                                            <div className="mt-2 text-xs md:text-sm text-gray-600">
                                                <strong>{t('questionsPage.questionDetails.hint')}</strong>{question.hint}
                                            </div>
                                        )}
                                        <div className="mt-4">
                                            <h3 className="font-medium mb-2 text-sm md:text-base">
                                                {t('questionsPage.questionDetails.answers')}
                                            </h3>
                                            <ul className="space-y-2">
                                                {question.answers?.map((answer, index) => (
                                                    <li
                                                        key={index}
                                                        className={`flex items-center text-sm md:text-base ${
                                                            answer.correct
                                                                ? 'bg-green-50 text-green-700 border border-green-200'
                                                                : 'bg-gray-50 text-gray-600 border border-gray-200'
                                                        } rounded-md px-3 py-2`}
                                                    >
                                                        {answer.correct ? (
                                                            <Check className="w-4 h-4 mr-2 text-green-500 flex-shrink-0" />
                                                        ) : (
                                                            <X className="w-4 h-4 mr-2 text-gray-400 flex-shrink-0" />
                                                        )}
                                                        <span className="break-words">{answer.answerText}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                    {isCreator && (
                                        <div className="flex md:flex-col gap-2 mt-4 md:mt-0 md:ml-4">
                                            <button
                                                onClick={() => handleEditQuestion(question.id)}
                                                className="flex-1 md:flex-none bg-yellow-600 text-white px-3 py-2 md:px-4
                                                         rounded hover:bg-yellow-700 transition-colors text-sm md:text-base"
                                            >
                                                {t('questionsPage.questionDetails.actions.edit')}
                                            </button>
                                            <button
                                                onClick={() => handleDeleteClick(question)}
                                                className="flex-1 md:flex-none bg-red-600 text-white px-3 py-2 md:px-4
                                                         rounded hover:bg-red-700 transition-colors text-sm md:text-base"
                                            >
                                                {t('questionsPage.questionDetails.actions.delete')}
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {questions.length > itemsPerPage && renderPagination()}

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

export default TestQuestionsPage;