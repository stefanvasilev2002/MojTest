import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useTest from '../../hooks/crud/useTest.js';
import { useAuth } from '../../context/AuthContext.jsx';

const TeacherDashboard = () => {
    const { items: tests, loading: testsLoading, error: testsError, deleteItem: deleteTest } = useTest();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('myTests');

    const myTests = tests.filter(test => test.creatorId === user.id);
    const allTests = tests;

    console.log('user:', user);
    const handleCreateTest = () => {
        navigate('/teacher-dashboard/create-test', {
            state: { userId: user.id }
        });
    };

    const handleEditTest = (testId) => {
        navigate(`/teacher-dashboard/edit-test/${testId}`);
    };

    const handleDeleteTest = async (testId) => {
        if (window.confirm('Are you sure you want to delete this test? This will also delete all associated questions.')) {
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

    if (testsLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <p className="text-lg">Loading...</p>
            </div>
        );
    }

    if (testsError) {
        return (
            <div className="min-h-screen bg-gray-50 p-4">
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                    Error: {testsError}
                </div>
            </div>
        );
    }

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
                                Created by: Teacher {test.name}
                            </span>
                        )}
                    </div>
                    <p className="text-gray-600 mb-4">{test.description}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span className="flex items-center">
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                            </svg>
                            {test.numQuestions} questions
                        </span>
                        {test.timeLimit && (
                            <span className="flex items-center">
                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                Time limit: {test.timeLimit} minutes
                            </span>
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
                            View Questions
                        </button>
                        {isOwner && (
                            <button
                                onClick={() => handleCreateQuestion(test.id)}
                                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors flex items-center"
                            >
                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                                </svg>
                                Add Question
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
                                Edit Test
                            </button>
                            <button
                                onClick={() => handleDeleteTest(test.id)}
                                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors flex items-center"
                            >
                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                                Delete
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );

    return (
        <div className="p-6">
            <div className="max-w-6xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setActiveTab('myTests')}
                            className={`text-lg font-semibold px-4 py-2 rounded-lg transition-colors ${
                                activeTab === 'myTests'
                                    ? 'bg-blue-600 text-white'
                                    : 'text-blue-600 hover:bg-blue-50'
                            }`}
                        >
                            My Tests
                        </button>
                        <button
                            onClick={() => setActiveTab('allTests')}
                            className={`text-lg font-semibold px-4 py-2 rounded-lg transition-colors ${
                                activeTab === 'allTests'
                                    ? 'bg-blue-600 text-white'
                                    : 'text-blue-600 hover:bg-blue-50'
                            }`}
                        >
                            All Tests
                        </button>
                    </div>
                    <button
                        onClick={handleCreateTest}
                        className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
                    >
                        Create New Test
                    </button>
                </div>

                <div className="grid gap-6">
                    {activeTab === 'myTests' ? (
                        myTests.length === 0 ? (
                            <div className="bg-white rounded-lg shadow p-6 text-center">
                                <p className="text-gray-600">No tests available. Create your first test!</p>
                            </div>
                        ) : (
                            myTests.map(test => renderTest(test, true))
                        )
                    ) : (
                        allTests.length === 0 ? (
                            <div className="bg-white rounded-lg shadow p-6 text-center">
                                <p className="text-gray-600">No tests available.</p>
                            </div>
                        ) : (
                            allTests.map(test => renderTest(test, test.creatorId === user.id))
                        )
                    )}
                </div>
            </div>
        </div>
    );
};

export default TeacherDashboard;