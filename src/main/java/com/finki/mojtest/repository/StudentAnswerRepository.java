package com.finki.mojtest.repository;

import com.finki.mojtest.model.Answer;
import com.finki.mojtest.model.Question;
import com.finki.mojtest.model.StudentAnswer;
import com.finki.mojtest.model.TestQuestion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Map;

@Repository
public interface StudentAnswerRepository extends JpaRepository<StudentAnswer, Long> {
    List<StudentAnswer> findByStudentTestId(Long studentTestId);
    List<StudentAnswer> findByTestQuestionId(Long testQuestionId);
    void deleteAllByTestQuestion(TestQuestion testQuestion);
    List<StudentAnswer> findAllByTestQuestionIn(List<TestQuestion> testQuestions);
    @Query("""
        SELECT NEW map(
            sa.testQuestion.question.id as questionId,
            COUNT(CASE WHEN sa.chosenAnswer.isCorrect = true THEN 1 END) * 100.0 / COUNT(*) as successRate
        )
        FROM StudentAnswer sa
        GROUP BY sa.testQuestion.question.id
    """)
    List<Map<String, Object>> findQuestionSuccessRates();
}
