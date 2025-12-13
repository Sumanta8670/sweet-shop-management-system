package com.sweetshop.repository;

import com.sweetshop.entity.Sweet;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;

/**
 * Repository for Sweet entity operations.
 */
@Repository
public interface SweetRepository extends JpaRepository<Sweet, Long> {

    /**
     * Find sweets by name containing the search term (case-insensitive).
     *
     * @param name the name to search for
     * @return list of matching sweets
     */
    List<Sweet> findByNameContainingIgnoreCase(String name);

    /**
     * Find sweets by category.
     *
     * @param category the category
     * @return list of sweets in the category
     */
    List<Sweet> findByCategory(String category);

    /**
     * Find sweets by price range.
     *
     * @param minPrice the minimum price
     * @param maxPrice the maximum price
     * @return list of sweets within the price range
     */
    @Query("SELECT s FROM Sweet s WHERE s.price BETWEEN :minPrice AND :maxPrice")
    List<Sweet> findByPriceRange(@Param("minPrice") BigDecimal minPrice,
                                 @Param("maxPrice") BigDecimal maxPrice);

    /**
     * Search for sweets by name, category, or price range.
     *
     * @param name the name to search for
     * @param category the category
     * @param minPrice the minimum price
     * @param maxPrice the maximum price
     * @return list of matching sweets
     */
    @Query("SELECT s FROM Sweet s WHERE " +
            "(:name IS NULL OR s.name ILIKE %:name%) AND " +
            "(:category IS NULL OR s.category = :category) AND " +
            "(:minPrice IS NULL OR s.price >= :minPrice) AND " +
            "(:maxPrice IS NULL OR s.price <= :maxPrice)")
    List<Sweet> search(@Param("name") String name,
                       @Param("category") String category,
                       @Param("minPrice") BigDecimal minPrice,
                       @Param("maxPrice") BigDecimal maxPrice);
}
