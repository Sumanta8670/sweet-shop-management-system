package com.sweetshop.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.sweetshop.dto.UserLoginRequest;
import com.sweetshop.dto.UserRegistrationRequest;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import static org.hamcrest.Matchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Integration tests for AuthController.
 */
@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class AuthControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    void testRegisterUser_Success() throws Exception {
        UserRegistrationRequest request = new UserRegistrationRequest();
        request.setUsername("newuser" + System.currentTimeMillis()); // Make username unique
        request.setEmail("newuser" + System.currentTimeMillis() + "@example.com");
        request.setPassword("password123");

        mockMvc.perform(post("/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.username", notNullValue()))
                .andExpect(jsonPath("$.email", notNullValue()))
                .andExpect(jsonPath("$.token", notNullValue()))
                .andExpect(jsonPath("$.role", equalTo("USER")));
    }

    @Test
    void testRegisterUser_InvalidEmail() throws Exception {
        UserRegistrationRequest request = new UserRegistrationRequest();
        request.setUsername("newuser");
        request.setEmail("invalid-email");
        request.setPassword("password123");

        mockMvc.perform(post("/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest());
    }

    @Test
    void testRegisterUser_DuplicateUsername() throws Exception {
        String uniqueUsername = "testuser" + System.currentTimeMillis();

        UserRegistrationRequest request1 = new UserRegistrationRequest();
        request1.setUsername(uniqueUsername);
        request1.setEmail("test1" + System.currentTimeMillis() + "@example.com");
        request1.setPassword("password123");

        // First registration
        mockMvc.perform(post("/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request1)))
                .andExpect(status().isCreated());

        // Second registration with same username
        UserRegistrationRequest request2 = new UserRegistrationRequest();
        request2.setUsername(uniqueUsername);
        request2.setEmail("test2" + System.currentTimeMillis() + "@example.com");
        request2.setPassword("password123");

        mockMvc.perform(post("/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request2)))
                .andExpect(status().isConflict());
    }

    @Test
    void testLoginUser_Success() throws Exception {
        String uniqueUsername = "loginuser" + System.currentTimeMillis();
        String uniqueEmail = "login" + System.currentTimeMillis() + "@example.com";

        // Register user first
        UserRegistrationRequest regRequest = new UserRegistrationRequest();
        regRequest.setUsername(uniqueUsername);
        regRequest.setEmail(uniqueEmail);
        regRequest.setPassword("password123");

        mockMvc.perform(post("/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(regRequest)))
                .andExpect(status().isCreated());

        // Login
        UserLoginRequest loginRequest = new UserLoginRequest();
        loginRequest.setUsername(uniqueUsername);
        loginRequest.setPassword("password123");

        mockMvc.perform(post("/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(loginRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.username", equalTo(uniqueUsername)))
                .andExpect(jsonPath("$.token", notNullValue()));
    }

    @Test
    void testLoginUser_InvalidCredentials() throws Exception {
        UserLoginRequest request = new UserLoginRequest();
        request.setUsername("nonexistent");
        request.setPassword("wrongpassword");

        mockMvc.perform(post("/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isUnauthorized());
    }
}