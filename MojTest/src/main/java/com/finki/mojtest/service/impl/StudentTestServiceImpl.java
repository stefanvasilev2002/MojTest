package com.finki.mojtest.service.impl;

import com.finki.mojtest.model.StudentTest;
import com.finki.mojtest.repository.StudentTestRepository;
import com.finki.mojtest.service.StudentTestService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class StudentTestServiceImpl implements StudentTestService {
    private final StudentTestRepository studentTestRepository;

    public StudentTestServiceImpl(StudentTestRepository studentTestRepository) {
        this.studentTestRepository = studentTestRepository;
    }

    @Override
    public StudentTest createStudentTest(StudentTest studentTest) {
        return studentTestRepository.save(studentTest);
    }

    @Override
    public StudentTest getStudentTestById(Long id) {
        return studentTestRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Student Test not found"));
    }

    @Override
    public List<StudentTest> getAllStudentTests() {
        return studentTestRepository.findAll();
    }

    @Override
    public StudentTest updateStudentTest(Long id, StudentTest updatedStudentTest) {
        StudentTest studentTest = getStudentTestById(id);
        studentTest.setScore(updatedStudentTest.getScore());
        return studentTestRepository.save(studentTest);
    }

    @Override
    public void deleteStudentTest(Long id) {
        studentTestRepository.deleteById(id);
    }
}
