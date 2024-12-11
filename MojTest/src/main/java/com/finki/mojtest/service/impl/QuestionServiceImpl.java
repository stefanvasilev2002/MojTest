package com.finki.mojtest.service.impl;

import com.finki.mojtest.model.Answer;
import com.finki.mojtest.model.Question;
import com.finki.mojtest.model.dtos.QuestionDTO;
import com.finki.mojtest.model.mappers.QuestionMapper;
import com.finki.mojtest.repository.AnswerRepository;
import com.finki.mojtest.repository.QuestionRepository;
import com.finki.mojtest.service.QuestionService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class QuestionServiceImpl implements QuestionService {

    private final QuestionRepository questionRepository;
    private final AnswerRepository answerRepository;

    @Override
    public Question createQuestion(Question question) {
        return questionRepository.save(question);
    }

    @Override
    public Question createQuestionByDTO(QuestionDTO questionDTO) {
        Question question = QuestionMapper.fromDTO(questionDTO);

        // Save the Question first to get an ID
        question = questionRepository.save(question);

        // Create and save the answers if they exist
        if (questionDTO.getAnswers() != null && !questionDTO.getAnswers().isEmpty()) {
            Question finalQuestion = question;
            List<Answer> answers = questionDTO.getAnswers().stream()
                    .map(answerDTO -> {
                        Answer answer = new Answer();
                        answer.setAnswerText(answerDTO.getAnswerText());
                        answer.setQuestion(finalQuestion);
                        return answer;
                    })
                    .collect(Collectors.toList());

            answers = answerRepository.saveAll(answers);
            question.setAnswers(answers);
        }

        return question;
    }

    @Override
    public Question getQuestionById(Long id) {
        return questionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Question not found"));
    }

    @Override
    public List<Question> getAllQuestions() {
        return questionRepository.findAll();
    }

    @Override
    @Transactional
    public Question updateQuestion(Long id, QuestionDTO questionDTO) {
        Question existingQuestion = getQuestionById(id);

        // Update basic fields
        existingQuestion.setDescription(questionDTO.getDescription());

        // Update answers if they exist
        if (questionDTO.getAnswers() != null) {
            // Remove old answers
            answerRepository.deleteAll(existingQuestion.getAnswers());

            // Create new answers
            List<Answer> newAnswers = questionDTO.getAnswers().stream()
                    .map(answerDTO -> {
                        Answer answer = new Answer();
                        answer.setAnswerText(answerDTO.getAnswerText());
                        answer.setQuestion(existingQuestion);
                        return answer;
                    })
                    .collect(Collectors.toList());

            existingQuestion.setAnswers(answerRepository.saveAll(newAnswers));
        }

        return questionRepository.save(existingQuestion);
    }

    @Override
    @Transactional
    public void deleteQuestion(Long id) {
        Question question = getQuestionById(id);

        // Delete associated answers
        answerRepository.deleteAll(question.getAnswers());

        // Delete the question
        questionRepository.delete(question);
    }

    @Override
    public List<Question> getQuestionsByTestId(Long testId) {
        return questionRepository.findByTestId(testId);
    }
}