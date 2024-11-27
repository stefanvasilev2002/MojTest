package com.finki.mojtest.service.impl;

import com.finki.mojtest.model.Question;
import com.finki.mojtest.model.StudentTest;
import com.finki.mojtest.model.Test;
import com.finki.mojtest.repository.TestRepository;
import com.finki.mojtest.service.TestService;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TestServiceImpl implements TestService {
    private final TestRepository testRepository;

    public TestServiceImpl(TestRepository testRepository) {
        this.testRepository = testRepository;
    }

    @Override
    public Test createTest(Test test) {
        return testRepository.save(test);
    }

    @Override
    public Test getTestById(Long id) {
        return testRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Test not found"));
    }

    @Override
    public List<Test> getAllTests() {
        return testRepository.findAll();
    }

    @Override
    public Test updateTest(Long id, Test updatedTest) {
        Test test = getTestById(id);
        test.setTitle(updatedTest.getTitle());
        test.setDescription(updatedTest.getDescription());
        return testRepository.save(test);
    }

    @Override
    @Transactional
    public void deleteTest(Long id) {
        Test test = testRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Test with id " + id + " not found"));

        // Set the testId in StudentTest to null (or default)
        List<StudentTest> studentTests = test.getStudentTests();
        for (StudentTest studentTest : studentTests) {
            studentTest.setTest(null);
        }

        // Remove the test from the question bank (Many-to-Many relation)
        List<Question> questionBank = test.getQuestionBank();
        for (Question question : questionBank) {
            question.getTests().remove(test);
        }

        testRepository.deleteById(id);
    }

    @Override
    public List<Test> getTestsByTeacherId(Long teacherId) {
        return testRepository.findByCreatorId(teacherId);
    }
    @Override
    public List<Test> getTestsByTitle(String title) {
        return testRepository.findByTitleContaining(title);
    }
}
