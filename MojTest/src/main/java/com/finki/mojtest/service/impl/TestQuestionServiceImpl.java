package com.finki.mojtest.service.impl;

import com.finki.mojtest.model.TestQuestion;
import com.finki.mojtest.repository.TestQuestionRepository;
import com.finki.mojtest.service.TestQuestionService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TestQuestionServiceImpl implements TestQuestionService {
    private final TestQuestionRepository testQuestionRepository;

    public TestQuestionServiceImpl(TestQuestionRepository testQuestionRepository) {
        this.testQuestionRepository = testQuestionRepository;
    }

    @Override
    public TestQuestion createTestQuestion(TestQuestion testQuestion) {
        return testQuestionRepository.save(testQuestion);
    }

    @Override
    public TestQuestion getTestQuestionById(Long id) {
        return testQuestionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("TestQuestion not found"));
    }

    @Override
    public List<TestQuestion> getAllTestQuestions() {
        return testQuestionRepository.findAll();
    }

    @Override
    public TestQuestion updateTestQuestion(Long id, TestQuestion updatedTestQuestion) {
        TestQuestion testQuestion = getTestQuestionById(id);
        testQuestion.setTest(updatedTestQuestion.getTest());
        testQuestion.setQuestion(updatedTestQuestion.getQuestion());
        return testQuestionRepository.save(testQuestion);
    }

    @Override
    public void deleteTestQuestion(Long id) {
        testQuestionRepository.deleteById(id);
    }

    @Override
    public List<TestQuestion> getTestQuestionsByTestId(Long testId) {
        return testQuestionRepository.findByTestId(testId);
    }

    @Override
    public List<TestQuestion> getTestQuestionsByQuestionId(Long questionId) {
        return testQuestionRepository.findByQuestionId(questionId);
    }
}
