package com.finki.mojtest.service;

import com.finki.mojtest.model.TestQuestion;

import java.util.List;

public interface TestQuestionService {
    TestQuestion createTestQuestion(TestQuestion testQuestion);
    TestQuestion getTestQuestionById(Long id);
    List<TestQuestion> getAllTestQuestions();
    TestQuestion updateTestQuestion(Long id, TestQuestion updatedTestQuestion);
    void deleteTestQuestion(Long id);
    List<TestQuestion> getTestQuestionsByTestId(Long testId);
    List<TestQuestion> getTestQuestionsByQuestionId(Long questionId);
}
