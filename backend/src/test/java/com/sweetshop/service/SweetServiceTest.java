package com.sweetshop.service;

import com.sweetshop.dto.SweetRequest;
import com.sweetshop.entity.Sweet;
import com.sweetshop.exception.ResourceNotFoundException;
import com.sweetshop.repository.SweetRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

/**
 * Unit tests for SweetService.
 */
@ExtendWith(MockitoExtension.class)
class SweetServiceTest {

    @Mock
    private SweetRepository sweetRepository;

    @InjectMocks
    private SweetService sweetService;

    private Sweet sweet;
    private SweetRequest sweetRequest;

    @BeforeEach
    void setUp() {
        sweet = Sweet.builder()
                .id(1L)
                .name("Chocolate Bar")
                .category("Chocolate")
                .price(new BigDecimal("2.99"))
                .quantity(100)
                .description("Delicious chocolate bar with nuts")
                .build();

        sweetRequest = new SweetRequest();
        sweetRequest.setName("Chocolate Bar");
        sweetRequest.setCategory("Chocolate");
        sweetRequest.setPrice(new BigDecimal("2.99"));
        sweetRequest.setQuantity(100);
        sweetRequest.setDescription("Delicious chocolate bar with nuts");
    }

    @Test
    void testAddSweet_Success() {
        // Arrange
        when(sweetRepository.save(any(Sweet.class))).thenReturn(sweet);

        // Act
        Sweet result = sweetService.addSweet(sweetRequest);

        // Assert
        assertNotNull(result);
        assertEquals("Chocolate Bar", result.getName());
        assertEquals(new BigDecimal("2.99"), result.getPrice());
        verify(sweetRepository, times(1)).save(any(Sweet.class));
    }

    @Test
    void testGetAllSweets_Success() {
        // Arrange
        Sweet sweet2 = Sweet.builder().id(2L).name("Candy").category("Hard Candy").build();
        List<Sweet> sweets = Arrays.asList(sweet, sweet2);
        when(sweetRepository.findAll()).thenReturn(sweets);

        // Act
        List<Sweet> result = sweetService.getAllSweets();

        // Assert
        assertNotNull(result);
        assertEquals(2, result.size());
        verify(sweetRepository, times(1)).findAll();
    }

    @Test
    void testGetSweetById_Success() {
        // Arrange
        when(sweetRepository.findById(1L)).thenReturn(Optional.of(sweet));

        // Act
        Sweet result = sweetService.getSweetById(1L);

        // Assert
        assertNotNull(result);
        assertEquals(1L, result.getId());
        assertEquals("Chocolate Bar", result.getName());
    }

    @Test
    void testGetSweetById_NotFound() {
        // Arrange
        when(sweetRepository.findById(1L)).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(ResourceNotFoundException.class, () -> {
            sweetService.getSweetById(1L);
        });
    }

    @Test
    void testUpdateSweet_Success() {
        // Arrange
        SweetRequest updateRequest = new SweetRequest();
        updateRequest.setName("Updated Chocolate Bar");
        updateRequest.setCategory("Chocolate");
        updateRequest.setPrice(new BigDecimal("3.99"));
        updateRequest.setQuantity(150);
        updateRequest.setDescription("Updated description");

        when(sweetRepository.findById(1L)).thenReturn(Optional.of(sweet));
        when(sweetRepository.save(any(Sweet.class))).thenReturn(sweet);

        // Act
        Sweet result = sweetService.updateSweet(1L, updateRequest);

        // Assert
        assertNotNull(result);
        verify(sweetRepository, times(1)).findById(1L);
        verify(sweetRepository, times(1)).save(any(Sweet.class));
    }

    @Test
    void testUpdateSweet_NotFound() {
        // Arrange
        when(sweetRepository.findById(1L)).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(ResourceNotFoundException.class, () -> {
            sweetService.updateSweet(1L, sweetRequest);
        });
    }

    @Test
    void testDeleteSweet_Success() {
        // Arrange
        when(sweetRepository.findById(1L)).thenReturn(Optional.of(sweet));
        doNothing().when(sweetRepository).delete(sweet);

        // Act
        sweetService.deleteSweet(1L);

        // Assert
        verify(sweetRepository, times(1)).findById(1L);
        verify(sweetRepository, times(1)).delete(sweet);
    }

    @Test
    void testDeleteSweet_NotFound() {
        // Arrange
        when(sweetRepository.findById(1L)).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(ResourceNotFoundException.class, () -> {
            sweetService.deleteSweet(1L);
        });

        verify(sweetRepository, times(1)).findById(1L);
        verify(sweetRepository, never()).delete(any(Sweet.class));
    }

    @Test
    void testPurchaseSweet_Success() {
        // Arrange
        when(sweetRepository.findById(1L)).thenReturn(Optional.of(sweet));
        when(sweetRepository.save(any(Sweet.class))).thenReturn(sweet);

        // Act
        Sweet result = sweetService.purchaseSweet(1L, 10);

        // Assert
        assertNotNull(result);
        verify(sweetRepository, times(1)).findById(1L);
        verify(sweetRepository, times(1)).save(any(Sweet.class));
    }

    @Test
    void testPurchaseSweet_InsufficientQuantity() {
        // Arrange
        when(sweetRepository.findById(1L)).thenReturn(Optional.of(sweet));

        // Act & Assert
        assertThrows(IllegalArgumentException.class, () -> {
            sweetService.purchaseSweet(1L, 101);
        });
    }

    @Test
    void testRestockSweet_Success() {
        // Arrange
        when(sweetRepository.findById(1L)).thenReturn(Optional.of(sweet));
        when(sweetRepository.save(any(Sweet.class))).thenReturn(sweet);

        // Act
        Sweet result = sweetService.restockSweet(1L, 50);

        // Assert
        assertNotNull(result);
        verify(sweetRepository, times(1)).findById(1L);
        verify(sweetRepository, times(1)).save(any(Sweet.class));
    }

    @Test
    void testSearchSweets_ByName() {
        // Arrange
        List<Sweet> sweets = Arrays.asList(sweet);
        when(sweetRepository.search("Chocolate", null, null, null)).thenReturn(sweets);

        // Act
        List<Sweet> result = sweetService.searchSweets("Chocolate", null, null, null);

        // Assert
        assertNotNull(result);
        assertEquals(1, result.size());
        verify(sweetRepository, times(1)).search("Chocolate", null, null, null);
    }
}