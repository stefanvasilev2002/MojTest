import React from 'react';

const RadioAnswer = ({ question, questionId, correctAnswer, onAnswerChange }) => {
    return (
        question.possibleAnswers.map(answer => (
        <label
            key={answer.id}
            className="block text-gray-700 hover:bg-gray-100 cursor-pointer p-2 rounded transition"
        >
            <input
                type="radio"
                name={`question-${questionId}`}
                value={answer.id}
                className="mr-2"
                checked={correctAnswer === answer.id}
                onChange={() => onAnswerChange(questionId, answer.id)}
            />
            {answer.answerText}
        </label>
            )
        )
    );
};

export default RadioAnswer;
