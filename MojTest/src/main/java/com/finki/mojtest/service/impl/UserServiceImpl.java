package com.finki.mojtest.service.impl;

import com.finki.mojtest.model.exceptions.DuplicateFieldException;
import com.finki.mojtest.model.users.Admin;
import com.finki.mojtest.model.users.Student;
import com.finki.mojtest.model.users.Teacher;
import com.finki.mojtest.model.users.User;
import com.finki.mojtest.repository.users.UserRepository;
import com.finki.mojtest.service.UserService;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserServiceImpl implements UserService {
    private final UserRepository userRepository;

    public UserServiceImpl(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public User createUser(User user) {
        if (userRepository.findByUsername(user.getUsername()).isPresent()) {
            throw new DuplicateFieldException("Username already exists: " + user.getUsername());
        }

        if (!userRepository.findByEmail(user.getEmail()).isEmpty()) {
            throw new DuplicateFieldException("Email already exists: " + user.getEmail());
        }
        if (user instanceof Teacher) {
            user.setRole("Teacher");
        } else if (user instanceof Student) {
            user.setRole("Student");
        } else if (user instanceof Admin) {
            user.setRole("Admin");
        }
        return userRepository.save(user);
    }

    @Override
    public User getUserById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("User not found with id " + id));
    }

    @Override
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    @Override
    public User updateUser(Long id, User updatedUser) {
        User user = getUserById(id);

        if (updatedUser.getUsername() != null &&
                !updatedUser.getUsername().equals(user.getUsername())
                && userRepository.findByUsername(updatedUser.getUsername()).isPresent()) {
            throw new DuplicateFieldException("Username already exists: " + updatedUser.getUsername());
        }

        if (updatedUser.getEmail() != null &&
                !updatedUser.getEmail().equals(user.getEmail()) &&
                !userRepository.findByEmail(updatedUser.getEmail()).isEmpty()) {
            throw new DuplicateFieldException("Email already exists: " + updatedUser.getEmail());
        }

        if (updatedUser.getEmail() != null) {
            user.setEmail(updatedUser.getEmail());
        }
        if (updatedUser.getUsername() != null) {
            user.setUsername(updatedUser.getUsername());
        }
        if (updatedUser.getFullName() != null) {
            user.setFullName(updatedUser.getFullName());
        }

        return userRepository.save(user);
    }

    @Override
    public void deleteUser(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("User not found with id " + id));
        userRepository.deleteById(id);
    }

    @Override
    public List<User> getUsersByRole(String role) {
        return userRepository.findByRole(role);
    }
}