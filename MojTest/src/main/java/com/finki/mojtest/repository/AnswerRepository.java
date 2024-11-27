package com.finki.mojtest.repository;

import com.finki.mojtest.model.Answer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AnswerRepository extends JpaRepository<Answer, Long> {
    List<Answer> findByQuestionId(Long questionId); // Answers for a specific question
    List<Answer> findByIsCorrect(boolean isCorrect); // Filter correct or incorrect answers
}
