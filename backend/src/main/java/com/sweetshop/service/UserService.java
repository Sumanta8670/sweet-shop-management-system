package com.sweetshop.service;

import com.sweetshop.dto.UserRegistrationRequest;
import com.sweetshop.entity.User;
import com.sweetshop.exception.InvalidCredentialsException;
import com.sweetshop.exception.UserAlreadyExistsException;
import com.sweetshop.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

/**
 * Service for user-related operations.
 * Handles user registration, authentication, and retrieval.
 */
@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    /**
     * Register a new user.
     *
     * @param request the user registration request
     * @return the registered user
     * @throws UserAlreadyExistsException if username or email already exists
     */
    public User registerUser(UserRegistrationRequest request) {
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new UserAlreadyExistsException("Username already exists");
        }

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new UserAlreadyExistsException("Email already exists");
        }

        User user = User.builder()
                .username(request.getUsername())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(User.Role.USER)
                .build();

        return userRepository.save(user);
    }

    /**
     * Authenticate a user with username and password.
     *
     * @param username the username
     * @param password the password
     * @return the authenticated user
     * @throws InvalidCredentialsException if credentials are invalid
     */
    public User authenticateUser(String username, String password) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new InvalidCredentialsException("Invalid username or password"));

        if (!passwordEncoder.matches(password, user.getPassword())) {
            throw new InvalidCredentialsException("Invalid username or password");
        }

        return user;
    }

    /**
     * Get a user by username.
     *
     * @param username the username
     * @return the user
     * @throws InvalidCredentialsException if user is not found
     */
    public User getUserByUsername(String username) {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new InvalidCredentialsException("User not found"));
    }

    /**
     * Get a user by ID.
     *
     * @param id the user ID
     * @return the user
     */
    public User getUserById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new InvalidCredentialsException("User not found"));
    }
}