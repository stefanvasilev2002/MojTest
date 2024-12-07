package com.finki.mojtest.web;

import com.finki.mojtest.model.Test;
import com.finki.mojtest.model.dtos.TestDTO;
import com.finki.mojtest.model.mappers.TestMapper;
import com.finki.mojtest.service.TestService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/tests")
public class TestController {

    private final TestService testService;

    public TestController(TestService testService) {
        this.testService = testService;
    }

    // Create a new test
    @PostMapping
    public ResponseEntity<TestDTO> createTest(@RequestBody TestDTO testDTO) {
        Test createdTest = testService.createTest(testDTO);  // Delegate to the service
        TestDTO createdTestDTO = TestMapper.toDTO(createdTest); // Convert to TestDTO
        return new ResponseEntity<>(createdTestDTO, HttpStatus.CREATED);
    }

    // Get test by ID
    @GetMapping("/{id}")
    public ResponseEntity<TestDTO> getTestById(@PathVariable Long id) {
        Test test = testService.getTestById(id);
        TestDTO testDTO = TestMapper.toDTO(test);  // Convert to TestDTO
        return new ResponseEntity<>(testDTO, HttpStatus.OK);
    }

    // Get all tests
    @GetMapping
    public ResponseEntity<List<TestDTO>> getAllTests() {
        List<Test> tests = testService.getAllTests();
        List<TestDTO> testDTOs = tests.stream()
                .map(TestMapper::toDTO)
                .collect(Collectors.toList());
        return new ResponseEntity<>(testDTOs, HttpStatus.OK);
    }

    // Update an existing test
    @PutMapping("/{id}")
    public ResponseEntity<TestDTO> updateTest(@PathVariable Long id, @RequestBody TestDTO testDTO) {
        Test updatedTest = testService.updateTest(id, testDTO); // Delegate to the service
        TestDTO updatedTestDTO = TestMapper.toDTO(updatedTest);  // Convert to TestDTO
        return new ResponseEntity<>(updatedTestDTO, HttpStatus.OK);
    }

    // Delete a test
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTest(@PathVariable Long id) {
        testService.deleteTest(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    // Get tests by teacher ID
    @GetMapping("/teacher/{teacherId}")
    public ResponseEntity<List<TestDTO>> getTestsByTeacherId(@PathVariable Long teacherId) {
        List<Test> tests = testService.getTestsByTeacherId(teacherId);
        List<TestDTO> testDTOs = tests.stream()
                .map(TestMapper::toDTO)
                .collect(Collectors.toList());
        return new ResponseEntity<>(testDTOs, HttpStatus.OK);
    }

    // Search tests by title
    @GetMapping("/search")
    public ResponseEntity<List<TestDTO>> searchTestsByTitle(@RequestParam String title) {
        List<Test> tests = testService.getTestsByTitle(title);
        List<TestDTO> testDTOs = tests.stream()
                .map(TestMapper::toDTO)
                .collect(Collectors.toList());
        return new ResponseEntity<>(testDTOs, HttpStatus.OK);
    }
}

