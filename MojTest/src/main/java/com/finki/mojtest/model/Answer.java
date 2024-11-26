package com.finki.mojtest.model;

import jakarta.persistence.*;

import java.util.List;

@Entity
public class Answer {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String answerText;
    private boolean isCorrect;

    @ManyToOne
    @JoinColumn(name = "question_id")
    private Question question;

    @OneToMany(mappedBy = "chosenAnswer")
    private List<StudentAnswer> chosenBy;

    // Getters and Setters
}

