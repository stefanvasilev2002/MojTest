import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import CreateQuestionPage from './CreateQuestionsPage.jsx';
import AddExistingQuestionPage from './AddExistingQuestionPage.jsx';
import {ArrowLeft} from "lucide-react";

const QuestionManagerPage = () => {
    const { t } = useTranslation("common");
    const { testId } = useParams();
    const [activeTab, setActiveTab] = useState('create');
    const [selectedQuestion, setSelectedQuestion] = useState(null);
    const [mode, setMode] = useState('create');

    const handleSelectExistingQuestion = (question) => {
        setSelectedQuestion(question);
        setMode('copy');
        setActiveTab('create');
    };

    return (
        <div className="p-6">
            <div className="max-w-4xl mx-auto">
                <div className="mb-6">
                    <Link
                        to={`/teacher-dashboard/test/${testId}/questions`}
                        className="text-blue-600 hover:text-blue-800 flex items-center"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        {t('questionManager.backToQuestions')}
                    </Link>
                </div>

                <h1 className="text-3xl font-bold text-blue-600 mb-8">
                    {t('questionManager.pageTitle')}
                </h1>

                {/* Tabs */}
                <div className="flex border-b mb-6">
                    <button
                        className={`p-4 w-1/2 text-center ${
                            activeTab === 'create' ? 'border-b-2 border-blue-600 font-bold' : ''
                        }`}
                        onClick={() => setActiveTab('create')}
                    >
                        {t('questionManager.tabs.createNew')}
                    </button>
                    <button
                        className={`p-4 w-1/2 text-center ${
                            activeTab === 'existing' ? 'border-b-2 border-blue-600 font-bold' : ''
                        }`}
                        onClick={() => setActiveTab('existing')}
                    >
                        {t('questionManager.tabs.addExisting')}
                    </button>
                </div>

                {/* Tab Content */}
                <div>
                    {activeTab === 'create' ? (
                        <CreateQuestionPage
                            selectedQuestion={selectedQuestion}
                            mode={mode}
                        />
                    ) : (
                        <AddExistingQuestionPage
                            onSelectQuestion={handleSelectExistingQuestion}
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

export default QuestionManagerPage;