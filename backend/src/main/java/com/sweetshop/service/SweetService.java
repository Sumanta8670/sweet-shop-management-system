package com.sweetshop.service;

import com.sweetshop.dto.SweetRequest;
import com.sweetshop.entity.Sweet;
import com.sweetshop.exception.ResourceNotFoundException;
import com.sweetshop.repository.SweetRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;

/**
 * Service for sweet-related operations.
 * Handles sweet management, inventory operations, and searches.
 */
@Service
@RequiredArgsConstructor
public class SweetService {

    private final SweetRepository sweetRepository;

    /**
     * Add a new sweet to the inventory.
     *
     * @param request the sweet request containing details
     * @return the created sweet
     */
    public Sweet addSweet(SweetRequest request) {
        Sweet sweet = Sweet.builder()
                .name(request.getName())
                .category(request.getCategory())
                .price(request.getPrice())
                .quantity(request.getQuantity())
                .description(request.getDescription())
                .build();

        return sweetRepository.save(sweet);
    }

    /**
     * Get all sweets from the inventory.
     *
     * @return list of all sweets
     */
    public List<Sweet> getAllSweets() {
        return sweetRepository.findAll();
    }

    /**
     * Get a sweet by its ID.
     *
     * @param id the sweet ID
     * @return the sweet
     * @throws ResourceNotFoundException if sweet is not found
     */
    public Sweet getSweetById(Long id) {
        return sweetRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Sweet not found with id: " + id));
    }

    /**
     * Update a sweet's details.
     *
     * @param id the sweet ID
     * @param request the updated sweet request
     * @return the updated sweet
     * @throws ResourceNotFoundException if sweet is not found
     */
    public Sweet updateSweet(Long id, SweetRequest request) {
        Sweet sweet = getSweetById(id);

        sweet.setName(request.getName());
        sweet.setCategory(request.getCategory());
        sweet.setPrice(request.getPrice());
        sweet.setQuantity(request.getQuantity());
        sweet.setDescription(request.getDescription());

        return sweetRepository.save(sweet);
    }

    /**
     * Delete a sweet from the inventory.
     *
     * @param id the sweet ID
     * @throws ResourceNotFoundException if sweet is not found
     */
    public void deleteSweet(Long id) {
        if (!sweetRepository.existsById(id)) {
            throw new ResourceNotFoundException("Sweet not found with id: " + id);
        }
        sweetRepository.deleteById(id);
    }

    /**
     * Purchase a sweet, reducing its quantity.
     *
     * @param id the sweet ID
     * @param quantity the quantity to purchase
     * @return the updated sweet
     * @throws ResourceNotFoundException if sweet is not found
     * @throws IllegalArgumentException if quantity is insufficient
     */
    public Sweet purchaseSweet(Long id, Integer quantity) {
        Sweet sweet = getSweetById(id);
        sweet.purchase(quantity);
        return sweetRepository.save(sweet);
    }

    /**
     * Restock a sweet, increasing its quantity.
     *
     * @param id the sweet ID
     * @param quantity the quantity to add
     * @return the updated sweet
     * @throws ResourceNotFoundException if sweet is not found
     */
    public Sweet restockSweet(Long id, Integer quantity) {
        Sweet sweet = getSweetById(id);
        sweet.restock(quantity);
        return sweetRepository.save(sweet);
    }

    /**
     * Search for sweets by name, category, or price range.
     *
     * @param name the name to search for (optional)
     * @param category the category (optional)
     * @param minPrice the minimum price (optional)
     * @param maxPrice the maximum price (optional)
     * @return list of matching sweets
     */
    public List<Sweet> searchSweets(String name, String category, BigDecimal minPrice, BigDecimal maxPrice) {
        return sweetRepository.search(name, category, minPrice, maxPrice);
    }
}
