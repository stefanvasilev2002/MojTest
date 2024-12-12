package com.finki.mojtest.model.dtos;

import lombok.Data;

import java.util.List;

@Data
public class TestQuestionViewDTO {
    private Long questionId;
    private Long testQuestionId;
    private String description;
    private Integer points;
    private List<AnswerViewDTO> possibleAnswers;
    private Long studentAnswerId; // ID of the StudentAnswer record for this question
}