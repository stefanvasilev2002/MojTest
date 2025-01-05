import React from 'react';

const SubmitConfirmationModal = ({ isOpen, onClose, onConfirm, questions, answers }) => {
    if (!isOpen) return null;

    const unansweredQuestions = questions.filter(question =>
        !answers[question.questionId] ||
        (Array.isArray(answers[question.questionId]) && answers[question.questionId].length === 0)
    );

    const hasUnansweredQuestions = unansweredQuestions.length > 0;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full m-4">
                {hasUnansweredQuestions ? (
                    <>
                        <h2 className="text-xl font-bold text-red-600 mb-4">
                            Warning: Unanswered Questions
                        </h2>
                        <p className="mb-4">
                            You have {unansweredQuestions.length} unanswered questions:
                        </p>
                        <div className="max-h-48 overflow-y-auto mb-4 border rounded-lg p-4">
                            <ul className="list-disc pl-5 space-y-2">
                                {unansweredQuestions.map((question, index) => (
                                    <li key={question.questionId} className="text-gray-600">
                                        Question {index + 1}: {question.description}
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="flex justify-end gap-4">
                            <button
                                onClick={onClose}
                                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                            >
                                Return to Test
                            </button>
                            <button
                                onClick={onConfirm}
                                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                            >
                                Submit Anyway
                            </button>
                        </div>
                    </>
                ) : (
                    <>
                        <h2 className="text-xl font-bold text-gray-800 mb-4">
                            Submit Test
                        </h2>
                        <p className="text-gray-600 mb-6">
                            Are you sure you want to submit your test? This action cannot be undone.
                        </p>
                        <div className="flex justify-end gap-4">
                            <button
                                onClick={onClose}
                                className="px-4 py-2 text-gray-600 hover:text-gray-800"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={onConfirm}
                                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                            >
                                Submit Test
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default SubmitConfirmationModal;