package com.sweetshop.exception;

/**
 * Exception thrown when provided credentials are invalid.
 */
public class InvalidCredentialsException extends RuntimeException {
    public InvalidCredentialsException(String message) {
        super(message);
    }
}
