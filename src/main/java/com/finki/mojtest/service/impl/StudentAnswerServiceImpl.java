package com.finki.mojtest.service.impl;

import com.finki.mojtest.model.Answer;
import com.finki.mojtest.model.StudentAnswer;
import com.finki.mojtest.repository.AnswerRepository;
import com.finki.mojtest.repository.StudentAnswerRepository;
import com.finki.mojtest.service.StudentAnswerService;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class StudentAnswerServiceImpl implements StudentAnswerService {
    private final StudentAnswerRepository studentAnswerRepository;
    private final AnswerRepository answerRepository;

    public StudentAnswerServiceImpl(StudentAnswerRepository studentAnswerRepository, AnswerRepository answerRepository) {
        this.studentAnswerRepository = studentAnswerRepository;
        this.answerRepository = answerRepository;
    }

    @Override
    public StudentAnswer createStudentAnswer(StudentAnswer studentAnswer) {
        return studentAnswerRepository.save(studentAnswer);
    }

    @Override
    public StudentAnswer getStudentAnswerById(Long id) {
        return studentAnswerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("StudentAnswer not found"));
    }

    @Override
    public List<StudentAnswer> getAllStudentAnswers() {
        return studentAnswerRepository.findAll();
    }

    @Override
    public StudentAnswer updateStudentAnswer(Long id, StudentAnswer updatedStudentAnswer) {
        StudentAnswer studentAnswer = getStudentAnswerById(id);

        studentAnswer.setChosenAnswer(updatedStudentAnswer.getChosenAnswer());
        studentAnswer.setTestQuestion(updatedStudentAnswer.getTestQuestion());
        studentAnswer.setStudentTest(updatedStudentAnswer.getStudentTest());

        return studentAnswerRepository.save(studentAnswer);
    }

    @Override
    public void deleteStudentAnswer(Long id) {
        studentAnswerRepository.deleteById(id);
    }

    @Override
    public List<StudentAnswer> getStudentAnswersByStudentId(Long studentTestId) {
        return studentAnswerRepository.findByStudentTestId(studentTestId);
    }

    @Override
    public List<StudentAnswer> getStudentAnswersByQuestionId(Long testQuestionId) {
        return studentAnswerRepository.findByTestQuestionId(testQuestionId);
    }

    @Override
    @Transactional
    public StudentAnswer chooseAnswer(Long studentAnswerId, Long chosenAnswerId) {
        StudentAnswer studentAnswer = studentAnswerRepository.findById(studentAnswerId)
                .orElseThrow(() -> new EntityNotFoundException("Student Answer not found"));

        Answer chosenAnswer = answerRepository.findById(chosenAnswerId)
                .orElseThrow(() -> new EntityNotFoundException("Answer not found"));

        if (!chosenAnswer.getQuestion().getId().equals(studentAnswer.getTestQuestion().getQuestion().getId())) {
            throw new IllegalArgumentException("Invalid answer for this question");
        }

        studentAnswer.setChosenAnswer(chosenAnswer);
        return studentAnswerRepository.save(studentAnswer);
    }
}