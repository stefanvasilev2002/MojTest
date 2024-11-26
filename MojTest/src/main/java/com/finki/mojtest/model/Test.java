package com.finki.mojtest.model;

import com.finki.mojtest.model.users.Teacher;
import jakarta.persistence.*;

import java.util.List;

@Entity
public class Test {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    private String description;
    private int numQuestions;

    @ManyToOne
    @JoinColumn(name = "creator_id")
    private Teacher creator;

    @OneToMany(mappedBy = "test")
    private List<TestQuestion> questions;

    @OneToMany(mappedBy = "test")
    private List<StudentTest> studentTests;

    // Getters and Setters
}
