package com.finki.mojtest.model.users;

import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
@Entity
@DiscriminatorValue("Admin")
public class Admin extends User {

}
