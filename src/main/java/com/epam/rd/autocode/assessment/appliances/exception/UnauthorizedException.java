package com.epam.rd.autocode.assessment.appliances.exception;

/**
 * Exception thrown when a user is not authenticated or authentication fails
 */
public class UnauthorizedException extends RuntimeException {

    public UnauthorizedException(String message) {
        super(message);
    }

    public UnauthorizedException(String message, Throwable cause) {
        super(message, cause);
    }
}

