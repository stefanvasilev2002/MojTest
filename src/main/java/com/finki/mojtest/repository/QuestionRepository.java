package com.finki.mojtest.repository;

import com.finki.mojtest.model.File;
import com.finki.mojtest.model.Question;
import com.finki.mojtest.model.Test;
import com.finki.mojtest.model.enumerations.QuestionType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@Repository
public interface QuestionRepository extends JpaRepository<Question, Long> {
    List<Question> findByCreatorId(Long teacherId);
    List<Question> findByQuestionType(QuestionType questionType);
    List<Question> findByPointsGreaterThanEqual(int points);

    @Query("SELECT q FROM Question q JOIN q.tests t WHERE t.id = :testId")
    List<Question> findByTestId(@Param("testId") Long testId);

    List<Question> findAllByTestsNotContaining(Test test);

    Optional<Question> findByImage_Id(Long id);
    @Query("""
        SELECT NEW map(
            q.questionType as type,
            COUNT(q) as count
        )
        FROM Question q
        GROUP BY q.questionType
    """)
    List<Map<String, Object>> findQuestionTypeDistribution();

    @Query("""
        SELECT NEW map(
            q.id as questionId,
            q.description as questionTitle,
            COUNT(DISTINCT t.id) as useCount
        )
        FROM Question q
        LEFT JOIN q.tests t
        GROUP BY q.id, q.description
        ORDER BY COUNT(DISTINCT t.id) DESC
    """)
    List<Map<String, Object>> findMostUsedQuestions(int limit);

    @Query(value = """
        WITH QuestionStats AS (
            SELECT 
                q.id,
                CASE
                    WHEN COALESCE(AVG(CASE WHEN sa.answer_id = a.id AND a.is_correct = true THEN 1.0 ELSE 0.0 END), 0) >= 0.7 THEN 'Easy'
                    WHEN COALESCE(AVG(CASE WHEN sa.answer_id = a.id AND a.is_correct = true THEN 1.0 ELSE 0.0 END), 0) >= 0.4 THEN 'Medium'
                    ELSE 'Hard'
                END as difficulty
            FROM question q
            LEFT JOIN test_question tq ON q.id = tq.question_id
            LEFT JOIN student_answer sa ON tq.id = sa.test_question_id
            LEFT JOIN answer a ON a.question_id = q.id
            GROUP BY q.id
        )
        SELECT 
            qs.difficulty as difficulty,
            COUNT(*) as count
        FROM QuestionStats qs
        GROUP BY qs.difficulty
    """, nativeQuery = true)
    List<Map<String, Object>> findQuestionDifficultyDistribution();
}
