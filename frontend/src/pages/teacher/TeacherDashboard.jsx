import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import useTest from '../../hooks/crud/useTest.js';
import { useAuth } from '../../context/AuthContext.jsx';
import { useTranslation } from 'react-i18next';
import { getTranslatedMetadata } from "../../config/translatedMetadata.js";
import DeleteTestModal from "../../components/teacher/DeleteTestModal.jsx";
import TestFilters from '../../components/TestFilters.jsx';
import { ChevronDown, Edit, Plus, Trash2, HelpCircle } from 'lucide-react';
import TestExport from "./TestExport.jsx";

const TeacherDashboard = () => {
    const { items: tests, loading: testsLoading, error: testsError, deleteItem: deleteTest } = useTest();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('myTests');
    const [currentPage, setCurrentPage] = useState(1);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [testToDelete, setTestToDelete] = useState(null);
    const [expandedTest, setExpandedTest] = useState(null);
    const [filters, setFilters] = useState({
        'Subject': '',
        'Difficulty': '',
        'Part of Year': '',
        'Test Type': ''
    });
    const itemsPerPage = 4;
    const { t, i18n } = useTranslation("common");

    const handleFilterChange = (key, value) => {
        setFilters(prev => ({
            ...prev,
            [key]: value
        }));
        setCurrentPage(1); // Reset to first page when filters change
    };

    const filteredTests = useMemo(() => {
        const initialTests = activeTab === 'myTests'
            ? tests.filter(test => test.creatorId === user.id)
            : tests;

        return initialTests.filter(test => {
            return Object.entries(filters).every(([key, value]) => {
                if (!value) return true;
                return test.metadata?.some(meta =>
                    meta.key === key && meta.value === value
                );
            });
        });
    }, [tests, filters, activeTab, user.id]);

    const handleDeleteClick = (test) => {
        setTestToDelete(test);
        setDeleteModalOpen(true);
    };

    const handleDeleteConfirm = async () => {
        if (testToDelete) {
            try {
                await deleteTest(testToDelete.id);
                setDeleteModalOpen(false);
                setTestToDelete(null);
            } catch (error) {
                console.error('Error deleting test:', error);
            }
        }
    };

    // Get current tests based on pagination
    const getCurrentTests = () => {
        const indexOfLastItem = currentPage * itemsPerPage;
        const indexOfFirstItem = indexOfLastItem - itemsPerPage;
        return filteredTests.slice(indexOfFirstItem, indexOfLastItem);
    };

    // Calculate total pages
    const totalPages = Math.ceil(filteredTests.length / itemsPerPage);

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

    const handleQuestionsPage = () => {
        navigate('/teacher-dashboard/questions');
    };

    const handleEditTest = (testId) => {
        navigate(`/teacher-dashboard/edit-test/${testId}`);
    };

    const handleQuestionsClick = (testId) => {
        navigate(`/teacher-dashboard/test/${testId}/questions`);
    };

    const handleCreateQuestion = (testId) => {
        navigate(`/teacher-dashboard/test/${testId}/questions/create`);
    };

    const TestActions = ({ test, isOwner }) => (
        <div className="flex flex-col sm:flex-row gap-2 mt-4 sm:mt-0">
            <button
                onClick={() => handleQuestionsClick(test.id)}
                className="w-full sm:w-auto bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors flex items-center justify-center"
            >
                <HelpCircle className="w-4 h-4 mr-2" />
                <span className="whitespace-nowrap">{t('dashboard.testDetails.actions.viewQuestions')}</span>
            </button>
            {isOwner && (
                <>
                    <button
                        onClick={() => handleCreateQuestion(test.id)}
                        className="w-full sm:w-auto bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors flex items-center justify-center"
                    >
                        <Plus className="w-4 h-4 mr-2" />
                        <span className="whitespace-nowrap">{t('dashboard.testDetails.actions.addQuestion')}</span>
                    </button>
                    <button
                        onClick={() => handleEditTest(test.id)}
                        className="w-full sm:w-auto bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700 transition-colors flex items-center justify-center"
                    >
                        <Edit className="w-4 h-4 mr-2" />
                        <span className="whitespace-nowrap">{t('dashboard.testDetails.actions.editTest')}</span>
                    </button>
                    <TestExport
                        testId={test.id}
                        testTitle={test.title}
                        className="w-full sm:w-auto"
                    />
                    <button
                        onClick={() => handleDeleteClick(test)}
                        className="w-full sm:w-auto bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors flex items-center justify-center"
                    >
                        <Trash2 className="w-4 h-4 mr-2" />
                        <span className="whitespace-nowrap">{t('dashboard.testDetails.actions.delete')}</span>
                    </button>
                </>
            )}
        </div>
    );

    const renderTest = (test, isOwner) => (
        <div key={test.id} className="bg-white rounded-lg shadow p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row justify-between">
                <div className="flex-grow mb-2">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
                        <h2 className="text-xl font-semibold">{test.title}</h2>
                        {!isOwner && (
                            <span className="text-sm bg-gray-100 text-gray-600 px-2 py-1 rounded inline-block">
                                {t('dashboard.testDetails.createdBy')} {test.name}
                            </span>
                        )}
                    </div>

                    <div className="space-y-2">
                        <p className="text-gray-600">{test.description}</p>

                        <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                            <span className="flex items-center">
                                <HelpCircle className="w-4 h-4 mr-1" />
                                {test.numQuestions} {t('dashboard.testDetails.questions')}
                            </span>
                            {test.timeLimit && (
                                <span className="flex items-center">
                                    <ChevronDown className="w-4 h-4 mr-1" />
                                    {test.timeLimit} {t('dashboard.testDetails.minutes')}
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
                                        {t(`metadata.${meta.key}`)}: {getTranslatedMetadata(meta.key, meta.value, i18n.language)}
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                <button
                    onClick={() => setExpandedTest(expandedTest === test.id ? null : test.id)}
                    className="mt-4 sm:hidden text-blue-600 flex items-center justify-center"
                >
                    <ChevronDown className={`w-6 h-6 transform transition-transform ${expandedTest === test.id ? 'rotate-180' : ''}`} />
                </button>
            </div>

            <div className={`sm:block ${expandedTest === test.id ? 'block' : 'hidden'}`}>
                <TestActions test={test} isOwner={isOwner} />
            </div>
        </div>
    );

    return (
        <div className="p-4 sm:p-6">
            <div className="max-w-6xl mx-auto">
                {/* Header Section */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                    {/* Tab Buttons */}
                    <div className="flex flex-wrap gap-2">
                        <button
                            onClick={() => handleTabChange('myTests')}
                            className={`text-base sm:text-lg font-semibold px-4 py-2 rounded-lg transition-colors ${
                                activeTab === 'myTests'
                                    ? 'bg-blue-600 text-white'
                                    : 'text-blue-600 hover:bg-blue-50'
                            }`}
                        >
                            {t('dashboard.myTests')}
                        </button>
                        <button
                            onClick={() => handleTabChange('allTests')}
                            className={`text-base sm:text-lg font-semibold px-4 py-2 rounded-lg transition-colors ${
                                activeTab === 'allTests'
                                    ? 'bg-blue-600 text-white'
                                    : 'text-blue-600 hover:bg-blue-50'
                            }`}
                        >
                            {t('dashboard.allTests')}
                        </button>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-wrap gap-2 w-full sm:w-auto">
                        <button
                            onClick={handleCreateTest}
                            className="flex-1 sm:flex-none bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center"
                        >
                            <Plus className="w-4 h-4 mr-2" />
                            {t('dashboard.createNewTest')}
                        </button>
                        <button
                            onClick={handleQuestionsPage}
                            className="flex-1 sm:flex-none bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
                        >
                            <HelpCircle className="w-4 h-4 mr-2" />
                            {t('dashboard.questions')}
                        </button>
                    </div>
                </div>

                {/* Filters Section */}
                <TestFilters
                    filters={filters}
                    onFilterChange={handleFilterChange}
                />

                {/* Tests Grid */}
                <div className="grid gap-4 sm:gap-6 mt-6">
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

                {/* Pagination */}
                {filteredTests.length > itemsPerPage && (
                    <div className="flex justify-center items-center mt-6 space-x-2 overflow-x-auto p-2">
                        <button
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                            className="px-3 py-1 rounded disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed bg-white text-blue-600 hover:bg-blue-50"
                        >
                            {t('pagination.previous')}
                        </button>
                        {Array.from({ length: totalPages }, (_, i) => (
                            <button
                                key={i + 1}
                                onClick={() => handlePageChange(i + 1)}
                                className={`px-3 py-1 rounded ${
                                    currentPage === i + 1
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-white text-blue-600 hover:bg-blue-50'
                                }`}
                            >
                                {i + 1}
                            </button>
                        ))}
                        <button
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className="px-3 py-1 rounded disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed bg-white text-blue-600 hover:bg-blue-50"
                        >
                            {t('pagination.next')}
                        </button>
                    </div>
                )}

                <DeleteTestModal
                    isOpen={deleteModalOpen}
                    onClose={() => setDeleteModalOpen(false)}
                    onConfirm={handleDeleteConfirm}
                    testTitle={testToDelete?.title}
                />
            </div>
        </div>
    );
};

export default TeacherDashboard;