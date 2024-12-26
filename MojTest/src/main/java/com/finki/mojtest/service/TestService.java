package com.finki.mojtest.service;

import com.finki.mojtest.model.StudentTest;
import com.finki.mojtest.model.Test;
import com.finki.mojtest.model.dtos.TestDTO;
import com.finki.mojtest.model.dtos.TestFromTeacherDTO;

import java.util.List;

public interface TestService {
    Test createTest(TestDTO testDTO);
    Test createTestFromTeacher(TestFromTeacherDTO testDTO);

    Test getTestById(Long id);

    List<Test> getAllTests();

    Test updateTest(Long id, TestDTO testDTO);

    void deleteTest(Long id);

    List<Test> getTestsByTeacherId(Long teacherId);

    List<Test> getTestsByTitle(String title);

    StudentTest startTest(Long testId, Long studentId);
    Test addQuestionToTest(Long testId, Long questionId);

    Test removeQuestionFromTest(Long testId, Long questionId);

    Test updateTestFromTeacher(Long id, TestFromTeacherDTO testDTO);
}

