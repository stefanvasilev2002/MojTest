package com.finki.mojtest.service;

import com.finki.mojtest.model.StudentAnswer;

import java.util.List;

public interface StudentAnswerService {
    StudentAnswer createStudentAnswer(StudentAnswer studentAnswer);
    StudentAnswer getStudentAnswerById(Long id);
    List<StudentAnswer> getAllStudentAnswers();
    StudentAnswer updateStudentAnswer(Long id, StudentAnswer updatedStudentAnswer);
    void deleteStudentAnswer(Long id);
    List<StudentAnswer> getStudentAnswersByStudentId(Long studentId);
    List<StudentAnswer> getStudentAnswersByQuestionId(Long questionId);

    StudentAnswer chooseAnswer(Long studentAnswerId, Long chosenAnswerId);
}
