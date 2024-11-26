package com.finki.mojtest.model.users;

import com.finki.mojtest.model.Test;
import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import jakarta.persistence.OneToMany;

import java.util.List;

@Entity
@DiscriminatorValue("Teacher")
public class Teacher extends User {
    @OneToMany(mappedBy = "creator")
    private List<Test> createdTests;

    // Getters and Setters
}

