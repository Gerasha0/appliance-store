package com.epam.rd.autocode.assessment.appliances.exception;

/**
 * Exception thrown when a user does not have permission to access a resource
 */
public class ForbiddenException extends RuntimeException {

    public ForbiddenException(String message) {
        super(message);
    }

    public ForbiddenException(String message, Throwable cause) {
        super(message, cause);
    }
}

