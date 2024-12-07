package com.finki.mojtest.model.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AnswerDTO {

    private Long id;
    private String answerText;
    private boolean isCorrect;
    private Long questionId; // Mapping to Question's ID
    private List<Long> studentAnswerIds; // Mapping to list of StudentAnswer IDs
}

