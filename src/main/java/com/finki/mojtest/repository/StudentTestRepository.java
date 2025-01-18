package com.finki.mojtest.repository;

import com.finki.mojtest.model.StudentTest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Repository
public interface StudentTestRepository extends JpaRepository<StudentTest, Long> {
    List<StudentTest> findAllByStudentId(Long studentId);
    List<StudentTest> findAllByTestId(Long testId);
    List<StudentTest> findByTestIdAndStudentIdOrderByDateTakenDescTimeTakenDesc(
            Long testId,
            Long studentId
    );

    Page<StudentTest> findByTestIdAndStudentId(Long testId, Long studentId, Pageable pageable);


    @Query("SELECT COUNT(DISTINCT st.student) FROM StudentTest st WHERE st.dateTaken > :date")
    long countDistinctStudentsByDateTakenAfter(LocalDate date);

    @Query(value = """
    SELECT ROUND(
        (AVG(
            (CAST(st.score AS DECIMAL) /
                COALESCE(
                    (SELECT SUM(q.points) 
                     FROM test_question tq 
                     JOIN question q ON q.id = tq.question_id 
                     WHERE tq.test_id = st.test_id),
                    1
                )
            ) * 100
        ))::numeric,
        1
    )
    FROM student_test st
    WHERE st.score IS NOT NULL
""", nativeQuery = true)
    Double findAverageScore();

    @Query("""
        SELECT NEW map(
            FUNCTION('DATE_TRUNC', 'month', st.dateTaken) as date,
            AVG(st.score) as averageScore
        )
        FROM StudentTest st
        WHERE st.dateTaken >= :startDate
        GROUP BY FUNCTION('DATE_TRUNC', 'month', st.dateTaken)
        ORDER BY date
    """)
    List<Map<String, Object>> findMonthlyAverageScores(LocalDate startDate);

    @Query(value = """
        SELECT
            CASE
                WHEN EXTRACT(HOUR FROM st.start_time) < 12 THEN 'Morning'
                WHEN EXTRACT(HOUR FROM st.start_time) < 18 THEN 'Afternoon'
                ELSE 'Evening'
            END as timeSlot,
            COUNT(DISTINCT st.student_id) as activeUsers
        FROM student_test st
        WHERE st.start_time >= :startDate
        GROUP BY CASE
            WHEN EXTRACT(HOUR FROM st.start_time) < 12 THEN 'Morning'
            WHEN EXTRACT(HOUR FROM st.start_time) < 18 THEN 'Afternoon'
            ELSE 'Evening'
        END
        """, nativeQuery = true)
    List<Map<String, Object>> findActivityByTimeOfDay(LocalDateTime startDate);

    @Query(value = """
        SELECT AVG(EXTRACT(EPOCH FROM (st.end_time - st.start_time))/60)
        FROM student_test st 
        WHERE st.end_time IS NOT NULL
        """, nativeQuery = true)
    Double findAverageCompletionTime();

    @Query(value = """
        SELECT
            DATE(st.start_time) as date,
            ROUND(AVG(st.score)::numeric, 2) as avgScore,
            COUNT(*) as totalTests
        FROM student_test st
        WHERE st.start_time >= :startDate
        GROUP BY DATE(st.start_time)
        ORDER BY date DESC
        """, nativeQuery = true)
    List<Map<String, Object>> findTestPerformanceTrend(LocalDateTime startDate);
    @Query("SELECT COUNT(DISTINCT st.student.id) FROM StudentTest st WHERE st.startTime > :date")
    long countDistinctStudentsByStartTimeAfter(LocalDateTime date);
    @Query(value = """
        SELECT
            t.title as testName,
            ROUND(AVG(EXTRACT(EPOCH FROM (st.end_time - st.start_time))/60)::numeric, 2) as averageTime
        FROM student_test st
        JOIN test t ON t.id = st.test_id
        WHERE st.end_time IS NOT NULL
        GROUP BY t.id, t.title
        ORDER BY averageTime DESC
        """, nativeQuery = true)
    List<Map<String, Object>> findAverageTimePerTest();
}
