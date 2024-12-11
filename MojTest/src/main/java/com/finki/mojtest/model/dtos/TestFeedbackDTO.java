package com.finki.mojtest.model.dtos;

import lombok.Data;

import java.util.List;

@Data
public class TestFeedbackDTO {
    private Long studentTestId;
    private int totalScore;
    private int maxScore;
    private List<AnswerFeedbackDTO> answerFeedbackList;

    // Getters and setters
}
