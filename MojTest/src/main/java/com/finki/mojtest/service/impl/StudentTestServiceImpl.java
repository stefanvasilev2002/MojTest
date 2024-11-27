package com.finki.mojtest.service.impl;

import com.finki.mojtest.model.StudentAnswer;
import com.finki.mojtest.model.StudentTest;
import com.finki.mojtest.repository.StudentAnswerRepository;
import com.finki.mojtest.repository.StudentTestRepository;
import com.finki.mojtest.service.StudentTestService;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Service
public class StudentTestServiceImpl implements StudentTestService {
    private final StudentTestRepository studentTestRepository;
    private final StudentAnswerRepository studentAnswerRepository;

    public StudentTestServiceImpl(StudentTestRepository studentTestRepository, StudentAnswerRepository studentAnswerRepository) {
        this.studentTestRepository = studentTestRepository;
        this.studentAnswerRepository = studentAnswerRepository;
    }

    @Override
    public StudentTest createStudentTest(StudentTest studentTest) {
        studentTest.setDateTaken(LocalDate.now());
        studentTest.setTimeTaken(LocalTime.now());
        int score = calculateScore(studentTest.getAnswers());
        studentTest.setScore(score);

        return studentTestRepository.save(studentTest);
    }
    private int calculateScore(List<StudentAnswer> answers) {
        int score = 0;
        for (StudentAnswer answer : answers) {
            if (answer.getChosenAnswer().isCorrect()) {
                score += answer.getChosenAnswer().getQuestion().getPoints();
            }
            else {
                score -= answer.getChosenAnswer().getQuestion().getNegativePointsPerAnswer();
            }
        }
        return score;
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
        studentTest.setScore(updatedStudentTest.getScore()); // Optionally recalculate score
        studentTest.setDateTaken(updatedStudentTest.getDateTaken());
        studentTest.setTimeTaken(updatedStudentTest.getTimeTaken());
        return studentTestRepository.save(studentTest);
    }

    @Override
    public void deleteStudentTest(Long id) {
        List<StudentAnswer> studentAnswers = getStudentTestById(id).getAnswers();

        studentAnswerRepository.deleteAll(studentAnswers);

        studentTestRepository.deleteById(id);
    }

    @Override
    public List<StudentTest> getStudentTestsByStudentId(Long studentId) {
        return studentTestRepository.findAllByStudentId(studentId);
    }

    @Override
    public List<StudentTest> getStudentTestsByTestId(Long testId) {
        return studentTestRepository.findAllByTestId(testId);
    }
}
