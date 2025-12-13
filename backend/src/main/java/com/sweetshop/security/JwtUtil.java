package com.sweetshop.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;

/**
 * Utility class for JWT token generation and validation.
 */
@Component
public class JwtUtil {

    @Value("${jwt.secret}")
    private String jwtSecret;

    @Value("${jwt.expiration}")
    private long jwtExpirationMs;

    /**
     * Generate JWT token for a user.
     *
     * @param username the username for which to generate the token
     * @return the JWT token
     */
    public String generateToken(String username) {
        return Jwts.builder()
                .subject(username)
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + jwtExpirationMs))
                .signWith(getSigningKey())  // SignatureAlgorithm is no longer needed
                .compact();
    }

    /**
     * Extract username from JWT token.
     *
     * @param token the JWT token
     * @return the username
     */
    public String extractUsername(String token) {
        return getAllClaimsFromToken(token).getSubject();
    }

    /**
     * Validate JWT token.
     *
     * @param token the JWT token
     * @return true if token is valid, false otherwise
     */
    public boolean validateToken(String token) {
        try {
            Jwts.parser()
                    .verifyWith(getSigningKey())  // Changed from setSigningKey
                    .build()
                    .parseSignedClaims(token);  // Changed from parseClaimsJws
            return true;
        } catch (Exception ex) {
            return false;
        }
    }

    /**
     * Get all claims from JWT token.
     *
     * @param token the JWT token
     * @return the claims
     */
    private Claims getAllClaimsFromToken(String token) {
        return Jwts.parser()
                .verifyWith(getSigningKey())  // Changed from setSigningKey
                .build()
                .parseSignedClaims(token)  // Changed from parseClaimsJws
                .getPayload();  // Changed from getBody
    }

    /**
     * Get the signing key for JWT.
     *
     * @return the signing key
     */
    private SecretKey getSigningKey() {
        byte[] keyBytes = jwtSecret.getBytes(StandardCharsets.UTF_8);
        return Keys.hmacShaKeyFor(keyBytes);
    }

    /**
     * Get JWT expiration time in milliseconds.
     *
     * @return expiration time
     */
    public long getExpirationTime() {
        return jwtExpirationMs;
    }
}