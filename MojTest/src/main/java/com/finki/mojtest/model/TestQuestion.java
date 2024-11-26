package com.finki.mojtest.model;

import jakarta.persistence.*;

import java.util.List;

@Entity
public class TestQuestion {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "test_id")
    private Test test;

    @ManyToOne
    @JoinColumn(name = "question_id")
    private Question question;

    @OneToMany(mappedBy = "testQuestion")
    private List<StudentAnswer> studentAnswers;

    // Getters and Setters
}

