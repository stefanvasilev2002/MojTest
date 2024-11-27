package com.finki.mojtest.service.impl;

import com.finki.mojtest.model.Test;
import com.finki.mojtest.repository.TestRepository;
import com.finki.mojtest.service.TestService;
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
    public void deleteTest(Long id) {
        testRepository.deleteById(id);
    }

    @Override
    public List<Test> getTestsByTeacherId(Long teacherId) {
        return testRepository.findByCreatorId(teacherId);
    }
}
