package com.finki.mojtest.web;

import com.finki.mojtest.model.StudentTest;
import com.finki.mojtest.model.dtos.*;
import com.finki.mojtest.service.StudentTestService;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/student-tests")
public class StudentTestController {

    private final StudentTestService studentTestService;

    public StudentTestController(StudentTestService studentTestService) {
        this.studentTestService = studentTestService;
    }
    @GetMapping("/attempts/{testId}")
    public ResponseEntity<Page<TestAttemptDTO>> getTestAttempts(
            @PathVariable Long testId,
            @RequestParam Long studentId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        try {
            Page<TestAttemptDTO> attempts = studentTestService.getTestAttempts(testId, studentId, page, size);
            return ResponseEntity.ok(attempts);
        } catch (EntityNotFoundException e) {
            return ResponseEntity.notFound().build();
        }
    }
    @DeleteMapping("/cancel/{id}")
    public ResponseEntity<Void> cancelStudentTest(@PathVariable Long id) {
        try {
            studentTestService.deleteStudentTest(id);
            return ResponseEntity.ok().build();
        } catch (EntityNotFoundException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
    @PostMapping("/{id}/submit")
    public ResponseEntity<TestFeedbackDTO> submitTest(@PathVariable Long id, @RequestBody List<AnswerSubmissionDTO> answers) {
        System.out.println("Submitting test for " + answers.size());
        try {
            TestFeedbackDTO feedback = studentTestService.evaluateTest(id, answers);
            return ResponseEntity.ok(feedback);
        } catch (EntityNotFoundException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            System.out.println(e.getMessage());
            return ResponseEntity.internalServerError().build();
        }
    }

    @PostMapping
    public ResponseEntity<StudentTest> createStudentTest(@RequestBody StudentTest studentTest) {
        StudentTest createdStudentTest = studentTestService.createStudentTest(studentTest);
        return new ResponseEntity<>(createdStudentTest, HttpStatus.CREATED);
    }

    @GetMapping("/{id}/take")
    public ResponseEntity<TestTakingDTO> getTestForTaking(@PathVariable Long id) {
        try {
            TestTakingDTO test = studentTestService.getStudentTestWithQuestionsAndAnswers(id);
            return ResponseEntity.ok(test);
        } catch (EntityNotFoundException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
    @GetMapping
    public ResponseEntity<List<StudentTest>> getAllStudentTests() {
        List<StudentTest> studentTests = studentTestService.getAllStudentTests();
        return new ResponseEntity<>(studentTests, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<StudentTest> getStudentTestById(@PathVariable Long id) {
        StudentTest studentTest = studentTestService.getStudentTestById(id);
        return new ResponseEntity<>(studentTest, HttpStatus.OK);
    }
    @GetMapping("/results/{studentTestId}")
    public ResponseEntity<TestResultsDTO> getTestResults(@PathVariable Long studentTestId) {
        TestResultsDTO results = studentTestService.getTestResults(studentTestId);
        return ResponseEntity.ok(results);
    }
    @PutMapping("/{id}")
    public ResponseEntity<StudentTest> updateStudentTest(
            @PathVariable Long id,
            @RequestBody StudentTest updatedStudentTest) {
        StudentTest studentTest = studentTestService.updateStudentTest(id, updatedStudentTest);
        return new ResponseEntity<>(studentTest, HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteStudentTest(@PathVariable Long id) {
        studentTestService.deleteStudentTest(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @GetMapping("/by-student/{studentId}")
    public ResponseEntity<List<StudentTest>> getStudentTestsByStudentId(@PathVariable Long studentId) {
        List<StudentTest> studentTests = studentTestService.getStudentTestsByStudentId(studentId);
        return new ResponseEntity<>(studentTests, HttpStatus.OK);
    }
    @GetMapping("/by-test/{testId}")
    public ResponseEntity<List<StudentTest>> getStudentTestsByTestId(@PathVariable Long testId) {
        List<StudentTest> studentTests = studentTestService.getStudentTestsByTestId(testId);
        return new ResponseEntity<>(studentTests, HttpStatus.OK);
    }
}
