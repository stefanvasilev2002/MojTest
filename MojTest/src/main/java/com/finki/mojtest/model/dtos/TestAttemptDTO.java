package com.finki.mojtest.model.dtos;

import lombok.Data;

import java.time.LocalDate;
import java.time.LocalTime;

@Data
public class TestAttemptDTO {
    private Long id;
    private int score;
    private double scorePercentage; // Added field
    private LocalDate dateTaken;
    private LocalTime timeTaken;
    private int totalPoints; // Added field for total possible points

    // Update constructor and add getters/setters
    public TestAttemptDTO(Long id, int score, int totalPoints, LocalDate dateTaken, LocalTime timeTaken) {
        this.id = id;
        this.score = score;
        this.totalPoints = totalPoints;
        this.scorePercentage = totalPoints > 0 ? (score * 100.0) / totalPoints : 0;
        this.dateTaken = dateTaken;
        this.timeTaken = timeTaken;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public int getScore() {
        return score;
    }

    public void setScore(int score) {
        this.score = score;
    }

    public LocalDate getDateTaken() {
        return dateTaken;
    }

    public void setDateTaken(LocalDate dateTaken) {
        this.dateTaken = dateTaken;
    }

    public LocalTime getTimeTaken() {
        return timeTaken;
    }

    public void setTimeTaken(LocalTime timeTaken) {
        this.timeTaken = timeTaken;
    }
}