package com.finki.mojtest.model.dtos;

import com.finki.mojtest.model.enumerations.QuestionType;
import lombok.Data;

import java.util.List;

@Data
public class AnswerSubmissionDTO {
    private Long questionId;
    private List<Long> answerIds;
    private String textAnswer;
    private QuestionType questionType;
}
