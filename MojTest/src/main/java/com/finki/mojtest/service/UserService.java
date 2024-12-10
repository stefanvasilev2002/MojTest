package com.finki.mojtest.service;

import com.finki.mojtest.model.dtos.UserDTO;
import com.finki.mojtest.model.users.User;

import java.util.List;

public interface UserService {
    User createUserAuth(UserDTO user);
    User createUser(User user);
    User getUserById(Long id);
    List<User> getAllUsers();
    User findByUsername(String username);
    User updateUser(Long id, User updatedUser);
    void deleteUser(Long id);
    List<User> getUsersByRole(String role);
}

