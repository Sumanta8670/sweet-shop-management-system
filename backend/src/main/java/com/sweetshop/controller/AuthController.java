package com.sweetshop.controller;

import com.sweetshop.dto.AuthResponse;
import com.sweetshop.dto.UserLoginRequest;
import com.sweetshop.dto.UserRegistrationRequest;
import com.sweetshop.entity.User;
import com.sweetshop.security.JwtUtil;
import com.sweetshop.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * Controller for authentication-related endpoints.
 * Handles user registration and login.
 */
@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final UserService userService;
    private final JwtUtil jwtUtil;

    /**
     * Register a new user.
     * POST /api/auth/register
     *
     * @param request the registration request
     * @return AuthResponse with JWT token
     */
    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody UserRegistrationRequest request) {
        User user = userService.registerUser(request);
        String token = jwtUtil.generateToken(user.getUsername());

        AuthResponse response = AuthResponse.builder()
                .token(token)
                .username(user.getUsername())
                .email(user.getEmail())
                .role(user.getRole().toString())
                .expiresIn(jwtUtil.getExpirationTime())
                .build();

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    /**
     * Login a user.
     * POST /api/auth/login
     *
     * @param request the login request
     * @return AuthResponse with JWT token
     */
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody UserLoginRequest request) {
        User user = userService.authenticateUser(request.getUsername(), request.getPassword());
        String token = jwtUtil.generateToken(user.getUsername());

        AuthResponse response = AuthResponse.builder()
                .token(token)
                .username(user.getUsername())
                .email(user.getEmail())
                .role(user.getRole().toString())
                .expiresIn(jwtUtil.getExpirationTime())
                .build();

        return ResponseEntity.ok(response);
    }
}
