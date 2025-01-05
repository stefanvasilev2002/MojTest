package com.finki.mojtest.model.dtos;

import lombok.Data;

@Data
public class TestQuestionAnswerDTO {
    private Long id;
    private TestQuestionDTO testQuestion;
    private AnswerDTO chosenAnswer;
}