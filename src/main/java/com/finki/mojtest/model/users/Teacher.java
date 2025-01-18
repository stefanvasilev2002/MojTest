package com.finki.mojtest.model.users;

import com.finki.mojtest.model.Question;
import com.finki.mojtest.model.Test;
import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import jakarta.persistence.OneToMany;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@DiscriminatorValue("Teacher")
public class Teacher extends User implements ContentCreator{
    @OneToMany(mappedBy = "creator")
    private List<Test> createdTests;

    @OneToMany(mappedBy = "creator")
    private List<Question> createdQuestions;
}

