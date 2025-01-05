package com.finki.mojtest.model.dtos;

import lombok.Data;

import java.time.LocalDate;
import java.time.LocalTime;

@Data
public class TestAttemptDTO {
    private Long id;
    private int score;
    private double scorePercentage;
    private LocalDate dateTaken;
    private LocalTime timeTaken;
    private int totalPoints;

    public TestAttemptDTO(Long id, int score, int totalPoints, LocalDate dateTaken, LocalTime timeTaken) {
        this.id = id;
        this.score = score;
        this.totalPoints = totalPoints;
        this.scorePercentage = totalPoints > 0 ? (score * 100.0) / totalPoints : 0;
        this.dateTaken = dateTaken;
        this.timeTaken = timeTaken;
    }
}