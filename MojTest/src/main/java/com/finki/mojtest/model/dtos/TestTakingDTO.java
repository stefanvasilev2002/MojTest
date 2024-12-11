package com.finki.mojtest.model.dtos;

import lombok.Data;

import java.util.List;

@Data
public class TestTakingDTO {
    private Long studentTestId;
    private String testTitle;
    private Integer timeLimit;
    private List<TestQuestionAnswerDTO> answers; // Changed to match frontend structure
}
