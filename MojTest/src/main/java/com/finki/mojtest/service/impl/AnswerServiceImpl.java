package com.finki.mojtest.service.impl;

import com.finki.mojtest.model.Answer;
import com.finki.mojtest.repository.AnswerRepository;
import com.finki.mojtest.service.AnswerService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AnswerServiceImpl implements AnswerService {
    private final AnswerRepository answerRepository;

    public AnswerServiceImpl(AnswerRepository answerRepository) {
        this.answerRepository = answerRepository;
    }

    @Override
    public Answer createAnswer(Answer answer) {
        if (answer.getQuestion() == null || answer.getQuestion().getId() == null) {
            throw new IllegalArgumentException("Answer must be associated with a valid question.");
        }
        return answerRepository.save(answer);
    }

    @Override
    public Answer getAnswerById(Long id) {
        return answerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Answer not found"));
    }

    @Override
    public List<Answer> getAllAnswers() {
        return answerRepository.findAll();
    }

    @Override
    public Answer updateAnswer(Long id, Answer updatedAnswer) {
        Answer existingAnswer = getAnswerById(id);

        if (updatedAnswer.getAnswerText() != null) {
            existingAnswer.setAnswerText(updatedAnswer.getAnswerText());
        }
        existingAnswer.setCorrect(updatedAnswer.isCorrect());

        return answerRepository.save(existingAnswer);
    }

    @Override
    public void deleteAnswer(Long id) {
        Answer answer = getAnswerById(id);

        if (!answer.getChosenBy().isEmpty()) {
            throw new RuntimeException("Answer cannot be deleted because it has been chosen by students.");
        }

        answerRepository.deleteById(id);
    }

    @Override
    public List<Answer> getAnswersByQuestionId(Long questionId) {
        return answerRepository.findByQuestionId(questionId);
    }
}
