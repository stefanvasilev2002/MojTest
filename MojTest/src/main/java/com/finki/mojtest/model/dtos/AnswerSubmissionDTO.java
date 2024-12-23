package com.finki.mojtest.model.dtos;

import com.finki.mojtest.model.enumerations.QuestionType;
import lombok.Data;

@Data
public class AnswerSubmissionDTO {
    private Long questionId;
    private Long answerId;
    private String textAnswer;
    private QuestionType questionType; // Add this field
}
