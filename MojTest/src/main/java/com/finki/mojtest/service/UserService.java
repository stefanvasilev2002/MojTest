package com.finki.mojtest.service;

import com.finki.mojtest.model.users.User;

import java.util.List;

public interface UserService {
    User createUser(User user);
    User getUserById(Long id);
    List<User> getAllUsers();
    User updateUser(Long id, User updatedUser);
    void deleteUser(Long id);
    List<User> getUsersByRole(String role);
}

