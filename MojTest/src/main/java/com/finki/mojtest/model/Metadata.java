package com.finki.mojtest.model;

import jakarta.persistence.*;

import java.util.List;

@Entity
public class Metadata {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String key;
    private String value;

    @ManyToMany(mappedBy = "metadata")
    private List<Question> questions;

    // Getters and Setters
}
