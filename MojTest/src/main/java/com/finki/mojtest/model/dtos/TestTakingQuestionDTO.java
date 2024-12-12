package com.finki.mojtest.model.dtos;

import lombok.Data;

import java.util.List;

@Data
public class TestTakingQuestionDTO {
    private Long id;
    private String description;
    private String type;
    private Integer points;
    private String formula;
    private String imageUrl;
    private String hint;
    private List<TestTakingAnswerDTO> answers;
}