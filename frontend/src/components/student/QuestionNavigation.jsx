import React from 'react';

const QuestionNavigation = ({
                                questions,
                                currentQuestion,
                                onQuestionChange,
                                answers,
                            }) => {
    const getQuestionStatus = (questionId) => {
        const answer = answers[questionId];
        if (!answer) return 'unanswered';
        if (Array.isArray(answer) && answer.length === 0) return 'unanswered';
        return 'answered';
    };

    return (
        <div className="bg-white rounded-lg shadow p-4 w-64">
            <h2 className="text-lg font-semibold mb-4">Questions</h2>
            <div className="space-y-2">
                {questions.map((question, index) => {
                    const status = getQuestionStatus(question.questionId);

                    return (
                        <button
                            key={question.questionId}
                            onClick={() => onQuestionChange(index)}
                            className={`w-full p-3 rounded-lg text-left transition-colors ${
                                currentQuestion === index
                                    ? 'bg-blue-600 text-white'
                                    : status === 'answered'
                                        ? 'bg-green-100 hover:bg-green-200'
                                        : 'bg-gray-100 hover:bg-gray-200'
                            }`}
                        >
                            <div className="flex items-center justify-between">
                                <span>Question {index + 1}</span>
                                {status === 'answered' && currentQuestion !== index && (
                                    <svg
                                        className="w-5 h-5 text-green-600"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M5 13l4 4L19 7"
                                        />
                                    </svg>
                                )}
                            </div>
                            <div className="text-sm mt-1 truncate">
                                {question.points} points
                            </div>
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

export default QuestionNavigation;