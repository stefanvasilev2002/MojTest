package com.finki.mojtest.model;

import com.finki.mojtest.model.users.Student;
import jakarta.persistence.*;

import java.time.LocalDateTime;
import java.util.List;

@Entity
public class StudentTest {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private int score;
    private LocalDateTime dateTaken;
    private int timeTaken;

    @ManyToOne
    @JoinColumn(name = "student_id")
    private Student student;

    @ManyToOne
    @JoinColumn(name = "test_id")
    private Test test;

    @OneToMany(mappedBy = "studentTest")
    private List<StudentAnswer> answers;

    // Getters and Setters
}

