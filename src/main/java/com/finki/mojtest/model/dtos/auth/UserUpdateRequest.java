package com.finki.mojtest.model.dtos.auth;

import lombok.Data;

@Data
public class UserUpdateRequest {
    private Long id;
    private String username;
    private String email;
    private String fullName;
    private String grade;
}
