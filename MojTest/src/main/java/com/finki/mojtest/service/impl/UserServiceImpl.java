package com.finki.mojtest.service.impl;

import com.finki.mojtest.model.dtos.UserDTO;
import com.finki.mojtest.model.exceptions.DuplicateFieldException;
import com.finki.mojtest.model.users.Admin;
import com.finki.mojtest.model.users.Student;
import com.finki.mojtest.model.users.Teacher;
import com.finki.mojtest.model.users.User;
import com.finki.mojtest.repository.users.StudentRepository;
import com.finki.mojtest.repository.users.UserRepository;
import com.finki.mojtest.service.UserService;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserServiceImpl implements UserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final StudentRepository studentRepository;


    public UserServiceImpl(UserRepository userRepository, PasswordEncoder passwordEncoder, StudentRepository studentRepository) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.studentRepository = studentRepository;
    }

    @Override
    public Student createUserAuth(UserDTO user) {
        if (userRepository.findByUsername(user.getUsername()).isPresent()) {
            throw new DuplicateFieldException("Username already exists: " + user.getUsername());
        }

        if (!userRepository.findByEmail(user.getEmail()).isEmpty()) {
            throw new DuplicateFieldException("Email already exists: " + user.getEmail());
        }
        Student newUser = new Student(user.getUsername(),passwordEncoder.encode(user.getPassword()),
                user.getEmail(),user.getFullName(),user.getRegistrationDate(), user.getGrade());
        return studentRepository.save(newUser);
    }

    @Override
    public User createUser(User user) {
        if (userRepository.findByUsername(user.getUsername()).isPresent()) {
            throw new DuplicateFieldException("Username already exists: " + user.getUsername());
        }

        if (!userRepository.findByEmail(user.getEmail()).isEmpty()) {
            throw new DuplicateFieldException("Email already exists: " + user.getEmail());
        }

        if(user instanceof Teacher){
            user.setDtype("Teacher");
        }
        if(user instanceof Student){
            user.setDtype("Student");
        }
        if (user instanceof Admin){
            user.setDtype("Admin");
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
    public User findByUsername(String username) {
        return userRepository.findByUsername(username).get();
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

    @Override
    public Optional<User> findById(Long id) {
        return Optional.ofNullable(userRepository.findById(id).orElseThrow(() -> new EntityNotFoundException("User not found with id " + id)));
    }
}