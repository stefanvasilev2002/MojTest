package com.finki.mojtest.web;

import com.finki.mojtest.model.StudentTest;
import com.finki.mojtest.model.Test;
import com.finki.mojtest.model.dtos.*;
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
    @PostMapping("/start/{testId}")
    public ResponseEntity<TestTakingViewDTO> startTest(@PathVariable Long testId, @RequestParam Long studentId) {
        StudentTest startedTest = testService.startTest(testId, studentId);
        TestTakingViewDTO dto = testService.convertToTestTakingView(startedTest);
        return new ResponseEntity<>(dto, HttpStatus.CREATED);
    }

    @PostMapping
    public ResponseEntity<TestFromTeacherDTO> createTestFromTeacher(@RequestBody TestFromTeacherDTO testDTO) {
        Test createdTest = testService.createTestFromTeacher(testDTO);  // Delegate to the service
        TestFromTeacherDTO createdTestDTO = TestMapper.toTestFromTeacherDTO(createdTest); // Convert to TestDTO
        return new ResponseEntity<>(createdTestDTO, HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    public ResponseEntity<TestDTO> getTestById(@PathVariable Long id) {
        Test test = testService.getTestById(id);
        TestDTO testDTO = TestMapper.toDTO(test);
        return new ResponseEntity<>(testDTO, HttpStatus.OK);
    }
    @GetMapping("get-test-for-teacher/{id}")
    public ResponseEntity<TestFromTeacherDTO> getTestByIdForTeacher(@PathVariable Long id) {
        Test test = testService.getTestById(id);
        TestFromTeacherDTO testDTO = TestMapper.toTestFromTeacherDTO(test);
        return new ResponseEntity<>(testDTO, HttpStatus.OK);
    }
    @GetMapping
    public ResponseEntity<List<TestDTO>> getAllTests() {
        List<Test> tests = testService.getAllTests();
        List<TestDTO> testDTOs = tests.stream()
                .map(TestMapper::toDTO)
                .collect(Collectors.toList());
        return new ResponseEntity<>(testDTOs, HttpStatus.OK);
    }
    @PutMapping("/{id}")
    public ResponseEntity<TestDTO> updateTest(@PathVariable Long id, @RequestBody TestDTO testDTO) {
        Test updatedTest = testService.updateTest(id, testDTO); // Delegate to the service
        TestDTO updatedTestDTO = TestMapper.toDTO(updatedTest);  // Convert to TestDTO
        return new ResponseEntity<>(updatedTestDTO, HttpStatus.OK);
    }
    @PutMapping("/update-test-from-teacher/{id}")
    public ResponseEntity<TestFromTeacherDTO> updateTestFromTeacher(@PathVariable Long id, @RequestBody TestFromTeacherDTO testDTO) {
        Test updatedTest = testService.updateTestFromTeacher(id, testDTO); // Delegate to the service
        TestFromTeacherDTO updatedTestDTO = TestMapper.toTestFromTeacherDTO(updatedTest);  // Convert to TestDTO
        return new ResponseEntity<>(updatedTestDTO, HttpStatus.OK);
    }
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTest(@PathVariable Long id) {
        testService.deleteTest(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
    @GetMapping("/teacher/{teacherId}")
    public ResponseEntity<List<TestDTO>> getTestsByTeacherId(@PathVariable Long teacherId) {
        List<Test> tests = testService.getTestsByTeacherId(teacherId);
        List<TestDTO> testDTOs = tests.stream()
                .map(TestMapper::toDTO)
                .collect(Collectors.toList());
        return new ResponseEntity<>(testDTOs, HttpStatus.OK);
    }
    @GetMapping("/search")
    public ResponseEntity<List<TestDTO>> searchTestsByTitle(@RequestParam String title) {
        List<Test> tests = testService.getTestsByTitle(title);
        List<TestDTO> testDTOs = tests.stream()
                .map(TestMapper::toDTO)
                .collect(Collectors.toList());
        return new ResponseEntity<>(testDTOs, HttpStatus.OK);
    }
}

