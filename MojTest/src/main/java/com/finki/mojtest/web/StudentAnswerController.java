package com.finki.mojtest.web;

import com.finki.mojtest.model.StudentAnswer;
import com.finki.mojtest.service.StudentAnswerService;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/student-answers")
public class StudentAnswerController {

    private final StudentAnswerService studentAnswerService;

    public StudentAnswerController(StudentAnswerService studentAnswerService) {
        this.studentAnswerService = studentAnswerService;
    }

    @PutMapping("/{id}/choose-answer")
    public ResponseEntity<StudentAnswer> chooseAnswer(
            @PathVariable Long id,
            @RequestBody Map<String, Long> request) {
        try {
            Long chosenAnswerId = request.get("chosenAnswerId");
            if (chosenAnswerId == null) {
                return ResponseEntity.badRequest().build();
            }

            StudentAnswer updatedAnswer = studentAnswerService.chooseAnswer(id, chosenAnswerId);
            return ResponseEntity.ok(updatedAnswer);
        } catch (EntityNotFoundException e) {
            return ResponseEntity.notFound().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
    @PostMapping
    public ResponseEntity<StudentAnswer> createStudentAnswer(@RequestBody StudentAnswer studentAnswer) {
        StudentAnswer createdStudentAnswer = studentAnswerService.createStudentAnswer(studentAnswer);
        return new ResponseEntity<>(createdStudentAnswer, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<StudentAnswer>> getAllStudentAnswers() {
        List<StudentAnswer> studentAnswers = studentAnswerService.getAllStudentAnswers();
        return new ResponseEntity<>(studentAnswers, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<StudentAnswer> getStudentAnswerById(@PathVariable Long id) {
        StudentAnswer studentAnswer = studentAnswerService.getStudentAnswerById(id);
        return new ResponseEntity<>(studentAnswer, HttpStatus.OK);
    }

    @PutMapping("/{id}")
    public ResponseEntity<StudentAnswer> updateStudentAnswer(
            @PathVariable Long id,
            @RequestBody StudentAnswer updatedStudentAnswer) {
        StudentAnswer studentAnswer = studentAnswerService.updateStudentAnswer(id, updatedStudentAnswer);
        return new ResponseEntity<>(studentAnswer, HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteStudentAnswer(@PathVariable Long id) {
        studentAnswerService.deleteStudentAnswer(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @GetMapping("/by-student-test/{studentTestId}")
    public ResponseEntity<List<StudentAnswer>> getStudentAnswersByStudentTestId(@PathVariable Long studentTestId) {
        List<StudentAnswer> studentAnswers = studentAnswerService.getStudentAnswersByStudentId(studentTestId);
        return new ResponseEntity<>(studentAnswers, HttpStatus.OK);
    }

    @GetMapping("/by-test-question/{testQuestionId}")
    public ResponseEntity<List<StudentAnswer>> getStudentAnswersByTestQuestionId(@PathVariable Long testQuestionId) {
        List<StudentAnswer> studentAnswers = studentAnswerService.getStudentAnswersByQuestionId(testQuestionId);
        return new ResponseEntity<>(studentAnswers, HttpStatus.OK);
    }
}
