package com.finki.mojtest.model.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class TestFromTeacherDTO {
    private Long id;
    private String title;
    private String description;
    private int numQuestions;
    private int timeLimit;
    private Long creatorId;
    private List<MetadataDTO> metadata;
}
