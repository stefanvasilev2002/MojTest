package com.finki.mojtest.model;

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
public class Test {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    private String description;
    private int numQuestions;

    @ManyToMany
    @JoinTable(
            name = "test_question_bank",
            joinColumns = @JoinColumn(name = "test_id"),
            inverseJoinColumns = @JoinColumn(name = "question_id")
    )
    private List<Question> questionBank;

    @ManyToOne
    @JoinColumn(name = "creator_id")
    private Teacher creator;

    @OneToMany(mappedBy = "test")
    private List<TestQuestion> questions;

    @OneToMany(mappedBy = "test")
    private List<StudentTest> studentTests;

    @ManyToMany
    @JoinTable(
            name = "test_metadata",
            joinColumns = @JoinColumn(name = "test_id"),
            inverseJoinColumns = @JoinColumn(name = "metadata_id")
    )
    private List<Metadata> metadata;
}
