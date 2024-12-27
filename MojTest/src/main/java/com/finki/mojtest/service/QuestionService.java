package com.finki.mojtest.service;

import com.finki.mojtest.model.Question;
import com.finki.mojtest.model.dtos.QuestionDTO;
import com.finki.mojtest.model.dtos.QuestionFromTeacherDTO;

import java.util.List;

public interface QuestionService {
    Question createQuestion(Question question);
    Question createQuestionByDTO(QuestionDTO question);
    Question getQuestionById(Long id);
    List<Question> getAllQuestions();
    Question updateQuestion(Long id, QuestionDTO questionDTO);
    void deleteQuestion(Long id);
    List<Question> getQuestionsByTestId(Long testId);

    Question createAndAddQuestionToTest(Long testId, QuestionFromTeacherDTO questionCreateDTO);
}
