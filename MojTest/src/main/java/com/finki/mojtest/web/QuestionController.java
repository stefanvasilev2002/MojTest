package com.finki.mojtest.web;

import com.finki.mojtest.model.Question;
import com.finki.mojtest.model.dtos.QuestionDTO;
import com.finki.mojtest.model.mappers.QuestionMapper;
import com.finki.mojtest.service.QuestionService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/questions")
public class QuestionController {

    private final QuestionService questionService;


    public QuestionController(QuestionService questionService) {
        this.questionService = questionService;
    }

    @PostMapping
    public ResponseEntity<QuestionDTO> createQuestion(@RequestBody QuestionDTO questionDTO) {
        Question createdQuestion = questionService.createQuestionByDTO(questionDTO);  // Delegate to the service
        return new ResponseEntity<>(QuestionMapper.toDTO(createdQuestion), HttpStatus.CREATED);
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
        // Call the service method to update the question
        Question updatedQuestion = questionService.updateQuestion(id, questionDTO);

        // Return the updated question as a DTO
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
