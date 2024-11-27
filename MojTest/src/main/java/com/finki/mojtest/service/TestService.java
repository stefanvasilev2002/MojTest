package com.finki.mojtest.service;

import com.finki.mojtest.model.Test;

import java.util.List;

public interface TestService {
    Test createTest(Test test);

    Test getTestById(Long id);

    List<Test> getAllTests();

    Test updateTest(Long id, Test updatedTest);

    void deleteTest(Long id);

    List<Test> getTestsByTeacherId(Long teacherId);

    List<Test> getTestsByTitle(String title);
}
