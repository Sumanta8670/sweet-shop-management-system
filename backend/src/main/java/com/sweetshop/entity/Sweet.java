package com.sweetshop.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;

/**
 * Sweet entity representing a product in the sweet shop.
 * Each sweet has a unique ID, name, category, price, and quantity in stock.
 */
@Entity
@Table(name = "sweets")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Sweet {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String category;

    @Column(nullable = false)
    private BigDecimal price;

    @Column(nullable = false)
    private Integer quantity;

    @Column(nullable = false)
    private String description;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Long createdAt;

    @Column(name = "updated_at")
    private Long updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = System.currentTimeMillis();
        updatedAt = System.currentTimeMillis();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = System.currentTimeMillis();
    }

    /**
     * Purchase a sweet by reducing its quantity.
     *
     * @param quantity the quantity to purchase
     * @throws IllegalArgumentException if quantity is insufficient
     */
    public void purchase(Integer quantity) {
        if (this.quantity < quantity) {
            throw new IllegalArgumentException("Insufficient quantity available");
        }
        this.quantity -= quantity;
    }

    /**
     * Restock a sweet by increasing its quantity.
     *
     * @param quantity the quantity to add
     */
    public void restock(Integer quantity) {
        this.quantity += quantity;
    }
}