package com.finki.mojtest.model.users;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Inheritance(strategy = InheritanceType.SINGLE_TABLE)
@DiscriminatorColumn(name = "role")
@Table(uniqueConstraints = @UniqueConstraint(columnNames = "username"), name = "app_user")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String username;
    private String password;
    private String email;
    private String fullName;
    private LocalDate registrationDate;

    @Transient
    private String role;  // Non-persistent field, used for internal purposes

    @PostLoad
    private void setRoleFromDiscriminator() {
        this.role = this.getClass().getAnnotation(DiscriminatorValue.class).value();
    }
}
