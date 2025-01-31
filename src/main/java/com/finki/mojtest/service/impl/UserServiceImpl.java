package com.finki.mojtest.service.impl;

import com.finki.mojtest.model.PasswordResetToken;
import com.finki.mojtest.model.dtos.UserDTO;
import com.finki.mojtest.model.dtos.auth.UserUpdateRequest;
import com.finki.mojtest.model.exceptions.DuplicateFieldException;
import com.finki.mojtest.model.users.*;
import com.finki.mojtest.repository.PasswordResetTokenRepository;
import com.finki.mojtest.repository.QuestionRepository;
import com.finki.mojtest.repository.StudentTestRepository;
import com.finki.mojtest.repository.TestRepository;
import com.finki.mojtest.repository.users.AdminRepository;
import com.finki.mojtest.repository.users.StudentRepository;
import com.finki.mojtest.repository.users.TeacherRepository;
import com.finki.mojtest.repository.users.UserRepository;
import com.finki.mojtest.service.UserService;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.apache.commons.beanutils.PropertyUtils;

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
    private final StudentTestRepository studentTestRepository;
    private final AdminRepository adminRepository;
    private final TeacherRepository teacherRepository;
    private final TestRepository testRepository;
    private final QuestionRepository questionRepository;

    public UserServiceImpl(UserRepository userRepository, PasswordEncoder passwordEncoder, StudentRepository studentRepository, JavaMailSender emailSender, PasswordResetTokenRepository passwordResetTokenRepository, StudentTestRepository studentTestRepository, AdminRepository adminRepository, TeacherRepository teacherRepository, TestRepository testRepository, QuestionRepository questionRepository) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.studentRepository = studentRepository;
        this.emailSender = emailSender;
        this.passwordResetTokenRepository = passwordResetTokenRepository;
        this.studentTestRepository = studentTestRepository;
        this.adminRepository = adminRepository;
        this.teacherRepository = teacherRepository;
        this.testRepository = testRepository;
        this.questionRepository = questionRepository;
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
    public User createUser(UserDTO userDTO) {
        if (userRepository.findByUsername(userDTO.getUsername()).isPresent()) {
            throw new DuplicateFieldException("Username already exists: " + userDTO.getUsername());
        }

        if (!userRepository.findByEmailList(userDTO.getEmail()).isEmpty()) {
            throw new DuplicateFieldException("Email already exists: " + userDTO.getEmail());
        }

        // Map DTO to entity
        User newUser = mapDtoToUser(userDTO);
        return userRepository.save(newUser);
    }

    private User mapDtoToUser(UserDTO userDTO) {
        String dtype = userDTO.getDtype();
        switch (dtype) {
            case "Student":
                return new Student(
                        userDTO.getUsername(),
                        passwordEncoder.encode(userDTO.getPassword()),
                        userDTO.getEmail(),
                        userDTO.getFullName(),
                        userDTO.getRegistrationDate(),
                        userDTO.getGrade()
                );
            case "Teacher":
                Teacher teacher = new Teacher();
                teacher.setUsername(userDTO.getUsername());
                teacher.setPassword(passwordEncoder.encode(userDTO.getPassword()));
                teacher.setEmail(userDTO.getEmail());
                teacher.setFullName(userDTO.getFullName());
                teacher.setRegistrationDate(userDTO.getRegistrationDate());
                return teacher;
            case "Admin":
                Admin admin = new Admin();
                admin.setUsername(userDTO.getUsername());
                admin.setPassword(passwordEncoder.encode(userDTO.getPassword()));
                admin.setEmail(userDTO.getEmail());
                admin.setFullName(userDTO.getFullName());
                admin.setRegistrationDate(userDTO.getRegistrationDate());
                return admin;
            default:
                throw new IllegalArgumentException("Invalid user type: " + dtype);
        }
    }

    @Override
    public User createUser(User user) {
        if (userRepository.findByUsername(user.getUsername()).isPresent()) {
            throw new DuplicateFieldException("Username already exists: " + user.getUsername());
        }

        if (!userRepository.findByEmailList(user.getEmail()).isEmpty()) {
            throw new DuplicateFieldException("Email already exists: " + user.getEmail());
        }

        // Create the appropriate user type based on dtype
        User newUser;
        String dtype = user.getDtype();

        switch (dtype) {
            case "Student" -> {
                // Extract grade from the user object's properties
                String grade = null;
                try {
                    // Since we can't cast directly, we need to get the grade from the original object's properties
                    grade = (String) PropertyUtils.getProperty(user, "grade");
                } catch (Exception e) {
                    // Handle the case where grade isn't present
                    grade = "";
                }

                newUser = new Student(
                        user.getUsername(),
                        passwordEncoder.encode(user.getPassword()),
                        user.getEmail(),
                        user.getFullName(),
                        user.getRegistrationDate(),
                        grade
                );
            }
            case "Teacher" -> {
                newUser = new Teacher();
                newUser.setUsername(user.getUsername());
                newUser.setPassword(passwordEncoder.encode(user.getPassword()));
                newUser.setEmail(user.getEmail());
                newUser.setFullName(user.getFullName());
                newUser.setRegistrationDate(user.getRegistrationDate());
            }
            case "Admin" -> {
                newUser = new Admin();
                newUser.setUsername(user.getUsername());
                newUser.setPassword(passwordEncoder.encode(user.getPassword()));
                newUser.setEmail(user.getEmail());
                newUser.setFullName(user.getFullName());
                newUser.setRegistrationDate(user.getRegistrationDate());
            }
            default -> throw new IllegalArgumentException("Invalid user type: " + dtype);
        }

        return userRepository.save(newUser);
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
        User existingUser = getUserById(id);

        // Validate username uniqueness
        if (updatedUser.getUsername() != null &&
                !updatedUser.getUsername().equals(existingUser.getUsername()) &&
                userRepository.findByUsername(updatedUser.getUsername()).isPresent()) {
            throw new DuplicateFieldException("Username already exists: " + updatedUser.getUsername());
        }

        // Validate email uniqueness
        if (updatedUser.getEmail() != null &&
                !updatedUser.getEmail().equals(existingUser.getEmail()) &&
                !userRepository.findByEmailList(updatedUser.getEmail()).isEmpty()) {
            throw new DuplicateFieldException("Email already exists: " + updatedUser.getEmail());
        }

        // Check if the user type (dtype) is being changed
        String newDtype = updatedUser.getDtype();
        if (newDtype != null && !newDtype.equals(existingUser.getDtype())) {
            // Create a new user instance of the specified type
            User newUser;

            switch (newDtype) {
                case "Student" -> {
                    String grade = null;
                    try {
                        grade = (String) PropertyUtils.getProperty(updatedUser, "grade");
                    } catch (Exception e) {
                        grade = ""; // Handle missing grade gracefully
                    }

                    newUser = new Student(
                            existingUser.getUsername(),
                            existingUser.getPassword(),
                            updatedUser.getEmail() != null ? updatedUser.getEmail() : existingUser.getEmail(),
                            updatedUser.getFullName() != null ? updatedUser.getFullName() : existingUser.getFullName(),
                            existingUser.getRegistrationDate(),
                            grade
                    );
                }
                case "Teacher" -> {
                    newUser = new Teacher();
                    newUser.setUsername(existingUser.getUsername());
                    newUser.setPassword(existingUser.getPassword());
                    newUser.setEmail(updatedUser.getEmail() != null ? updatedUser.getEmail() : existingUser.getEmail());
                    newUser.setFullName(updatedUser.getFullName() != null ? updatedUser.getFullName() : existingUser.getFullName());
                    newUser.setRegistrationDate(existingUser.getRegistrationDate());
                }
                case "Admin" -> {
                    newUser = new Admin();
                    newUser.setUsername(existingUser.getUsername());
                    newUser.setPassword(existingUser.getPassword());
                    newUser.setEmail(updatedUser.getEmail() != null ? updatedUser.getEmail() : existingUser.getEmail());
                    newUser.setFullName(updatedUser.getFullName() != null ? updatedUser.getFullName() : existingUser.getFullName());
                    newUser.setRegistrationDate(existingUser.getRegistrationDate());
                }
                default -> throw new IllegalArgumentException("Invalid user type: " + newDtype);
            }

            // Delete the old user and save the new user
            userRepository.delete(existingUser);
            return userRepository.save(newUser);
        }

        // Update fields for the same user type
        if (updatedUser.getEmail() != null) {
            existingUser.setEmail(updatedUser.getEmail());
        }
        if (updatedUser.getUsername() != null) {
            existingUser.setUsername(updatedUser.getUsername());
        }
        if (updatedUser.getFullName() != null) {
            existingUser.setFullName(updatedUser.getFullName());
        }
        if (updatedUser.getPassword() != null) {
            existingUser.setPassword(passwordEncoder.encode(updatedUser.getPassword()));
        }

        return userRepository.save(existingUser);
    }

    @Override
    public User updateUser(Long id, UserDTO updatedUser) {
        User existingUser = getUserById(id);

        // Validate username uniqueness (if changed)
        if (updatedUser.getUsername() != null &&
                !updatedUser.getUsername().equals(existingUser.getUsername()) &&
                userRepository.findByUsername(updatedUser.getUsername()).isPresent()) {
            throw new DuplicateFieldException("Username already exists: " + updatedUser.getUsername());
        }

        // Validate email uniqueness (if changed)
        if (updatedUser.getEmail() != null &&
                !updatedUser.getEmail().equals(existingUser.getEmail()) &&
                !userRepository.findByEmailList(updatedUser.getEmail()).isEmpty()) {
            throw new DuplicateFieldException("Email already exists: " + updatedUser.getEmail());
        }

        // Check if the user type (dtype) is being changed
        String newDtype = updatedUser.getDtype();
        if (newDtype != null && !newDtype.equals(existingUser.getDtype())) {
            // Create a new user instance of the specified type
            User newUser;
            // Only use updated data for username and password if present
            String newUsername = updatedUser.getUsername() != null ? updatedUser.getUsername() : existingUser.getUsername();
            String newPassword = updatedUser.getPassword() != null && !updatedUser.getPassword().isEmpty()
                    ? passwordEncoder.encode(updatedUser.getPassword())
                    : existingUser.getPassword();
            switch (newDtype) {
                case "Student" -> {
                    String grade = null;
                    try {
                        grade = updatedUser.getGrade();
                    } catch (Exception e) {
                        grade = "";
                    }

                    newUser = new Student(
                            newUsername,  // Update username if provided
                            newPassword,  // Update password if provided
                            updatedUser.getEmail() != null ? updatedUser.getEmail() : existingUser.getEmail(),
                            updatedUser.getFullName() != null ? updatedUser.getFullName() : existingUser.getFullName(),
                            existingUser.getRegistrationDate(),
                            grade
                    );
                }
                case "Teacher" -> {
                    newUser = new Teacher();
                    newUser.setUsername(newUsername);  // Use updated username
                    newUser.setPassword(newPassword);  // Use updated password
                    newUser.setEmail(updatedUser.getEmail() != null ? updatedUser.getEmail() : existingUser.getEmail());
                    newUser.setFullName(updatedUser.getFullName() != null ? updatedUser.getFullName() : existingUser.getFullName());
                    newUser.setRegistrationDate(existingUser.getRegistrationDate());
                }
                case "Admin" -> {
                    newUser = new Admin();
                    newUser.setUsername(newUsername);
                    newUser.setPassword(newPassword);
                    newUser.setEmail(updatedUser.getEmail() != null ? updatedUser.getEmail() : existingUser.getEmail());
                    newUser.setFullName(updatedUser.getFullName() != null ? updatedUser.getFullName() : existingUser.getFullName());
                    newUser.setRegistrationDate(existingUser.getRegistrationDate());
                }
                default -> throw new IllegalArgumentException("Invalid user type: " + newDtype);
            }

            // Delete the old user and save the new user
            userRepository.delete(existingUser);
            return userRepository.save(newUser);
        }

        // Update fields for the same user type, including optional updates
        if (updatedUser.getEmail() != null) {
            existingUser.setEmail(updatedUser.getEmail());
        }

        // Only update the username if it's provided (non-null)
        if (updatedUser.getUsername() != null && !updatedUser.getUsername().isEmpty()) {
            existingUser.setUsername(updatedUser.getUsername());
        }

        // Only update the full name if it's provided
        if (updatedUser.getFullName() != null && !updatedUser.getFullName().isEmpty()) {
            existingUser.setFullName(updatedUser.getFullName());
        }

        // Only update the password if it's provided and not empty
        if (updatedUser.getPassword() != null && !updatedUser.getPassword().isEmpty()) {
            existingUser.setPassword(passwordEncoder.encode(updatedUser.getPassword())); // Encrypt password if provided
        }

        // Update grade if the user is a student
        if (existingUser instanceof Student student) {

            // Check if grade is not empty
            if (updatedUser.getGrade() != null && !updatedUser.getGrade().isEmpty()) {
                student.setGrade(updatedUser.getGrade());
            }
        }
        return userRepository.save(existingUser);
    }

    @Override
    @Transactional
    public void deleteUser(Long id) {
        User toBeDeletedUser = userRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("User not found with id " + id));

        switch (toBeDeletedUser.getDtype()) {
            case "Student" -> {
                Student student = (Student) toBeDeletedUser;
                if (student.getTakenTests() != null && !student.getTakenTests().isEmpty()) {
                    student.getTakenTests().forEach(test -> {
                        test.setStudent(null);
                        studentTestRepository.save(test);
                    });
                }
                studentRepository.deleteById(id);
            }
            case "Teacher" -> {
                Teacher teacher = (Teacher) toBeDeletedUser;
                // Get default admin for content transfer
                Admin admin = adminRepository.findFirstByOrderById()
                        .orElseThrow(() -> new EntityNotFoundException("No admin found in the system"));

                transferContent(teacher, admin);
                teacherRepository.deleteById(id);
            }
            case "Admin" -> {
                Admin admin = (Admin) toBeDeletedUser;
                if (adminRepository.count() <= 1) {
                    throw new IllegalStateException("Cannot delete the last admin");
                }

                Admin otherAdmin = adminRepository.findFirstByIdNot(admin.getId())
                        .orElseThrow(() -> new EntityNotFoundException("No other admin found"));

                transferContent(admin, otherAdmin);
                adminRepository.deleteById(id);
            }
        }
    }

    private void transferContent(ContentCreator from, ContentCreator to) {
        User toUser = (User) to;

        if (from.getCreatedTests() != null && !from.getCreatedTests().isEmpty()) {
            from.getCreatedTests().forEach(test -> {
                test.setCreator(toUser);
                testRepository.save(test);
            });
        }

        if (from.getCreatedQuestions() != null && !from.getCreatedQuestions().isEmpty()) {
            from.getCreatedQuestions().forEach(question -> {
                question.setCreator(toUser);
                questionRepository.save(question);
            });
        }
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
            String resetUrl = "https://mojtest.finki.edu.mk/reset-password/" + token;
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