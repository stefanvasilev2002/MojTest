package com.finki.mojtest.service;

import com.finki.mojtest.model.StudentTest;

import java.util.List;

public interface StudentTestService {
    StudentTest createStudentTest(StudentTest studentTest);
    StudentTest getStudentTestById(Long id);
    List<StudentTest> getAllStudentTests();
    StudentTest updateStudentTest(Long id, StudentTest updatedStudentTest);
    void deleteStudentTest(Long id);
}
