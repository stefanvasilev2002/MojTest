package com.finki.mojtest.model.dtos.auth;

import lombok.Data;

@Data
public class UserPasswordDto {
    private Long userId;
    private String password;
    private String newPassword;
}
