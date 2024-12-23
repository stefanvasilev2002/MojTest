package com.finki.mojtest.web;

import com.finki.mojtest.model.Question;
import com.finki.mojtest.model.StudentAnswer;
import com.finki.mojtest.model.StudentTest;
import com.finki.mojtest.model.Test;
import com.finki.mojtest.model.dtos.StudentAnswerDTO;
import com.finki.mojtest.model.dtos.StudentTestDTO;
import com.finki.mojtest.model.dtos.*;
import com.finki.mojtest.model.mappers.TestMapper;
import com.finki.mojtest.service.TestService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/tests")
public class TestController {

    private final TestService testService;

    public TestController(TestService testService) {
        this.testService = testService;
    }
    //Start test
    @PostMapping("/start/{testId}")
    public ResponseEntity<TestTakingViewDTO> startTest(@PathVariable Long testId, @RequestParam Long studentId) {
        StudentTest startedTest = testService.startTest(testId, studentId);
        TestTakingViewDTO dto = convertToTestTakingView(startedTest);
        return new ResponseEntity<>(dto, HttpStatus.CREATED);
    }

    private TestTakingViewDTO convertToTestTakingView(StudentTest studentTest) {
        TestTakingViewDTO dto = new TestTakingViewDTO();
        dto.setStudentTestId(studentTest.getId());
        dto.setTestTitle(studentTest.getTest().getTitle());
        dto.setTimeLimit(studentTest.getTest().getTimeLimit());

        List<TestQuestionViewDTO> questions = new ArrayList<>();

        for (StudentAnswer studentAnswer : studentTest.getAnswers()) {
            TestQuestionViewDTO questionDTO = new TestQuestionViewDTO();
            Question question = studentAnswer.getTestQuestion().getQuestion();

            questionDTO.setQuestionId(question.getId());
            questionDTO.setTestQuestionId(studentAnswer.getTestQuestion().getId());
            questionDTO.setDescription(question.getDescription());
            questionDTO.setPoints(question.getPoints());
            questionDTO.setStudentAnswerId(studentAnswer.getId());
            questionDTO.setQuestionType(question.getQuestionType().toString());
            // Get all possible answers for this question
            List<AnswerViewDTO> answers = question.getAnswers().stream()
                    .map(answer -> {
                        AnswerViewDTO answerDTO = new AnswerViewDTO();
                        answerDTO.setId(answer.getId());
                        answerDTO.setAnswerText(answer.getAnswerText());
                        return answerDTO;
                    })
                    .collect(Collectors.toList());

            // Shuffle answers for multiple choice questions
            Collections.shuffle(answers);
            questionDTO.setPossibleAnswers(answers);

            questions.add(questionDTO);
        }

        // Optionally shuffle questions
        Collections.shuffle(questions);
        dto.setQuestions(questions);

        return dto;
    }

    private StudentTestDTO convertToDTO(StudentTest studentTest) {
        StudentTestDTO dto = new StudentTestDTO();
        dto.setId(studentTest.getId());
        dto.setScore(studentTest.getScore());
        dto.setDateTaken(studentTest.getDateTaken());
        dto.setTimeTaken(studentTest.getTimeTaken());
        dto.setStudentId(studentTest.getStudent().getId());
        dto.setTestId(studentTest.getTest().getId());

        List<StudentAnswerDTO> answerDTOs = studentTest.getAnswers().stream()
                .map(answer -> {
                    StudentAnswerDTO answerDTO = new StudentAnswerDTO();
                    answerDTO.setId(answer.getId());
                    answerDTO.setSubmittedValue(answer.getSubmittedValue());
                    answerDTO.setStudentTestId(studentTest.getId());
                    answerDTO.setTestQuestionId(answer.getTestQuestion().getId());
                    if(answer.getChosenAnswer() != null) {
                        answerDTO.setChosenAnswerId(answer.getChosenAnswer().getId());
                    }
                    return answerDTO;
                })
                .collect(Collectors.toList());

        dto.setAnswers(answerDTOs);
        return dto;
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

