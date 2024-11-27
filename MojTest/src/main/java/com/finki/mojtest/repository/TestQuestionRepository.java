package com.finki.mojtest.repository;

import com.finki.mojtest.model.TestQuestion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TestQuestionRepository extends JpaRepository<TestQuestion, Long> {
    List<TestQuestion> findByTestId(Long testId);
    List<TestQuestion> findByQuestionId(Long questionId);
}
