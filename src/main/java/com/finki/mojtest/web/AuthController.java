package com.finki.mojtest.web;

import com.finki.mojtest.model.dtos.UserDTO;
import com.finki.mojtest.model.dtos.auth.AuthenticationRequest;
import com.finki.mojtest.model.dtos.auth.AuthenticationResponse;
import com.finki.mojtest.model.dtos.auth.UserPasswordDto;
import com.finki.mojtest.model.dtos.auth.UserUpdateRequest;
import com.finki.mojtest.model.exceptions.DuplicateFieldException;
import com.finki.mojtest.model.users.User;
import com.finki.mojtest.service.UserService;
import com.finki.mojtest.util.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.access.prepost.PreAuthorize;

import java.util.Map;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;
    private final UserService userService;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody UserDTO user) {
        try {
            if (user.getUsername() == null || user.getPassword() == null) {
                return ResponseEntity
                        .status(HttpStatus.BAD_REQUEST)
                        .body(Map.of("message", "Missing required fields"));
            }

            User newUser = userService.createUserAuth(user);
            newUser = userService.getUserById(newUser.getId());
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(user.getUsername(), user.getPassword())
            );

            UserDetails userDetails = (UserDetails) authentication.getPrincipal();
            String jwt = getJwt(userDetails);

            return ResponseEntity.ok(new AuthenticationResponse(jwt, newUser.getDtype().toLowerCase(), user.getFullName()));

        } catch (DuplicateFieldException e) {
            return ResponseEntity
                    .status(HttpStatus.CONFLICT)
                    .body(Map.of("message", e.getMessage()));
        } catch (Exception e) {
            String errorMessage = "Registration failed";
            if (e.getMessage() != null && !e.getMessage().isEmpty()) {
                errorMessage += ": " + e.getMessage();
            }
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", errorMessage));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody AuthenticationRequest request) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword())
            );

            UserDetails userDetails = (UserDetails) authentication.getPrincipal();
            String jwt = getJwt(userDetails);

            User user = userService.findByUsername(request.getUsername());
            String role = user.getDtype();

            return ResponseEntity.ok(new AuthenticationResponse(jwt, role.toLowerCase(), user.getFullName()));

        } catch (BadCredentialsException e) {
            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "Invalid username or password"));
        } catch (Exception e) {
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Login failed: " + e.getMessage()));
        }
    }

    @PutMapping("/update")
    public ResponseEntity<?> updateUser(@RequestBody UserUpdateRequest userUpdateRequest) {
        try {
            User response = userService.updateUser(userUpdateRequest);
            String jwt = getJwt(response);
            return ResponseEntity.ok(jwt);
        } catch (Exception e) {
            // If an error occurs, return error details
            return ResponseEntity.status(500).body("Updating user data failed: " + e.getMessage());
        }
    }
    @PostMapping("/change-password")
//    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> changePassword(@RequestBody UserPasswordDto userPasswordDto) {
        try {
            User authenticatedUser = userService.findById(userPasswordDto.getUserId()).get();

            if (authenticatedUser == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User not authenticated");
            }

            User user = userService.changePassword(
                    authenticatedUser.getId(),
                    userPasswordDto.getPassword(),
                    userPasswordDto.getNewPassword()
            );

            if (user != null) {
                String newJwt = getJwt(user);
                return ResponseEntity.ok(newJwt); // Password change successful
            } else {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Incorrect current password");
            }
        } catch (Exception e) {
            // If an error occurs, return error details
            return ResponseEntity.status(500).body("Updating user data failed: " + e.getMessage());
        }
    }

    private String getJwt(UserDetails userDetails) {
        User user = userService.findByUsername(userDetails.getUsername());
        return jwtUtil.generateToken(userDetails, user.getId(), user.getFullName());
    }
}