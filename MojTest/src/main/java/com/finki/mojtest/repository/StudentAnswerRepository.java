package com.finki.mojtest.repository;

import com.finki.mojtest.model.StudentAnswer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface StudentAnswerRepository extends JpaRepository<StudentAnswer, Long> {
    List<StudentAnswer> findByStudentTestId(Long studentTestId); // Answers for a specific student's test
    List<StudentAnswer> findByTestQuestionId(Long testQuestionId); // Answers for a specific test question
}
