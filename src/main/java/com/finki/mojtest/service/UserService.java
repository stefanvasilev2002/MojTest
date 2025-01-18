package com.finki.mojtest.service;

import com.finki.mojtest.model.dtos.UserDTO;
import com.finki.mojtest.model.dtos.auth.UserUpdateRequest;
import com.finki.mojtest.model.users.User;

import java.util.List;
import java.util.Optional;

public interface UserService {
    User createUserAuth(UserDTO user);
    User createUser(User user);
    User createUser(UserDTO user);
    User getUserById(Long id);
    List<User> getAllUsers();
    User findByUsername(String username);
    User updateUser(Long id, User updatedUser);
    User updateUser(Long id, UserDTO updatedUser);
    void deleteUser(Long id);
    List<User> getUsersByRole(String role);
    User updateUser(UserUpdateRequest userUpdateRequest);
    Optional<User> findById(Long id);
    User findByEmail(String email);
    User changePassword(Long userId, String oldPassword, String newPassword);

    void initiatePasswordReset(String email, String language);

    boolean validateResetToken(String token);

    boolean resetPassword(String token, String newPassword);
}

