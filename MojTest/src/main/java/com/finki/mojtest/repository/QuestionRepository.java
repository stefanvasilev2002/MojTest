package com.finki.mojtest.repository;

import com.finki.mojtest.model.Question;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface QuestionRepository extends JpaRepository<Question, Long> {
    List<Question> findByCreatorId(Long teacherId); // Questions created by a specific teacher
    List<Question> findByQuestionType(String type); // Filter questions by type
    List<Question> findByPointsGreaterThanEqual(int points); // Questions with a minimum score

    @Query("SELECT q FROM Question q JOIN q.tests t WHERE t.id = :testId")
    List<Question> findByTestId(@Param("testId") Long testId);
}
