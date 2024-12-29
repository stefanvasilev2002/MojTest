package com.finki.mojtest.model.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class StudentAnswerDTO {

    private Long id;
    private String submittedValue;
    private Long studentTestId;
    private Long testQuestionId;
    private Long chosenAnswerId;
}

