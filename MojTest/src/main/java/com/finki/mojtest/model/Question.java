package com.finki.mojtest.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.finki.mojtest.model.users.Teacher;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
public class Question {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String type;
    private String description;
    private int points;
    private int negativePointsPerAnswer;
    private String formula;
    private String imageUrl;
    private String hint;

    @ManyToMany(mappedBy = "questionBank")
    @JsonIgnore  // Prevents recursion when serializing Test
    private List<Test> tests;

    @ManyToMany
    @JoinTable(
            name = "question_metadata",
            joinColumns = @JoinColumn(name = "question_id"),
            inverseJoinColumns = @JoinColumn(name = "metadata_id")
    )
    @JsonIgnore  // Prevents recursion when serializing Metadata
    private List<Metadata> metadata;

    @OneToMany(mappedBy = "question")
    @JsonIgnore  // Prevents recursion when serializing Answer
    private List<Answer> answers;

    @ManyToOne
    @JoinColumn(name = "teacher_id", nullable = false)
    @JsonIgnore  // Prevents recursion when serializing Question's creator (Teacher)
    private Teacher creator;

}
