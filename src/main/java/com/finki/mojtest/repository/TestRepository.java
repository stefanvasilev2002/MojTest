package com.finki.mojtest.repository;

import com.finki.mojtest.model.Test;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@Repository
public interface TestRepository extends JpaRepository<Test, Long> {
    List<Test> findByCreatorId(Long teacherId);
    List<Test> findByTitleContaining(String title);

    long countByCreatedDateBetween(LocalDate sixtyDaysAgo, LocalDate thirtyDaysAgo);
    @Query(value = """
        SELECT 
            u.id as teacherId,
            u.full_name as teacherName,
            COUNT(t.id) as totalTests,
            COALESCE(AVG(st.score), 0) as averageStudentScore,
            COUNT(DISTINCT st.student_id) as totalStudents
        FROM app_user u
        LEFT JOIN test t ON t.creator_id = u.id
        LEFT JOIN student_test st ON st.test_id = t.id
        WHERE u.dtype = 'TEACHER'
        AND t.created_date >= :startDate
        GROUP BY u.id, u.full_name
        ORDER BY totalTests DESC
        """, nativeQuery = true)
    List<Map<String, Object>> findTeacherTestStatistics(LocalDate startDate);

    @Query(value = """
        SELECT 
            u.id as teacherId,
            COUNT(q.id) as totalQuestions,
            COUNT(DISTINCT q.question_type) as uniqueQuestionTypes,
            ROUND(AVG(q.points), 2) as averagePoints
        FROM app_user u
        LEFT JOIN question q ON q.teacher_id = u.id
        WHERE u.dtype = 'TEACHER'
        GROUP BY u.id
        """, nativeQuery = true)
    List<Map<String, Object>> findTeacherQuestionStatistics();
    @Query("""
        SELECT NEW map(
            t.title as testName,
            CASE 
                WHEN COUNT(st) = 0 THEN 0 
                ELSE COUNT(CASE WHEN st.score > 0 THEN 1 END) * 100.0 / COUNT(st) 
            END as completionRate
        )
        FROM Test t
        LEFT JOIN t.studentTests st
        GROUP BY t.id, t.title
        ORDER BY completionRate DESC
    """)
    List<Map<String, Object>> findTestCompletionRates();}
