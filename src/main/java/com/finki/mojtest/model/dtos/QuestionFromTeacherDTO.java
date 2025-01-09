package com.finki.mojtest.model.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class QuestionFromTeacherDTO {
    private String type;
    private String description;
    private int points;
    private int negativePointsPerAnswer;
    private String formula;
    private String hint;
    private Long creatorId;
    private List<CreateAnswerDTO> answers;
    private List<MetadataDTO> metadata;
    private Boolean isCopy;
    private FileDTO file;
}