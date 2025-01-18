package com.finki.mojtest.web;

import com.finki.mojtest.repository.*;
import com.finki.mojtest.repository.users.StudentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/analytics")
@RequiredArgsConstructor
public class AnalyticsController {
    private final TestRepository testRepository;
    private final StudentTestRepository studentTestRepository;
    private final QuestionRepository questionRepository;
    private final StudentRepository studentRepository;
    private final AnswerRepository answerRepository;
    private final StudentAnswerRepository studentAnswerRepository;

    @GetMapping("/overview")
    public ResponseEntity<?> getOverview() {
        try {
            Map<String, Object> overview = new HashMap<>();
            LocalDate now = LocalDate.now();
            LocalDate thirtyDaysAgo = now.minusDays(30);
            LocalDate sixtyDaysAgo = now.minusDays(60);

            // Get total tests with proper date comparison
            long totalTests = testRepository.count();
            overview.put("totalTests", totalTests);

            // Get active students (students who started a test in last 30 days)
            long activeStudents = studentTestRepository.countDistinctStudentsByStartTimeAfter(LocalDateTime.now().minusDays(30));
            overview.put("activeStudents", activeStudents);

            // Calculate average score with proper rounding
            Double avgScore = studentTestRepository.findAverageScore();
            overview.put("averageScore", avgScore != null ?
                    BigDecimal.valueOf(avgScore).setScale(1, RoundingMode.HALF_UP).doubleValue() : 0);

            // Calculate average completion time with proper null handling
            Double avgTime = studentTestRepository.findAverageCompletionTime();
            overview.put("avgCompletionTime", avgTime != null ?
                    Math.round(avgTime) : 0);

            // Calculate trends with proper date ranges
            long previousPeriodTests = testRepository.countByCreatedDateBetween(
                    sixtyDaysAgo, thirtyDaysAgo);
            long currentPeriodTests = testRepository.countByCreatedDateBetween(
                    thirtyDaysAgo, now);

            double testChange = calculatePercentageChange(previousPeriodTests, currentPeriodTests);
            overview.put("testChange", String.format("%+.1f%%", testChange));
            overview.put("testTrend", getTrend(testChange));

            return ResponseEntity.ok(overview);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error retrieving analytics overview: " + e.getMessage());
        }
    }

    @GetMapping("/student-performance")
    public ResponseEntity<?> getStudentPerformance() {
        try {
            Map<String, Object> performance = new HashMap<>();

            // Get progress data (last 6 months)
            LocalDate sixMonthsAgo = LocalDate.now().minusMonths(6);
            List<Map<String, Object>> progressData = studentTestRepository
                    .findMonthlyAverageScores(sixMonthsAgo);
            performance.put("progressData", progressData);

            // Get activity data by time of day
            List<Map<String, Object>> activityData = studentTestRepository
                    .findActivityByTimeOfDay(LocalDateTime.now());
            performance.put("activityData", activityData);

            return ResponseEntity.ok(performance);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error retrieving student performance: " + e.getMessage());
        }
    }
    @GetMapping("/teacher-statistics")
    public ResponseEntity<?> getTeacherStatistics() {
        try {
            Map<String, Object> statistics = new HashMap<>();
            LocalDate sixMonthsAgo = LocalDate.now().minusMonths(6);

            // Get teacher test statistics
            List<Map<String, Object>> testStats = testRepository
                    .findTeacherTestStatistics(sixMonthsAgo);
            statistics.put("teacherPerformance", testStats);

            // Get teacher question statistics
            List<Map<String, Object>> questionStats = testRepository
                    .findTeacherQuestionStatistics();
            statistics.put("questionStatistics", questionStats);

            // Calculate additional metrics
            if (!testStats.isEmpty()) {
                // Top performing teachers (by student scores)
                List<Map<String, Object>> topPerformers = testStats.stream()
                        .sorted((a, b) -> ((Double) b.get("averageStudentScore"))
                                .compareTo((Double) a.get("averageStudentScore")))
                        .limit(5)
                        .collect(Collectors.toList());
                statistics.put("topPerformers", topPerformers);

                // Most active teachers (by number of tests created)
                List<Map<String, Object>> mostActive = testStats.stream()
                        .sorted((a, b) -> ((Long) b.get("totalTests"))
                                .compareTo((Long) a.get("totalTests")))
                        .limit(5)
                        .collect(Collectors.toList());
                statistics.put("mostActive", mostActive);

                // Calculate overall statistics
                double overallAverageScore = testStats.stream()
                        .mapToDouble(stat -> (Double) stat.get("averageStudentScore"))
                        .average()
                        .orElse(0.0);
                long totalTestsCreated = testStats.stream()
                        .mapToLong(stat -> (Long) stat.get("totalTests"))
                        .sum();
                long totalStudentsImpacted = testStats.stream()
                        .mapToLong(stat -> (Long) stat.get("totalStudents"))
                        .sum();

                Map<String, Object> overallStats = new HashMap<>();
                overallStats.put("averageScore", Math.round(overallAverageScore * 100.0) / 100.0);
                overallStats.put("totalTests", totalTestsCreated);
                overallStats.put("totalStudents", totalStudentsImpacted);
                statistics.put("overall", overallStats);
            }

            return ResponseEntity.ok(statistics);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error retrieving teacher statistics: " + e.getMessage());
        }
    }
    @GetMapping("/test-statistics")
    public ResponseEntity<?> getTestStatistics() {
        try {
            Map<String, Object> statistics = new HashMap<>();
            LocalDateTime sixMonthsAgo = LocalDateTime.now().minusMonths(6);

            // Get performance trend with proper date handling
            List<Map<String, Object>> performanceTrend = studentTestRepository
                    .findTestPerformanceTrend(sixMonthsAgo);
            statistics.put("performanceTrend", performanceTrend);

            // Get completion rates with proper calculation
            List<Map<String, Object>> completionRates = testRepository
                    .findTestCompletionRates();
            statistics.put("completionRates", completionRates);

            // Get average time per test with proper duration calculation
            List<Map<String, Object>> avgTimePerTest = studentTestRepository
                    .findAverageTimePerTest();
            statistics.put("averageTimePerTest", avgTimePerTest);

            return ResponseEntity.ok(statistics);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error retrieving test statistics: " + e.getMessage());
        }
    }

    @GetMapping("/question-statistics")
    public ResponseEntity<?> getQuestionStatistics() {
        try {
            Map<String, Object> statistics = new HashMap<>();

            // Get question type distribution
            List<Map<String, Object>> typeDistribution = questionRepository
                    .findQuestionTypeDistribution();
            statistics.put("typeDistribution", typeDistribution);

            // Calculate difficulty distribution based on success rates
            List<Map<String, Object>> difficultyDistribution = questionRepository
                    .findQuestionDifficultyDistribution();
            statistics.put("difficultyDistribution", difficultyDistribution);

            // Get most used questions
            List<Map<String, Object>> mostUsedQuestions = questionRepository
                    .findMostUsedQuestions(10); // top 10
            statistics.put("mostUsedQuestions", mostUsedQuestions);

            // Get success rates per question
            List<Map<String, Object>> successRates = studentAnswerRepository
                    .findQuestionSuccessRates();
            statistics.put("successRates", successRates);

            return ResponseEntity.ok(statistics);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error retrieving question statistics: " + e.getMessage());
        }
    }

    private String getTrend(double change) {
        if (change > 0) return "up";
        if (change < 0) return "down";
        return "neutral";
    }

    private double calculatePercentageChange(double oldValue, double newValue) {
        if (oldValue == 0) return newValue > 0 ? 100 : 0;
        return ((newValue - oldValue) / oldValue) * 100;
    }
}