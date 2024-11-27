package com.finki.mojtest.web;

import com.finki.mojtest.model.StudentTest;
import com.finki.mojtest.service.StudentTestService;
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

    // Create a new StudentTest
    @PostMapping
    public ResponseEntity<StudentTest> createStudentTest(@RequestBody StudentTest studentTest) {
        StudentTest createdStudentTest = studentTestService.createStudentTest(studentTest);
        return new ResponseEntity<>(createdStudentTest, HttpStatus.CREATED);
    }

    // Get all StudentTests
    @GetMapping
    public ResponseEntity<List<StudentTest>> getAllStudentTests() {
        List<StudentTest> studentTests = studentTestService.getAllStudentTests();
        return new ResponseEntity<>(studentTests, HttpStatus.OK);
    }

    // Get a specific StudentTest by ID
    @GetMapping("/{id}")
    public ResponseEntity<StudentTest> getStudentTestById(@PathVariable Long id) {
        StudentTest studentTest = studentTestService.getStudentTestById(id);
        return new ResponseEntity<>(studentTest, HttpStatus.OK);
    }

    // Update an existing StudentTest
    @PutMapping("/{id}")
    public ResponseEntity<StudentTest> updateStudentTest(
            @PathVariable Long id,
            @RequestBody StudentTest updatedStudentTest) {
        StudentTest studentTest = studentTestService.updateStudentTest(id, updatedStudentTest);
        return new ResponseEntity<>(studentTest, HttpStatus.OK);
    }

    // Delete a StudentTest by ID
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteStudentTest(@PathVariable Long id) {
        studentTestService.deleteStudentTest(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    // Get StudentTests by studentId
    @GetMapping("/by-student/{studentId}")
    public ResponseEntity<List<StudentTest>> getStudentTestsByStudentId(@PathVariable Long studentId) {
        List<StudentTest> studentTests = studentTestService.getStudentTestsByStudentId(studentId);
        return new ResponseEntity<>(studentTests, HttpStatus.OK);
    }

    // Get StudentTests by testId
    @GetMapping("/by-test/{testId}")
    public ResponseEntity<List<StudentTest>> getStudentTestsByTestId(@PathVariable Long testId) {
        List<StudentTest> studentTests = studentTestService.getStudentTestsByTestId(testId);
        return new ResponseEntity<>(studentTests, HttpStatus.OK);
    }
}
