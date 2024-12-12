package com.finki.mojtest.model.dtos;

import lombok.Data;

import java.util.List;

@Data
public class AnswerFeedbackDTO {
    private Long questionId;
    private boolean correctAnswer;
    private Long submittedAnswerId;
    private String questionText;
    private List<String> correctAnswerText;
    private List<String> submittedAnswerText;
}