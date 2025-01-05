package com.finki.mojtest.repository;

import com.finki.mojtest.model.Answer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AnswerRepository extends JpaRepository<Answer, Long> {
    List<Answer> findByQuestionId(Long questionId);
    @Query("SELECT a FROM Answer a WHERE a.isCorrect = :isCorrect")
    List<Answer> findByIsCorrect(boolean isCorrect);
}
