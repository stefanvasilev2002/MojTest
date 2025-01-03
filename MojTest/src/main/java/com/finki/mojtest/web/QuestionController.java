package com.finki.mojtest.web;

import com.finki.mojtest.model.Question;
import com.finki.mojtest.model.Test;
import com.finki.mojtest.model.dtos.QuestionDTO;
import com.finki.mojtest.model.dtos.QuestionFromTeacherDTO;
import com.finki.mojtest.model.dtos.TestDTO;
import com.finki.mojtest.model.mappers.QuestionMapper;
import com.finki.mojtest.model.mappers.TestMapper;
import com.finki.mojtest.service.QuestionService;
import com.finki.mojtest.service.TestService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/questions")
public class QuestionController {

    private final QuestionService questionService;
    private final TestService testService;


    public QuestionController(QuestionService questionService, TestService testService) {
        this.questionService = questionService;
        this.testService = testService;
    }

    @PostMapping
    public ResponseEntity<QuestionDTO> createQuestion(@RequestBody QuestionDTO questionDTO) {
        Question createdQuestion = questionService.createQuestionByDTO(questionDTO);
        return new ResponseEntity<>(QuestionMapper.toDTO(createdQuestion), HttpStatus.CREATED);
    }
    @PostMapping("/create")
    public ResponseEntity<QuestionDTO> createQuestionForFutureUser(@RequestBody QuestionFromTeacherDTO questionDTO) {
        Question createdQuestion = questionService.createQuestionByDTOForFutureUse(questionDTO);
        return new ResponseEntity<>(QuestionMapper.toDTO(createdQuestion), HttpStatus.CREATED);
    }
    @PostMapping("/test/{testId}/create")
    public ResponseEntity<QuestionDTO> createAndAddQuestionToTest(
            @PathVariable Long testId,
            @RequestBody QuestionFromTeacherDTO questionCreateDTO) {
        Question createdQuestion = questionService.createAndAddQuestionToTest(testId, questionCreateDTO);
        return new ResponseEntity<>(QuestionMapper.toDTO(createdQuestion), HttpStatus.CREATED);
    }
    @GetMapping("/not-in-test/{testId}")
    public ResponseEntity<List<QuestionDTO>> getQuestionsNotInTest(@PathVariable Long testId) {
        List<Question> questions = questionService.getQuestionsNotInTest(testId);
        List<QuestionDTO> questionDTOs = questions.stream()
                .map(QuestionMapper::toDTO)
                .collect(Collectors.toList());
        return new ResponseEntity<>(questionDTOs, HttpStatus.OK);
    }
    @PostMapping("/{testId}/questions/{questionId}")
    public ResponseEntity<TestDTO> addQuestionToTest(
            @PathVariable Long testId,
            @PathVariable Long questionId) {
        Test updatedTest = testService.addQuestionToTest(testId, questionId);
        return new ResponseEntity<>(TestMapper.toDTO(updatedTest), HttpStatus.OK);
    }

    @DeleteMapping("/{testId}/questions/{questionId}")
    public ResponseEntity<TestDTO> removeQuestionFromTest(
            @PathVariable Long testId,
            @PathVariable Long questionId) {
        Test updatedTest = testService.removeQuestionFromTest(testId, questionId);
        return new ResponseEntity<>(TestMapper.toDTO(updatedTest), HttpStatus.OK);
    }
    @GetMapping("/{id}")
    public ResponseEntity<QuestionDTO> getQuestionById(@PathVariable Long id) {
        Question question = questionService.getQuestionById(id);
        return new ResponseEntity<>(QuestionMapper.toDTO(question), HttpStatus.OK);
    }

    @GetMapping
    public ResponseEntity<List<QuestionDTO>> getAllQuestions() {
        List<Question> questions = questionService.getAllQuestions();
        List<QuestionDTO> questionDTOs = questions.stream()
                .map(QuestionMapper::toDTO)
                .collect(Collectors.toList());
        return new ResponseEntity<>(questionDTOs, HttpStatus.OK);
    }

    @PutMapping("/{id}")
    public ResponseEntity<QuestionDTO> updateQuestion(@PathVariable Long id, @RequestBody QuestionDTO questionDTO) {
        Question updatedQuestion = questionService.updateQuestion(id, questionDTO);

        return new ResponseEntity<>(QuestionMapper.toDTO(updatedQuestion), HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteQuestion(@PathVariable Long id) {
        questionService.deleteQuestion(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @GetMapping("/test/{testId}")
    public ResponseEntity<List<QuestionDTO>> getQuestionsByTestId(@PathVariable Long testId) {
        List<Question> questions = questionService.getQuestionsByTestId(testId);
        List<QuestionDTO> questionDTOs = questions.stream()
                .map(QuestionMapper::toDTO)
                .collect(Collectors.toList());
        return new ResponseEntity<>(questionDTOs, HttpStatus.OK);
    }
}
