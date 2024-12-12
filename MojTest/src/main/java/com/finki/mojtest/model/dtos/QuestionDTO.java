package com.finki.mojtest.model.dtos;

import com.finki.mojtest.model.Metadata;
import com.finki.mojtest.model.users.Teacher;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

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

    private Long creatorId;  // Store the ID of the teacher (creator)

    private List<Long> testIds;  // List of Test IDs associated with this Question
    private List<Long> metadataIds;  // List of Metadata IDs associated with this Question
    private List<Long> answerIds;  // List of Answer IDs related to the Question
}

