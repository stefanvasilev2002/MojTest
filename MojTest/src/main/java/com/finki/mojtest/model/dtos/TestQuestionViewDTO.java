package com.finki.mojtest.model.dtos;

import lombok.Data;

import java.util.List;

@Data
public class TestQuestionViewDTO {
    private Long questionId;
    private Long testQuestionId;
    private String description;
    private Integer points;
    private String questionType;
    private List<AnswerViewDTO> possibleAnswers;
    private Long studentAnswerId;
    private String hint;
    private Long imageId;
}