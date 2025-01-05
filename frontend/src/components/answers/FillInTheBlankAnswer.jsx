import React from 'react';

const FillInTheBlankAnswer = ({ question, questionId, answer, onAnswerChange }) => {
    return (
        <div className="mt-2">
            <input
                type="text"
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={answer || ''}
                onChange={(e) => onAnswerChange(questionId, e.target.value)}
                placeholder="Enter your answer..."
            />
        </div>
    );
};

export default FillInTheBlankAnswer;