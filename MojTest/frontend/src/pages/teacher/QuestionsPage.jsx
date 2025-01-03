import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTranslation } from 'react-i18next';
import testQuestionService from '../../services/testQuestionService';
import DeleteQuestionModal from "../../components/teacher/DeleteQuestionModal.jsx";

const QuestionsPage = () => {
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
        fetchTestAndQuestions().then(r => console.log('Questions fetched'));
    }, [testId]);

    // Get current questions
    const indexOfLastQuestion = currentPage * itemsPerPage;
    const indexOfFirstQuestion = indexOfLastQuestion - itemsPerPage;
    const currentQuestions = questions.slice(indexOfFirstQuestion, indexOfLastQuestion);

    // Calculate total pages
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
                await testQuestionService.deleteQuestion(questionToDelete.id);
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
    };

    const fetchTestAndQuestions = async () => {
        try {
            setLoading(true);
            const testData = await fetch(`http://localhost:8080/api/tests/${testId}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${user.token}`,
                    'Content-Type': 'application/json'
                },
            });
            setTest(await testData.json());

            const questionsData = await testQuestionService.getQuestionsByTestId(testId);
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

    const isCreator = test?.creatorId === user.id;

    const handleCreateQuestion = () => {
        navigate(`/teacher-dashboard/test/${testId}/questions/create`);
    };

    const handleEditQuestion = (questionId) => {
        navigate(`/teacher-dashboard/test/${testId}/questions/${questionId}/edit`);
    };

    const handleDeleteQuestion = async (questionId) => {
        if (window.confirm(t('questionsPage.questionDetails.actions.deleteConfirm'))) {
            try {
                await testQuestionService.deleteQuestion(questionId);
                fetchTestAndQuestions();
            } catch (error) {
                setError(error.message);
                console.error('Error deleting question:', error);
            }
        }
    };

    const getQuestionTypeLabel = (type) => {
        return t(`questionTypes.${type}`) || t('questionTypes.MULTIPLE_CHOICE');
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
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
        <div className="p-6">
            <div className="max-w-6xl mx-auto">
                <div className="mb-6">
                    <Link
                        to="/teacher-dashboard"
                        className="text-blue-600 hover:text-blue-800 flex items-center"
                    >
                        {t('questionsPage.backToDashboard')}
                    </Link>
                </div>

                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-4xl font-bold text-blue-600">{t('questionsPage.title')}</h1>
                        {!isCreator && (
                            <p className="text-gray-600 mt-2">
                                {t('questionsPage.viewingQuestionsBy')} {test?.name}
                            </p>
                        )}
                    </div>
                    {isCreator && (
                        <button
                            onClick={handleCreateQuestion}
                            className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
                        >
                            {t('questionsPage.addNewQuestion')}
                        </button>
                    )}
                </div>

                <div className="grid gap-6">
                    {questions.length === 0 ? (
                        <div className="bg-white rounded-lg shadow p-6 text-center">
                            <p className="text-gray-600">
                                {isCreator
                                    ? t('questionsPage.noQuestionsCreator')
                                    : t('questionsPage.noQuestionsViewer')}
                            </p>
                        </div>
                    ) : (
                        currentQuestions.map(question => (
                            <div
                                key={question.id}
                                className="bg-white rounded-lg shadow p-6"
                            >
                                <div className="flex justify-between items-start">
                                    <div className="flex-grow">
                                        <div className="flex items-center gap-2 mb-2">
                                            <h2 className="text-xl font-semibold">{question.description}</h2>
                                            <span className="bg-blue-100 text-blue-800 text-sm px-2 py-1 rounded">
                                                {getQuestionTypeLabel(question.type)}
                                            </span>
                                        </div>
                                        <div className="text-sm text-gray-500">
                                            <span>{t('questionsPage.questionDetails.points')}{question.points}</span>
                                            {question.negativePointsPerAnswer > 0 && (
                                                <span className="ml-4">
                                                    {t('questionsPage.questionDetails.negativePoints')}
                                                    {question.negativePointsPerAnswer}
                                                </span>
                                            )}
                                        </div>
                                        {question.hint && (
                                            <div className="mt-2 text-sm text-gray-600">
                                                <strong>{t('questionsPage.questionDetails.hint')}</strong>{question.hint}
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

                                            <DeleteQuestionModal
                                                isOpen={deleteModalOpen}
                                                onClose={() => setDeleteModalOpen(false)}
                                                onConfirm={handleDeleteConfirm}
                                                questionText={questionToDelete?.description}
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {questions.length > itemsPerPage && renderPagination()}
            </div>
        </div>
    );
};

export default QuestionsPage;