package com.finki.mojtest.web;

import com.finki.mojtest.model.TestQuestion;
import com.finki.mojtest.service.TestQuestionService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/test-questions")
public class TestQuestionController {

    private final TestQuestionService testQuestionService;

    public TestQuestionController(TestQuestionService testQuestionService) {
        this.testQuestionService = testQuestionService;
    }

    @PostMapping
    public ResponseEntity<TestQuestion> createTestQuestion(@RequestBody TestQuestion testQuestion) {
        TestQuestion createdTestQuestion = testQuestionService.createTestQuestion(testQuestion);
        return new ResponseEntity<>(createdTestQuestion, HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    public ResponseEntity<TestQuestion> getTestQuestion(@PathVariable Long id) {
        try {
            TestQuestion testQuestion = testQuestionService.getTestQuestionById(id);
            return new ResponseEntity<>(testQuestion, HttpStatus.OK);
        } catch (RuntimeException ex) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @GetMapping
    public ResponseEntity<List<TestQuestion>> getAllTestQuestions() {
        List<TestQuestion> testQuestions = testQuestionService.getAllTestQuestions();
        return new ResponseEntity<>(testQuestions, HttpStatus.OK);
    }

    @PutMapping("/{id}")
    public ResponseEntity<TestQuestion> updateTestQuestion(@PathVariable Long id, @RequestBody TestQuestion updatedTestQuestion) {
        try {
            TestQuestion testQuestion = testQuestionService.updateTestQuestion(id, updatedTestQuestion);
            return new ResponseEntity<>(testQuestion, HttpStatus.OK);
        } catch (RuntimeException ex) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTestQuestion(@PathVariable Long id) {
        try {
            testQuestionService.deleteTestQuestion(id);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (RuntimeException ex) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @GetMapping("/test/{testId}")
    public ResponseEntity<List<TestQuestion>> getTestQuestionsByTestId(@PathVariable Long testId) {
        List<TestQuestion> testQuestions = testQuestionService.getTestQuestionsByTestId(testId);
        return new ResponseEntity<>(testQuestions, HttpStatus.OK);
    }

    @GetMapping("/question/{questionId}")
    public ResponseEntity<List<TestQuestion>> getTestQuestionsByQuestionId(@PathVariable Long questionId) {
        List<TestQuestion> testQuestions = testQuestionService.getTestQuestionsByQuestionId(questionId);
        return new ResponseEntity<>(testQuestions, HttpStatus.OK);
    }
}
