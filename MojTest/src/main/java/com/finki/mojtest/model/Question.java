package com.finki.mojtest.model;

import jakarta.persistence.*;

import java.util.List;

@Entity
public class Question {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String type;
    private String description;
    private int points;
    private int negativePoints;
    private String formula;
    private String imageUrl;
    private String hint;

    @ManyToMany
    @JoinTable(
            name = "question_metadata",
            joinColumns = @JoinColumn(name = "question_id"),
            inverseJoinColumns = @JoinColumn(name = "metadata_id")
    )
    private List<Metadata> metadata;

    @OneToMany(mappedBy = "question")
    private List<Answer> answers;

    // Getters and Setters
}
