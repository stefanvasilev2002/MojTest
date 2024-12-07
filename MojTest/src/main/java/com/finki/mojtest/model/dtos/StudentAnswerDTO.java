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
    private Long studentTestId;  // ID of the related StudentTest
    private Long testQuestionId; // ID of the related TestQuestion
    private Long chosenAnswerId; // ID of the related Answer
}

