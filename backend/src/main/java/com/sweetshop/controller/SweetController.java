package com.sweetshop.controller;

import com.sweetshop.dto.PurchaseRequest;
import com.sweetshop.dto.RestockRequest;
import com.sweetshop.dto.SweetRequest;
import com.sweetshop.dto.SweetResponse;
import com.sweetshop.entity.Sweet;
import com.sweetshop.entity.User;
import com.sweetshop.service.SweetService;
import com.sweetshop.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

/**
 * Controller for sweet management endpoints.
 * Handles operations related to sweets inventory and purchasing.
 */
@RestController
@RequestMapping("/sweets")
@RequiredArgsConstructor
public class SweetController {

    private final SweetService sweetService;
    private final UserService userService;

    /**
     * Add a new sweet (Admin only).
     * POST /api/sweets
     *
     * @param request the sweet request
     * @param authentication the authenticated user
     * @return the created sweet response
     */
    @PostMapping
    public ResponseEntity<SweetResponse> addSweet(
            @Valid @RequestBody SweetRequest request,
            Authentication authentication) {
        verifyAdminRole(authentication);

        Sweet sweet = sweetService.addSweet(request);
        SweetResponse response = mapToResponse(sweet);

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    /**
     * Get all sweets.
     * GET /api/sweets
     *
     * @return list of all sweets
     */
    @GetMapping
    public ResponseEntity<List<SweetResponse>> getAllSweets() {
        List<Sweet> sweets = sweetService.getAllSweets();
        List<SweetResponse> responses = sweets.stream()
                .map(this::mapToResponse)
                .toList();

        return ResponseEntity.ok(responses);
    }

    /**
     * Get a sweet by ID.
     * GET /api/sweets/:id
     *
     * @param id the sweet ID
     * @return the sweet response
     */
    @GetMapping("/{id}")
    public ResponseEntity<SweetResponse> getSweetById(@PathVariable Long id) {
        Sweet sweet = sweetService.getSweetById(id);
        return ResponseEntity.ok(mapToResponse(sweet));
    }

    /**
     * Search for sweets by name, category, or price range.
     * GET /api/sweets/search?name=...&category=...&minPrice=...&maxPrice=...
     *
     * @param name the name to search for
     * @param category the category
     * @param minPrice the minimum price
     * @param maxPrice the maximum price
     * @return list of matching sweets
     */
    @GetMapping("/search")
    public ResponseEntity<List<SweetResponse>> searchSweets(
            @RequestParam(required = false) String name,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) BigDecimal minPrice,
            @RequestParam(required = false) BigDecimal maxPrice) {

        List<Sweet> sweets = sweetService.searchSweets(name, category, minPrice, maxPrice);
        List<SweetResponse> responses = sweets.stream()
                .map(this::mapToResponse)
                .toList();

        return ResponseEntity.ok(responses);
    }

    /**
     * Update a sweet (Admin only).
     * PUT /api/sweets/:id
     *
     * @param id the sweet ID
     * @param request the updated sweet request
     * @param authentication the authenticated user
     * @return the updated sweet response
     */
    @PutMapping("/{id}")
    public ResponseEntity<SweetResponse> updateSweet(
            @PathVariable Long id,
            @Valid @RequestBody SweetRequest request,
            Authentication authentication) {
        verifyAdminRole(authentication);

        Sweet sweet = sweetService.updateSweet(id, request);
        return ResponseEntity.ok(mapToResponse(sweet));
    }

    /**
     * Delete a sweet (Admin only).
     * DELETE /api/sweets/:id
     *
     * @param id the sweet ID
     * @param authentication the authenticated user
     * @return response entity with no content
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSweet(
            @PathVariable Long id,
            Authentication authentication) {
        verifyAdminRole(authentication);

        sweetService.deleteSweet(id);
        return ResponseEntity.noContent().build();
    }

    /**
     * Purchase a sweet (decrease quantity).
     * POST /api/sweets/:id/purchase
     *
     * @param id the sweet ID
     * @param request the purchase request
     * @param authentication the authenticated user
     * @return the updated sweet response
     */
    @PostMapping("/{id}/purchase")
    public ResponseEntity<SweetResponse> purchaseSweet(
            @PathVariable Long id,
            @Valid @RequestBody PurchaseRequest request,
            Authentication authentication) {
        // User must be authenticated
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        Sweet sweet = sweetService.purchaseSweet(id, request.getQuantity());
        return ResponseEntity.ok(mapToResponse(sweet));
    }

    /**
     * Restock a sweet (increase quantity, Admin only).
     * POST /api/sweets/:id/restock
     *
     * @param id the sweet ID
     * @param request the restock request
     * @param authentication the authenticated user
     * @return the updated sweet response
     */
    @PostMapping("/{id}/restock")
    public ResponseEntity<SweetResponse> restockSweet(
            @PathVariable Long id,
            @Valid @RequestBody RestockRequest request,
            Authentication authentication) {
        verifyAdminRole(authentication);

        Sweet sweet = sweetService.restockSweet(id, request.getQuantity());
        return ResponseEntity.ok(mapToResponse(sweet));
    }

    /**
     * Map Sweet entity to SweetResponse DTO.
     *
     * @param sweet the sweet entity
     * @return the sweet response
     */
    private SweetResponse mapToResponse(Sweet sweet) {
        return SweetResponse.builder()
                .id(sweet.getId())
                .name(sweet.getName())
                .category(sweet.getCategory())
                .price(sweet.getPrice())
                .quantity(sweet.getQuantity())
                .description(sweet.getDescription())
                .createdAt(sweet.getCreatedAt())
                .updatedAt(sweet.getUpdatedAt())
                .build();
    }

    /**
     * Verify that the authenticated user has ADMIN role.
     *
     * @param authentication the authentication object
     * @throws IllegalArgumentException if user is not admin
     */
    private void verifyAdminRole(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new IllegalArgumentException("User must be authenticated");
        }

        String username = authentication.getName();
        User user = userService.getUserByUsername(username);

        if (user.getRole() != User.Role.ADMIN) {
            throw new IllegalArgumentException("Only admins can perform this action");
        }
    }
}