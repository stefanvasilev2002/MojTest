package com.finki.mojtest.model.dtos;

import com.finki.mojtest.model.Metadata;
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

    private Long creatorId;  // Store the ID of the teacher (creator)

    private List<Long> questionIds;  // List of Question IDs associated with this Test
    private List<Long> metadataIds;  // List of Metadata IDs associated with this Test
    private List<Long> testQuestionIds;  // List of TestQuestion IDs associated with this Test
    private List<Long> studentTestIds;  // List of StudentTest IDs associated with this Test
    private List<MetadataDTO> metadata; // Add this

}
