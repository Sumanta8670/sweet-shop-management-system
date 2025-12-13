package com.sweetshop.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;

/**
 * DTO for sweet response.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SweetResponse {

    private Long id;
    private String name;
    private String category;
    private BigDecimal price;
    private Integer quantity;
    private String description;
    private Long createdAt;
    private Long updatedAt;
}