package com.finki.mojtest.model.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class TestDTO {
    private Long id;
    private String title;
    private String description;
    private int numQuestions;

    private Long creatorId;
    private String name;
    private List<Long> questionIds;
    private List<Long> metadataIds;
    private List<Long> testQuestionIds;
    private List<Long> studentTestIds;
    private List<MetadataDTO> metadata;
    private int timeLimit;
}
