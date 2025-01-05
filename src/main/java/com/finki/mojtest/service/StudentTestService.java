package com.finki.mojtest.service;

import com.finki.mojtest.model.StudentTest;
import com.finki.mojtest.model.dtos.*;
import org.springframework.data.domain.Page;

import java.util.List;

public interface StudentTestService {
    StudentTest createStudentTest(StudentTest studentTest);
    StudentTest getStudentTestById(Long id);
    List<StudentTest> getAllStudentTests();
    StudentTest updateStudentTest(Long id, StudentTest updatedStudentTest);
    void deleteStudentTest(Long id);

    List<StudentTest> getStudentTestsByStudentId(Long studentId);

    List<StudentTest> getStudentTestsByTestId(Long testId);
    TestTakingDTO getStudentTestWithQuestionsAndAnswers(Long studentTestId);
    StudentTest submitTest(Long studentTestId);

    TestFeedbackDTO evaluateTest(Long id, List<AnswerSubmissionDTO> answers);

    Page<TestAttemptDTO> getTestAttempts(Long testId, Long studentId, int page, int size);

    TestResultsDTO getTestResults(Long studentTestId);
}
