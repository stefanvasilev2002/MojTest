import React from 'react';

const MultipleChoiceAnswer = ({ question, questionId, selectedAnswers, onAnswerChange }) => {
    return (
        question.possibleAnswers.map(answer => (
            <label
                key={answer.id}
                className="block text-gray-700 hover:bg-gray-100 cursor-pointer p-2 rounded transition"
            >
                <input
                    type="checkbox"
                    name={`question-${questionId}`}
                    value={answer.id}
                    className="mr-2"
                    checked={selectedAnswers.includes(answer.id)}
                    onChange={() => onAnswerChange(questionId, answer.id)}
                />
                {answer.answerText}
            </label>
        ))
    );
};

export default MultipleChoiceAnswer;
