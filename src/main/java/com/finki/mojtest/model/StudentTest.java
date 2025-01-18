package com.finki.mojtest.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.finki.mojtest.model.users.Student;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
public class StudentTest {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private int score;
    private LocalDate dateTaken;
    private LocalTime timeTaken;

    @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "student_id", nullable = true)
    private Student student;

    @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "test_id")
    private Test test;

    @JsonIgnore
    @OneToMany(mappedBy = "studentTest")
    private List<StudentAnswer> answers;
    private LocalDateTime startTime;
    private LocalDateTime endTime;

    @Transient
    public Long getDurationInMinutes() {
        if (startTime == null || endTime == null) return null;
        return ChronoUnit.MINUTES.between(startTime, endTime);
    }
}

