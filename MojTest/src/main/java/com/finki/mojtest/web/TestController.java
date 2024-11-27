package com.finki.mojtest.web;

import com.finki.mojtest.model.Test;
import com.finki.mojtest.service.TestService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tests")
public class TestController {

    private final TestService testService;

    public TestController(TestService testService) {
        this.testService = testService;
    }

    // Create a new test
    @PostMapping
    public ResponseEntity<Test> createTest(@RequestBody Test test) {
        Test createdTest = testService.createTest(test);
        return new ResponseEntity<>(createdTest, HttpStatus.CREATED);
    }

    // Get test by ID
    @GetMapping("/{id}")
    public ResponseEntity<Test> getTestById(@PathVariable Long id) {
        Test test = testService.getTestById(id);
        return new ResponseEntity<>(test, HttpStatus.OK);
    }

    // Get all tests
    @GetMapping
    public ResponseEntity<List<Test>> getAllTests() {
        List<Test> tests = testService.getAllTests();
        return new ResponseEntity<>(tests, HttpStatus.OK);
    }

    // Update an existing test
    @PutMapping("/{id}")
    public ResponseEntity<Test> updateTest(@PathVariable Long id, @RequestBody Test updatedTest) {
        Test test = testService.updateTest(id, updatedTest);
        return new ResponseEntity<>(test, HttpStatus.OK);
    }

    // Delete a test
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTest(@PathVariable Long id) {
        testService.deleteTest(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    // Get tests by teacher ID
    @GetMapping("/teacher/{teacherId}")
    public ResponseEntity<List<Test>> getTestsByTeacherId(@PathVariable Long teacherId) {
        List<Test> tests = testService.getTestsByTeacherId(teacherId);
        return new ResponseEntity<>(tests, HttpStatus.OK);
    }

    // Search tests by title
    @GetMapping("/search")
    public ResponseEntity<List<Test>> searchTestsByTitle(@RequestParam String title) {
        List<Test> tests = testService.getTestsByTitle(title);
        return new ResponseEntity<>(tests, HttpStatus.OK);
    }
}
