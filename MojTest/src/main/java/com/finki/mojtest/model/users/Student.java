package com.finki.mojtest.model.users;

import com.finki.mojtest.model.StudentTest;
import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import jakarta.persistence.OneToMany;

import java.util.List;

@Entity
@DiscriminatorValue("Student")
public class Student extends User {
    private String grade;

    @OneToMany(mappedBy = "student")
    private List<StudentTest> takenTests;

    // Getters and Setters
}

