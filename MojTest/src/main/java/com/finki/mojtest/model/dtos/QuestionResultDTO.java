package com.finki.mojtest.model.dtos;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class QuestionResultDTO {
    private Long questionId;
    private String description;
    private String questionType;
    private double points;
    private double earnedPoints;
    private String studentAnswer;
    private String correctAnswer;
    private Long imageId;
}