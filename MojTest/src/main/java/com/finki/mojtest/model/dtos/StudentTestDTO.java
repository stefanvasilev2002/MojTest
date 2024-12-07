package com.finki.mojtest.model.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class StudentTestDTO {

    private Long id;
    private int score;
    private LocalDate dateTaken;
    private LocalTime timeTaken;
    private Long studentId;  // Mapping to Student's ID
    private Long testId;     // Mapping to Test's ID
    private List<Long> studentAnswerIds;  // List of StudentAnswer IDs associated with this StudentTest
}

