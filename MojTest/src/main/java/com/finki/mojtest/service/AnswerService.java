package com.finki.mojtest.service;

import com.finki.mojtest.model.Answer;

import java.util.List;

public interface AnswerService {
    Answer createAnswer(Answer answer);
    Answer getAnswerById(Long id);
    List<Answer> getAllAnswers();
    Answer updateAnswer(Long id, Answer updatedAnswer);
    void deleteAnswer(Long id);
    List<Answer> getAnswersByQuestionId(Long questionId);
}

