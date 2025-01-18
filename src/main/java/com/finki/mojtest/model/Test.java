package com.finki.mojtest.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.finki.mojtest.model.users.Teacher;
import com.finki.mojtest.model.users.User;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
public class Test {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    private String description;
    private int numQuestions;
    private int timeLimit = 60;
    @ManyToMany
    @JoinTable(
            name = "test_question_bank",
            joinColumns = @JoinColumn(name = "test_id"),
            inverseJoinColumns = @JoinColumn(name = "question_id")
    )
    @JsonIgnore
    private List<Question> questionBank;

    @ManyToOne
    @JoinColumn(name = "creator_id")
    @JsonIgnore
    private User creator;

    @OneToMany(mappedBy = "test")
    @JsonIgnore
    private List<TestQuestion> questions;

    @OneToMany(mappedBy = "test")
    @JsonIgnore
    private List<StudentTest> studentTests;

    @ManyToMany
    @JoinTable(
            name = "test_metadata",
            joinColumns = @JoinColumn(name = "test_id"),
            inverseJoinColumns = @JoinColumn(name = "metadata_id")
    )
    @JsonIgnore
    private List<Metadata> metadata;
    private LocalDate createdDate;
    @PrePersist
    protected void onCreate() {
        createdDate = LocalDate.now();
    }
}
