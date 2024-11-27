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
    private final QuestionMapper questionMapper;

    public QuestionController(QuestionService questionService, QuestionMapper questionMapper) {
        this.questionService = questionService;
        this.questionMapper = questionMapper;
    }

    @PostMapping
    public ResponseEntity<QuestionDTO> createQuestion(@RequestBody QuestionDTO questionDTO) {
        Question question = questionMapper.questionDTOToQuestion(questionDTO);
        Question createdQuestion = questionService.createQuestion(question);
        return new ResponseEntity<>(questionMapper.questionToQuestionDTO(createdQuestion), HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    public ResponseEntity<QuestionDTO> getQuestionById(@PathVariable Long id) {
        Question question = questionService.getQuestionById(id);
        return new ResponseEntity<>(questionMapper.questionToQuestionDTO(question), HttpStatus.OK);
    }

    @GetMapping
    public ResponseEntity<List<QuestionDTO>> getAllQuestions() {
        List<Question> questions = questionService.getAllQuestions();
        List<QuestionDTO> questionDTOs = questions.stream()
                .map(questionMapper::questionToQuestionDTO)
                .collect(Collectors.toList());
        return new ResponseEntity<>(questionDTOs, HttpStatus.OK);
    }

    @PutMapping("/{id}")
    public ResponseEntity<QuestionDTO> updateQuestion(@PathVariable Long id, @RequestBody QuestionDTO questionDTO) {
        Question updatedQuestion = questionService.updateQuestion(id, questionMapper.questionDTOToQuestion(questionDTO));
        return new ResponseEntity<>(questionMapper.questionToQuestionDTO(updatedQuestion), HttpStatus.OK);
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
                .map(questionMapper::questionToQuestionDTO)
                .collect(Collectors.toList());
        return new ResponseEntity<>(questionDTOs, HttpStatus.OK);
    }
}
