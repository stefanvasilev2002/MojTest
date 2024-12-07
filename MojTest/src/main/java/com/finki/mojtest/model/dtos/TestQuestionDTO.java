package com.finki.mojtest.model.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class TestQuestionDTO {

    private Long id;
    private Long testId;      // Mapping to Test's ID
    private Long questionId;  // Mapping to Question's ID
    private List<Long> studentAnswerIds;  // List of StudentAnswer IDs associated with this TestQuestion
}

