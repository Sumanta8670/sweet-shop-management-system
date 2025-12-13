package com.sweetshop.entity;

import org.junit.jupiter.api.Test;
import java.math.BigDecimal;
import static org.junit.jupiter.api.Assertions.*;

class SweetTest {

    @Test
    void testPurchase_Success() {
        Sweet sweet = Sweet.builder()
                .name("Chocolate")
                .quantity(100)
                .price(new BigDecimal("5.99"))
                .build();

        sweet.purchase(10);

        assertEquals(90, sweet.getQuantity());
    }

    @Test
    void testPurchase_InsufficientQuantity() {
        Sweet sweet = Sweet.builder()
                .name("Chocolate")
                .quantity(5)
                .price(new BigDecimal("5.99"))
                .build();

        assertThrows(IllegalArgumentException.class, () -> {
            sweet.purchase(10);
        });
    }

    @Test
    void testRestock_Success() {
        Sweet sweet = Sweet.builder()
                .name("Chocolate")
                .quantity(100)
                .price(new BigDecimal("5.99"))
                .build();

        sweet.restock(50);

        assertEquals(150, sweet.getQuantity());
    }

    @Test
    void testPrePersist() {
        Sweet sweet = new Sweet();
        sweet.onCreate();

        assertNotNull(sweet.getCreatedAt());
        assertNotNull(sweet.getUpdatedAt());
    }

    @Test
    void testPreUpdate() {
        Sweet sweet = new Sweet();
        sweet.onCreate();
        Long originalUpdatedAt = sweet.getUpdatedAt();

        // Simulate time passing
        try {
            Thread.sleep(10);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }

        sweet.onUpdate();

        assertTrue(sweet.getUpdatedAt() > originalUpdatedAt);
    }
}