package com.finki.mojtest.model;

import jakarta.annotation.Nullable;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
public class StudentAnswer {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Nullable
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

}

