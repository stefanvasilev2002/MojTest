package com.finki.mojtest.model.dtos;

import lombok.Data;

import java.util.List;

@Data
public class TestTakingViewDTO {
    private Long studentTestId;
    private String testTitle;
    private Integer timeLimit;
    private List<TestQuestionViewDTO> questions;
}