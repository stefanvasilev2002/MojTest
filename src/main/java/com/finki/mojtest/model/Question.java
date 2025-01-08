package com.finki.mojtest.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.finki.mojtest.model.enumerations.QuestionType;
import com.finki.mojtest.model.users.Teacher;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.Objects;

@Getter
@Setter
@NoArgsConstructor
@Entity
public class Question {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    private QuestionType questionType;
    private String description;
    private int points;
    private int negativePointsPerAnswer;
    private String formula;
    private Boolean isCopy;

    @ManyToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "image_file_id", referencedColumnName = "id")
    private File image;
    private String hint;

    @ManyToMany(mappedBy = "questionBank")
    @JsonIgnore
    private List<Test> tests;

    @ManyToMany
    @JoinTable(
            name = "question_metadata",
            joinColumns = @JoinColumn(name = "question_id"),
            inverseJoinColumns = @JoinColumn(name = "metadata_id")
    )
    @JsonIgnore
    private List<Metadata> metadata;

    @OneToMany(mappedBy = "question")
    @JsonIgnore
    private List<Answer> answers;

    @ManyToOne
    @JoinColumn(name = "teacher_id", nullable = false)
    @JsonIgnore
    private Teacher creator;

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof Question)) return false;
        Question question = (Question) o;
        return Objects.equals(id, question.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id);
    }

    @Override
    public String toString() {
        return "Question{" +
                "id=" + id +
                ", questionType=" + questionType +
                ", description='" + description + '\'' +
                ", points=" + points +
                ", negativePointsPerAnswer=" + negativePointsPerAnswer +
                ", formula='" + formula + '\'' +
                ", hint='" + hint + '\'' +
                '}';
    }
}