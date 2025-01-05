package com.finki.mojtest.model.dtos;

import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class TestResultsDTO {
    private Long studentTestId;
    private String testTitle;
    private List<QuestionResultDTO> questions;
    private double score;
    private double totalPoints;
    private double scorePercentage;
}
