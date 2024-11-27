package com.finki.mojtest.service.impl;

import com.finki.mojtest.model.Answer;
import com.finki.mojtest.model.Question;
import com.finki.mojtest.model.Test;
import com.finki.mojtest.repository.AnswerRepository;
import com.finki.mojtest.repository.QuestionRepository;
import com.finki.mojtest.service.QuestionService;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class QuestionServiceImpl implements QuestionService {

    private final QuestionRepository questionRepository;
    private final AnswerRepository answerRepository;
    public QuestionServiceImpl(QuestionRepository questionRepository, AnswerRepository answerRepository) {
        this.questionRepository = questionRepository;
        this.answerRepository = answerRepository;
    }

    @Override
    public Question createQuestion(Question question) {
        return questionRepository.save(question);
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
    public Question updateQuestion(Long id, Question updatedQuestion) {
        Question existingQuestion = getQuestionById(id);
        existingQuestion.setDescription(updatedQuestion.getDescription());
        existingQuestion.setType(updatedQuestion.getType());
        return questionRepository.save(existingQuestion);
    }

    @Transactional
    @Override
    public void deleteQuestion(Long id) {
        Question question = getQuestionById(id);

        // Remove the question from the tests' question bank (Many-to-Many relationship)
        for (Test test : question.getTests()) {
            test.getQuestionBank().remove(question);
        }

        // Delete all answers associated with the question
        List<Answer> answers = question.getAnswers();
        answerRepository.deleteAll(answers);

        // Finally, delete the question
        questionRepository.deleteById(id);
    }

    @Override
    public List<Question> getQuestionsByTestId(Long testId) {
        return questionRepository.findByTestId(testId);
    }
}