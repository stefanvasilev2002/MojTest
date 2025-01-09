package com.finki.mojtest.model.dtos;

import com.finki.mojtest.model.File;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class QuestionDTO {
    private Long id;

    private String type;
    private String description;
    private int points;
    private int negativePointsPerAnswer;
    private String formula;
    private FileDTO image;
    private String hint;

    private Long creatorId;
    private String name;
    private List<Long> testIds;
    private List<Long> answerIds;
    private List<AnswerDTO> answers;

    private List<MetadataDTO> metadata;
    private FileDTO file;
    private Boolean isCopy;
}

