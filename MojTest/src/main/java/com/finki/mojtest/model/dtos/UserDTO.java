package com.finki.mojtest.model.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserDTO {

    private Long id;
    private String username;
    private String email;
    private String fullName;
    private LocalDate registrationDate;
    private String role;  // Non-persistent field for internal purposes
}
