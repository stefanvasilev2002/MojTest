package com.finki.mojtest.web;

import com.finki.mojtest.model.StudentAnswer;
import com.finki.mojtest.service.StudentAnswerService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/student-answers")
public class StudentAnswerController {

    private final StudentAnswerService studentAnswerService;

    public StudentAnswerController(StudentAnswerService studentAnswerService) {
        this.studentAnswerService = studentAnswerService;
    }

    // Create a new StudentAnswer
    @PostMapping
    public ResponseEntity<StudentAnswer> createStudentAnswer(@RequestBody StudentAnswer studentAnswer) {
        StudentAnswer createdStudentAnswer = studentAnswerService.createStudentAnswer(studentAnswer);
        return new ResponseEntity<>(createdStudentAnswer, HttpStatus.CREATED);
    }

    // Get all StudentAnswers
    @GetMapping
    public ResponseEntity<List<StudentAnswer>> getAllStudentAnswers() {
        List<StudentAnswer> studentAnswers = studentAnswerService.getAllStudentAnswers();
        return new ResponseEntity<>(studentAnswers, HttpStatus.OK);
    }

    // Get a specific StudentAnswer by ID
    @GetMapping("/{id}")
    public ResponseEntity<StudentAnswer> getStudentAnswerById(@PathVariable Long id) {
        StudentAnswer studentAnswer = studentAnswerService.getStudentAnswerById(id);
        return new ResponseEntity<>(studentAnswer, HttpStatus.OK);
    }

    // Update an existing StudentAnswer
    @PutMapping("/{id}")
    public ResponseEntity<StudentAnswer> updateStudentAnswer(
            @PathVariable Long id,
            @RequestBody StudentAnswer updatedStudentAnswer) {
        StudentAnswer studentAnswer = studentAnswerService.updateStudentAnswer(id, updatedStudentAnswer);
        return new ResponseEntity<>(studentAnswer, HttpStatus.OK);
    }

    // Delete a StudentAnswer by ID
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteStudentAnswer(@PathVariable Long id) {
        studentAnswerService.deleteStudentAnswer(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    // Get StudentAnswers by studentTestId
    @GetMapping("/by-student-test/{studentTestId}")
    public ResponseEntity<List<StudentAnswer>> getStudentAnswersByStudentTestId(@PathVariable Long studentTestId) {
        List<StudentAnswer> studentAnswers = studentAnswerService.getStudentAnswersByStudentId(studentTestId);
        return new ResponseEntity<>(studentAnswers, HttpStatus.OK);
    }

    // Get StudentAnswers by testQuestionId
    @GetMapping("/by-test-question/{testQuestionId}")
    public ResponseEntity<List<StudentAnswer>> getStudentAnswersByTestQuestionId(@PathVariable Long testQuestionId) {
        List<StudentAnswer> studentAnswers = studentAnswerService.getStudentAnswersByQuestionId(testQuestionId);
        return new ResponseEntity<>(studentAnswers, HttpStatus.OK);
    }
}
