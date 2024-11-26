package com.finki.mojtest.model.users;

import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;

@Entity
@DiscriminatorValue("Admin")
public class Admin extends User {
    // Additional Admin-specific fields if needed
}
