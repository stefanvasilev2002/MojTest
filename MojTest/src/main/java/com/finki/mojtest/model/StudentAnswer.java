package com.finki.mojtest.model;

import jakarta.persistence.*;

@Entity
public class StudentAnswer {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String submittedValue;

    @ManyToOne
    @JoinColumn(name = "student_test_id")
    private StudentTest studentTest;

    @ManyToOne
    @JoinColumn(name = "test_question_id")
    private TestQuestion testQuestion;

    @ManyToOne
    @JoinColumn(name = "answer_id")
    private Answer chosenAnswer;

    // Getters and Setters
}

