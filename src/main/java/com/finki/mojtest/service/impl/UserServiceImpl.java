package com.finki.mojtest.service.impl;

import com.finki.mojtest.model.PasswordResetToken;
import com.finki.mojtest.model.dtos.UserDTO;
import com.finki.mojtest.model.dtos.auth.UserUpdateRequest;
import com.finki.mojtest.model.exceptions.DuplicateFieldException;
import com.finki.mojtest.model.users.Admin;
import com.finki.mojtest.model.users.Student;
import com.finki.mojtest.model.users.Teacher;
import com.finki.mojtest.model.users.User;
import com.finki.mojtest.repository.PasswordResetTokenRepository;
import com.finki.mojtest.repository.users.StudentRepository;
import com.finki.mojtest.repository.users.UserRepository;
import com.finki.mojtest.service.UserService;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class UserServiceImpl implements UserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final StudentRepository studentRepository;
    private final JavaMailSender emailSender;
    private final PasswordResetTokenRepository passwordResetTokenRepository;
    @Value("${app.mail.from}")
    private String fromEmail;
    @Value("classpath:email-templates/reset-password-en.html")
    private Resource resetTemplateEn;

    @Value("classpath:email-templates/reset-password-mk.html")
    private Resource resetTemplateMk;

    @Value("classpath:email-templates/reset-password-al.html")
    private Resource resetTemplateAl;
    public UserServiceImpl(UserRepository userRepository, PasswordEncoder passwordEncoder, StudentRepository studentRepository, JavaMailSender emailSender, PasswordResetTokenRepository passwordResetTokenRepository) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.studentRepository = studentRepository;
        this.emailSender = emailSender;
        this.passwordResetTokenRepository = passwordResetTokenRepository;
    }

    @Override
    public Student createUserAuth(UserDTO user) {
        if (userRepository.findByUsername(user.getUsername()).isPresent()) {
            throw new DuplicateFieldException("Username already exists: " + user.getUsername());
        }

        if (!userRepository.findByEmailList(user.getEmail()).isEmpty()) {
            throw new DuplicateFieldException("Email already exists: " + user.getEmail());
        }
        Student newUser = new Student(user.getUsername(), passwordEncoder.encode(user.getPassword()),
                user.getEmail(), user.getFullName(), user.getRegistrationDate(), user.getGrade());
        return studentRepository.save(newUser);
    }

    @Override
    public User createUser(User user) {
        if (userRepository.findByUsername(user.getUsername()).isPresent()) {
            throw new DuplicateFieldException("Username already exists: " + user.getUsername());
        }

        if (!userRepository.findByEmailList(user.getEmail()).isEmpty()) {
            throw new DuplicateFieldException("Email already exists: " + user.getEmail());
        }

        if (user instanceof Teacher) {
            user.setDtype("Teacher");
        }
        if (user instanceof Student) {
            user.setDtype("Student");
        }
        if (user instanceof Admin) {
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
                !userRepository.findByEmailList(updatedUser.getEmail()).isEmpty()) {
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
        userRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("User not found with id " + id));
        userRepository.deleteById(id);
    }

    @Override
    public List<User> getUsersByRole(String role) {
        return userRepository.findByRole(role);
    }

    @Override
    public User updateUser(UserUpdateRequest updatedUser) {
        User user = getUserById(updatedUser.getId());

        if (updatedUser.getUsername() != null &&
                !updatedUser.getUsername().equals(user.getUsername())
                && userRepository.findByUsername(updatedUser.getUsername()).isPresent()) {
            throw new DuplicateFieldException("Username already exists: " + updatedUser.getUsername());
        }

        if (updatedUser.getEmail() != null &&
                !updatedUser.getEmail().equals(user.getEmail()) &&
                !userRepository.findByEmailList(updatedUser.getEmail()).isEmpty()) {
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
        if (user instanceof Student) {
            Student student = (Student) user;  // Cast to Student

            // Check if grade is not empty
            if (student.getGrade() != null && !student.getGrade().isEmpty()) {
                student.setGrade(updatedUser.getGrade());
            }
        }
        return userRepository.save(user);
    }

    @Override
    public Optional<User> findById(Long id) {
        return Optional.ofNullable(userRepository.findById(id).orElseThrow(() -> new EntityNotFoundException("User not found with id " + id)));
    }

    @Override
    public User findByEmail(String email) {
        return userRepository.findByEmailList(email).getFirst();
    }

    @Override
    public User changePassword(Long userId, String oldPassword, String newPassword) {
        User user = userRepository.findById(userId).orElseThrow();
        if (passwordEncoder.matches(oldPassword, user.getPassword())) {
            user.setPassword(passwordEncoder.encode(newPassword));
            return userRepository.save(user);
        } else {
            throw new RuntimeException("Old password is incorrect"); // Handle incorrect password scenario
        }
    }
    @Override
    public void initiatePasswordReset(String email, String language) {
        Optional<User> userOptional = userRepository.findByEmail(email);

        if (userOptional.isEmpty()) {
            return;
        }

        User user = userOptional.get();
        String token = generateResetToken();

        PasswordResetToken resetToken = new PasswordResetToken();
        resetToken.setToken(token);
        resetToken.setUser(user);
        resetToken.setExpiryDate(LocalDateTime.now().plusHours(24));
        passwordResetTokenRepository.save(resetToken);

        sendPasswordResetEmail(user.getEmail(), token, language);
    }
    @Override
    public boolean validateResetToken(String token) {
        Optional<PasswordResetToken> tokenOptional = passwordResetTokenRepository.findByToken(token);

        if (tokenOptional.isEmpty()) {
            return false;
        }

        PasswordResetToken resetToken = tokenOptional.get();
        return !isTokenExpired(resetToken);
    }

    @Override
    public boolean resetPassword(String token, String newPassword) {
        Optional<PasswordResetToken> tokenOptional = passwordResetTokenRepository.findByToken(token);

        if (tokenOptional.isEmpty() || isTokenExpired(tokenOptional.get())) {
            return false;
        }

        PasswordResetToken resetToken = tokenOptional.get();
        User user = resetToken.getUser();

        // Update password
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);

        // Delete used token
        passwordResetTokenRepository.delete(resetToken);

        return true;
    }

    private boolean isTokenExpired(PasswordResetToken token) {
        return token.getExpiryDate().isBefore(LocalDateTime.now());
    }

    private String generateResetToken() {
        return UUID.randomUUID().toString();
    }

    private void sendPasswordResetEmail(String email, String token, String language) {
        try {
            MimeMessage mimeMessage = emailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true, "UTF-8");

            helper.setFrom(fromEmail);
            helper.setTo(email);
            helper.setSubject(getSubjectByLanguage(language));

            // Read the appropriate template
            String htmlContent = getEmailTemplate(language);

            // Replace placeholders
            String resetUrl = "https://mojtest-mk.onrender.com/reset-password/" + token;
            htmlContent = htmlContent
                    .replace("{{resetUrl}}", resetUrl)
                    .replace("{{expiryHours}}", "24");

            helper.setText(htmlContent, true); // true indicates HTML content

            emailSender.send(mimeMessage);
        } catch (MessagingException e) {
            throw new RuntimeException("Failed to send email", e);
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }
    private String getSubjectByLanguage(String language) {
        return switch (language) {
            case "mk" -> "Барање за ресетирање на лозинка";
            case "al" -> "Kërkesë për rivendosjen e fjalëkalimit";
            default -> "Password Reset Request";
        };
    }

    private String getEmailTemplate(String language) throws IOException {
        Resource template = switch (language) {
            case "mk" -> resetTemplateMk;
            case "al" -> resetTemplateAl;
            default -> resetTemplateEn;
        };

        return new String(template.getInputStream().readAllBytes(), StandardCharsets.UTF_8);
    }
}