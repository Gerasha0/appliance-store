package com.epam.rd.autocode.assessment.appliances.exception;

/**
 * Exception thrown when a request contains invalid data or parameters
 */
public class BadRequestException extends RuntimeException {

    public BadRequestException(String message) {
        super(message);
    }

    public BadRequestException(String message, Throwable cause) {
        super(message, cause);
    }
}

