package com.finki.mojtest.model.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CreateAnswerDTO {
    private String answerText;
    private boolean isCorrect;
}