import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useTest from '../../hooks/crud/useTest.js';
import { useAuth } from '../../context/AuthContext.jsx';
import { useTranslation } from 'react-i18next';

const TeacherDashboard = () => {
    const { items: tests, loading: testsLoading, error: testsError, deleteItem: deleteTest } = useTest();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('myTests');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 4;
    const { t } = useTranslation("common");

    const myTests = tests.filter(test => test.creatorId === user.id);
    const allTests = tests;

    // Get current tests based on pagination
    const getCurrentTests = () => {
        const currentTests = activeTab === 'myTests' ? myTests : allTests;
        const indexOfLastItem = currentPage * itemsPerPage;
        const indexOfFirstItem = indexOfLastItem - itemsPerPage;
        return currentTests.slice(indexOfFirstItem, indexOfLastItem);
    };

    // Calculate total pages
    const totalPages = Math.ceil(
        (activeTab === 'myTests' ? myTests.length : allTests.length) / itemsPerPage
    );

    // Handle page changes
    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    // Reset to first page when switching tabs
    const handleTabChange = (tab) => {
        setActiveTab(tab);
        setCurrentPage(1);
    };

    const handleCreateTest = () => {
        navigate('/teacher-dashboard/create-test', {
            state: { userId: user.id }
        });
    };

    const handleCreateNewQuestion = () => {
        navigate('/teacher-dashboard/create-question', {
            state: { userId: user.id }
        });
    };

    const handleEditTest = (testId) => {
        navigate(`/teacher-dashboard/edit-test/${testId}`);
    };

    const handleDeleteTest = async (testId) => {
        if (window.confirm(t('dashboard.testDetails.actions.deleteConfirm'))) {
            try {
                await deleteTest(testId);
            } catch (error) {
                console.error('Error deleting test:', error);
                alert('Failed to delete test: ' + error.message);
            }
        }
    };

    const handleQuestionsClick = (testId) => {
        navigate(`/teacher-dashboard/test/${testId}/questions`);
    };

    const handleCreateQuestion = (testId) => {
        navigate(`/teacher-dashboard/test/${testId}/questions/create`);
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

    const renderTest = (test, isOwner) => (
        <div
            key={test.id}
            className="bg-white rounded-lg shadow p-6"
        >
            <div className="flex justify-between items-start">
                <div className="flex-grow">
                    <div className="flex items-center gap-2">
                        <h2 className="text-xl font-semibold">{test.title}</h2>
                        {!isOwner && (
                            <span className="text-sm bg-gray-100 text-gray-600 px-2 py-1 rounded">
                                {t('dashboard.testDetails.createdBy')} {test.name}
                            </span>
                        )}
                    </div>
                    <p className="text-gray-600 mb-4">{test.description}</p>
                    <div className="space-y-2">
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                            <span className="flex items-center">
                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                </svg>
                                {test.numQuestions} {t('dashboard.testDetails.questions')}
                            </span>
                            {test.timeLimit && (
                                <span className="flex items-center">
                                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    {t('dashboard.testDetails.timeLimit')} {test.timeLimit} {t('dashboard.testDetails.minutes')}
                                </span>
                            )}
                        </div>
                        {test.metadata && test.metadata.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                                {test.metadata.map((meta, index) => (
                                    <span
                                        key={index}
                                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                                    >
                                        {meta.key}: {meta.value}
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
                <div className="flex flex-col gap-2">
                    <div className="flex gap-2">
                        <button
                            onClick={() => handleQuestionsClick(test.id)}
                            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors flex items-center"
                        >
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {t('dashboard.testDetails.actions.viewQuestions')}
                        </button>
                        {isOwner && (
                            <button
                                onClick={() => handleCreateQuestion(test.id)}
                                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors flex items-center"
                            >
                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                                </svg>
                                {t('dashboard.testDetails.actions.addQuestion')}
                            </button>
                        )}
                    </div>
                    {isOwner && (
                        <div className="flex gap-2">
                            <button
                                onClick={() => handleEditTest(test.id)}
                                className="bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700 transition-colors flex items-center"
                            >
                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                                {t('dashboard.testDetails.actions.editTest')}
                            </button>
                            <button
                                onClick={() => handleDeleteTest(test.id)}
                                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors flex items-center"
                            >
                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                                {t('dashboard.testDetails.actions.delete')}
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );

    if (testsLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <p className="text-lg">{t('dashboard.loading')}</p>
            </div>
        );
    }

    if (testsError) {
        return (
            <div className="min-h-screen bg-gray-50 p-4">
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                    {t('dashboard.error')} {testsError}
                </div>
            </div>
        );
    }

    return (
        <div className="p-6">
            <div className="max-w-6xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => handleTabChange('myTests')}
                            className={`text-lg font-semibold px-4 py-2 rounded-lg transition-colors ${
                                activeTab === 'myTests'
                                    ? 'bg-blue-600 text-white'
                                    : 'text-blue-600 hover:bg-blue-50'
                            }`}
                        >
                            {t('dashboard.myTests')}
                        </button>
                        <button
                            onClick={() => handleTabChange('allTests')}
                            className={`text-lg font-semibold px-4 py-2 rounded-lg transition-colors ${
                                activeTab === 'allTests'
                                    ? 'bg-blue-600 text-white'
                                    : 'text-blue-600 hover:bg-blue-50'
                            }`}
                        >
                            {t('dashboard.allTests')}
                        </button>
                    </div>
                    <div className="flex items-center gap-4">
                        <button
                            onClick={handleCreateTest}
                            className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
                        >
                            {t('dashboard.createNewTest')}
                        </button>
                        <button
                            onClick={handleCreateNewQuestion}
                            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            {t('dashboard.createNewQuestion')}
                        </button>
                    </div>
                </div>

                <div className="grid gap-6">
                    {getCurrentTests().length === 0 ? (
                        <div className="bg-white rounded-lg shadow p-6 text-center">
                            <p className="text-gray-600">
                                {activeTab === 'myTests'
                                    ? t('dashboard.noMyTestsAvailable')
                                    : t('dashboard.noTestsAvailable')}
                            </p>
                        </div>
                    ) : (
                        getCurrentTests().map(test =>
                            renderTest(test, test.creatorId === user.id)
                        )
                    )}
                </div>

                {(activeTab === 'myTests' ? myTests : allTests).length > itemsPerPage && renderPagination()}
            </div>
        </div>
    );
};

export default TeacherDashboard;