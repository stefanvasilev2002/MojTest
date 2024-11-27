package com.finki.mojtest.service;

import com.finki.mojtest.model.Question;

import java.util.List;

public interface QuestionService {
    Question createQuestion(Question question);
    Question getQuestionById(Long id);
    List<Question> getAllQuestions();
    Question updateQuestion(Long id, Question updatedQuestion);
    void deleteQuestion(Long id);
    List<Question> getQuestionsByTestId(Long testId);
}
