package com.finki.mojtest.model.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

import lombok.Data;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Data
public class StudentTestDTO {
    private Long id;
    private int score;
    private LocalDate dateTaken;
    private LocalTime timeTaken;
    private Long studentId;
    private Long testId;
    private List<StudentAnswerDTO> answers;
}

