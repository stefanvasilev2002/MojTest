import React from 'react';

const QuestionList = ({ questions, onEdit, onRemove, onDelete, onAddToTest }) => {
    // Function to get formatted question type label
    const getQuestionTypeLabel = (type) => {
        return type?.split('_')
            .map(word => word.charAt(0).toUpperCase() + word.toLowerCase().slice(1))
            .join(' ') || 'Multiple Choice';
    };

    return (
        <div className="mb-12">
            <h2 className="text-2xl font-semibold mb-4">Questions in This Test</h2>
            <div className="grid gap-4">
                {questions.length === 0 ? (
                    <div className="bg-white rounded-lg shadow p-6 text-center">
                        <p className="text-gray-600">No questions added to this test yet.</p>
                    </div>
                ) : (
                    questions.map(question => (
                        <div key={question.id} className="bg-white rounded-lg shadow p-6">
                            <div className="flex justify-between items-start">
                                <div>
                                    <div className="flex items-center gap-2 mb-2">
                                        <h3 className="text-xl font-semibold">{question.description}</h3>
                                        <span className="bg-blue-100 text-blue-800 text-sm px-2 py-1 rounded">
                                            {getQuestionTypeLabel(question.type)} {/* Format question type */}
                                        </span>
                                    </div>

                                    <div className="text-sm text-gray-500">
                                        <span>Points: {question.points}</span>
                                        {question.negativePointsPerAnswer > 0 && (
                                            <span className="ml-4">
                                                Negative points: {question.negativePointsPerAnswer}
                                            </span>
                                        )}
                                    </div>

                                    {/* Show hint if available */}
                                    {question.hint && (
                                        <div className="mt-2 text-sm text-gray-600">
                                            <strong>Hint:</strong> {question.hint}
                                        </div>
                                    )}

                                    <div className="mt-4">
                                        <h3 className="font-medium mb-2">Answers:</h3>
                                        <ul className="list-disc list-inside space-y-1">
                                            {question.answers?.map((answer, index) => (
                                                <li
                                                    key={index}
                                                    className={`${answer.correct ? 'text-green-600' : 'text-gray-600'}`}
                                                >
                                                    {answer.answerText}
                                                    {answer.correct && ' ✓'}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>

                                <div className="flex gap-2">
                                    {/* Conditionally Render Action Buttons */}
                                    {onAddToTest && (
                                        <button
                                            onClick={() => onAddToTest(question)} // Pass the whole question object
                                            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
                                        >
                                            Add to Test
                                        </button>
                                    )}

                                    {onEdit && (
                                        <button
                                            onClick={() => onEdit(question.id)}
                                            className="bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700 transition-colors"
                                        >
                                            Edit
                                        </button>
                                    )}

                                    {onRemove && (
                                        <button
                                            onClick={() => onRemove(question.id)}
                                            className="bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-700 transition-colors"
                                        >
                                            Remove
                                        </button>
                                    )}

                                    {onDelete && (
                                        <button
                                            onClick={() => onDelete(question.id)}
                                            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors"
                                        >
                                            Delete
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default QuestionList;
