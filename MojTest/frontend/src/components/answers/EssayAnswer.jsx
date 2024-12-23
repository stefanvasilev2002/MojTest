import React from 'react';

const EssayAnswer = ({ question, questionId, correctAnswer, onAnswerChange }) => {
    return (
        <textarea
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent min-h-[200px]"
            value={correctAnswer || ''}
            onChange={(e) => onAnswerChange(questionId, e.target.value)}
            placeholder="Write your answer here..."
        />
    );
};

export default EssayAnswer;