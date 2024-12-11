package com.finki.mojtest.model.dtos;

import lombok.Data;

@Data
public class AnswerFeedbackDTO {
    private Long questionId;
    private boolean correctAnswer;
    private Long submittedAnswerId;
    private String questionText;
    private String correctAnswerText;
    private String submittedAnswerText;
}