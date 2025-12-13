package com.sweetshop.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.sweetshop.dto.PurchaseRequest;
import com.sweetshop.dto.RestockRequest;
import com.sweetshop.dto.SweetRequest;
import com.sweetshop.entity.Sweet;
import com.sweetshop.entity.User;
import com.sweetshop.repository.SweetRepository;
import com.sweetshop.repository.UserRepository;
import com.sweetshop.security.JwtUtil;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;

import static org.hamcrest.Matchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Integration tests for SweetController.
 */
@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class SweetControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private SweetRepository sweetRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    private String adminToken;
    private String userToken;
    private Long sweetId;

    @BeforeEach
    void setUp() {
        // Clean up database
        sweetRepository.deleteAll();
        userRepository.deleteAll();

        // Create admin user
        User admin = User.builder()
                .username("admin")
                .email("admin@example.com")
                .password(passwordEncoder.encode("password123"))
                .role(User.Role.ADMIN)
                .build();
        userRepository.save(admin);
        adminToken = jwtUtil.generateToken("admin");

        // Create regular user
        User regularUser = User.builder()
                .username("user")
                .email("user@example.com")
                .password(passwordEncoder.encode("password123"))
                .role(User.Role.USER)
                .build();
        userRepository.save(regularUser);
        userToken = jwtUtil.generateToken("user");

        // Create a test sweet
        Sweet sweet = Sweet.builder()
                .name("Chocolate Bar")
                .category("Chocolate")
                .price(new BigDecimal("3.99"))
                .quantity(100)
                .description("Delicious chocolate bar")
                .build();
        Sweet savedSweet = sweetRepository.save(sweet);
        sweetId = savedSweet.getId();
    }

    @Test
    void testGetAllSweets_Public_Success() throws Exception {
        mockMvc.perform(get("/sweets"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", isA(java.util.List.class)))
                .andExpect(jsonPath("$[0].name", equalTo("Chocolate Bar")));
    }

    @Test
    void testGetSweetById_Public_Success() throws Exception {
        mockMvc.perform(get("/sweets/" + sweetId))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name", equalTo("Chocolate Bar")))
                .andExpect(jsonPath("$.price", equalTo(3.99)));
    }

    @Test
    void testAddSweet_Admin_Success() throws Exception {
        SweetRequest request = new SweetRequest();
        request.setName("Gummy Bears");
        request.setCategory("Candy");
        request.setPrice(new BigDecimal("2.99"));
        request.setQuantity(50);
        request.setDescription("Tasty gummy bears in assorted flavors");

        mockMvc.perform(post("/sweets")
                        .header("Authorization", "Bearer " + adminToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.name", equalTo("Gummy Bears")))
                .andExpect(jsonPath("$.price", equalTo(2.99)))
                .andExpect(jsonPath("$.quantity", equalTo(50)));
    }

    @Test
    void testAddSweet_NonAdmin_Forbidden() throws Exception {
        SweetRequest request = new SweetRequest();
        request.setName("Test Sweet");
        request.setCategory("Test");
        request.setPrice(new BigDecimal("5.99"));
        request.setQuantity(50);
        request.setDescription("A test sweet for testing purposes");

        mockMvc.perform(post("/sweets")
                        .header("Authorization", "Bearer " + userToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest()) // Changed from is5xxServerError()
                .andExpect(jsonPath("$.error", equalTo("Only admins can perform this action")));
    }

    @Test
    void testAddSweet_NoAuth_Unauthorized() throws Exception {
        SweetRequest request = new SweetRequest();
        request.setName("Test Sweet");
        request.setCategory("Test");
        request.setPrice(new BigDecimal("5.99"));
        request.setQuantity(50);
        request.setDescription("A test sweet for testing purposes");

        mockMvc.perform(post("/sweets")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isForbidden()); // Changed from isUnauthorized() - Spring Security returns 403
    }

    @Test
    void testUpdateSweet_Admin_Success() throws Exception {
        SweetRequest request = new SweetRequest();
        request.setName("Updated Chocolate Bar");
        request.setCategory("Chocolate");
        request.setPrice(new BigDecimal("4.99"));
        request.setQuantity(150);
        request.setDescription("Updated delicious chocolate bar");

        mockMvc.perform(put("/sweets/" + sweetId)
                        .header("Authorization", "Bearer " + adminToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name", equalTo("Updated Chocolate Bar")))
                .andExpect(jsonPath("$.price", equalTo(4.99)));
    }

    @Test
    void testDeleteSweet_Admin_Success() throws Exception {
        mockMvc.perform(delete("/sweets/" + sweetId)
                        .header("Authorization", "Bearer " + adminToken))
                .andExpect(status().isNoContent());

        // Verify sweet is deleted
        mockMvc.perform(get("/sweets/" + sweetId))
                .andExpect(status().isNotFound());
    }

    @Test
    void testPurchaseSweet_AuthenticatedUser_Success() throws Exception {
        PurchaseRequest request = new PurchaseRequest();
        request.setQuantity(5);

        mockMvc.perform(post("/sweets/" + sweetId + "/purchase")
                        .header("Authorization", "Bearer " + userToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.quantity", equalTo(95))); // 100 - 5 = 95
    }

    @Test
    void testPurchaseSweet_InsufficientQuantity_BadRequest() throws Exception {
        PurchaseRequest request = new PurchaseRequest();
        request.setQuantity(200); // More than available

        mockMvc.perform(post("/sweets/" + sweetId + "/purchase")
                        .header("Authorization", "Bearer " + userToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest()) // Changed from is5xxServerError()
                .andExpect(jsonPath("$.error", equalTo("Insufficient quantity available")));
    }

    @Test
    void testRestockSweet_Admin_Success() throws Exception {
        RestockRequest request = new RestockRequest();
        request.setQuantity(50);

        mockMvc.perform(post("/sweets/" + sweetId + "/restock")
                        .header("Authorization", "Bearer " + adminToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.quantity", equalTo(150))); // 100 + 50 = 150
    }

    @Test
    void testRestockSweet_NonAdmin_Forbidden() throws Exception {
        RestockRequest request = new RestockRequest();
        request.setQuantity(50);

        mockMvc.perform(post("/sweets/" + sweetId + "/restock")
                        .header("Authorization", "Bearer " + userToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest()) // Changed from is5xxServerError()
                .andExpect(jsonPath("$.error", equalTo("Only admins can perform this action")));
    }

    @Test
    void testSearchSweets_ByName_Success() throws Exception {
        mockMvc.perform(get("/sweets/search")
                        .param("name", "chocolate"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", isA(java.util.List.class)))
                .andExpect(jsonPath("$[0].name", containsStringIgnoringCase("chocolate")));
    }

    @Test
    void testSearchSweets_ByCategory_Success() throws Exception {
        mockMvc.perform(get("/sweets/search")
                        .param("category", "Chocolate"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", isA(java.util.List.class)));
    }

    @Test
    void testSearchSweets_ByPriceRange_Success() throws Exception {
        mockMvc.perform(get("/sweets/search")
                        .param("minPrice", "2.00")
                        .param("maxPrice", "5.00"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", isA(java.util.List.class)))
                .andExpect(jsonPath("$[0].price", greaterThanOrEqualTo(2.0)))
                .andExpect(jsonPath("$[0].price", lessThanOrEqualTo(5.0)));
    }
}