import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import CreateQuestionPage from './CreateQuestionsPage.jsx';
import AddExistingQuestionPage from './AddExistingQuestionPage.jsx';

const QuestionManagerPage = () => {
    const { testId } = useParams();
    const [activeTab, setActiveTab] = useState('create'); // Default to Create New Question
    const [selectedQuestion, setSelectedQuestion] = useState(null);

    const handleSelectExistingQuestion = (question) => {
        console.log('Selected question:', JSON.stringify(question, null, 2));  // Log when a question is selected in JSON format
        setSelectedQuestion(question);
        setActiveTab('create'); // Switch to "Create" tab when an existing question is selected
    };


    return (
        <div className="p-6">
            <div className="max-w-4xl mx-auto">
                <div className="mb-6">
                    <Link
                        to={`/teacher-dashboard/test/${testId}/questions`}
                        className="text-blue-600 hover:text-blue-800 flex items-center"
                    >
                        ← Back to Questions
                    </Link>
                </div>

                <h1 className="text-3xl font-bold text-blue-600 mb-8">Manage Questions</h1>

                {/* Tabs */}
                <div className="flex border-b mb-6">
                    <button
                        className={`p-4 w-1/2 text-center ${
                            activeTab === 'create' ? 'border-b-2 border-blue-600 font-bold' : ''
                        }`}
                        onClick={() => setActiveTab('create')}
                    >
                        Create New Question
                    </button>
                    <button
                        className={`p-4 w-1/2 text-center ${
                            activeTab === 'existing' ? 'border-b-2 border-blue-600 font-bold' : ''
                        }`}
                        onClick={() => setActiveTab('existing')}
                    >
                        Add Existing Question
                    </button>
                </div>

                {/* Tab Content */}
                <div>
                    {activeTab === 'create' ? (
                        <CreateQuestionPage
                            selectedQuestion={selectedQuestion} // Pass selected question data to CreateQuestionPage
                        />
                    ) : (
                        <AddExistingQuestionPage
                            onSelectQuestion={handleSelectExistingQuestion} // Pass handler to add question to the test
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

export default QuestionManagerPage;
