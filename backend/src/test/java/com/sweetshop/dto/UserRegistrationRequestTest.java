package com.sweetshop.dto;

import jakarta.validation.ConstraintViolation;
import jakarta.validation.Validation;
import jakarta.validation.Validator;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import java.util.Set;
import static org.junit.jupiter.api.Assertions.*;

class UserRegistrationRequestTest {

    private Validator validator;

    @BeforeEach
    void setUp() {
        validator = Validation.buildDefaultValidatorFactory().getValidator();
    }

    @Test
    void testValidRequest() {
        UserRegistrationRequest request = new UserRegistrationRequest();
        request.setUsername("testuser");
        request.setEmail("test@example.com");
        request.setPassword("password123");

        Set<ConstraintViolation<UserRegistrationRequest>> violations = validator.validate(request);

        assertTrue(violations.isEmpty());
    }

    @Test
    void testInvalidEmail() {
        UserRegistrationRequest request = new UserRegistrationRequest();
        request.setUsername("testuser");
        request.setEmail("invalid-email");
        request.setPassword("password123");

        Set<ConstraintViolation<UserRegistrationRequest>> violations = validator.validate(request);

        assertFalse(violations.isEmpty());
    }

    @Test
    void testShortUsername() {
        UserRegistrationRequest request = new UserRegistrationRequest();
        request.setUsername("ab"); // Too short
        request.setEmail("test@example.com");
        request.setPassword("password123");

        Set<ConstraintViolation<UserRegistrationRequest>> violations = validator.validate(request);

        assertFalse(violations.isEmpty());
    }

    @Test
    void testShortPassword() {
        UserRegistrationRequest request = new UserRegistrationRequest();
        request.setUsername("testuser");
        request.setEmail("test@example.com");
        request.setPassword("12345"); // Too short

        Set<ConstraintViolation<UserRegistrationRequest>> violations = validator.validate(request);

        assertFalse(violations.isEmpty());
    }
}