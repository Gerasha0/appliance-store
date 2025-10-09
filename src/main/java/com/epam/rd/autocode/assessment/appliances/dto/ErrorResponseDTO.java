package com.epam.rd.autocode.assessment.appliances.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

/**
 * Standard error response DTO for API error handling
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ErrorResponseDTO {

    /**
     * Timestamp when the error occurred
     */
    private LocalDateTime timestamp;

    /**
     * HTTP status code
     */
    private int status;

    /**
     * HTTP status reason phrase (e.g., "Bad Request", "Not Found")
     */
    private String error;

    /**
     * Main error message
     */
    private String message;

    /**
     * Additional details about the error
     */
    private String details;

    /**
     * The path that was requested
     */
    private String path;

    /**
     * Validation errors map (field -> error message)
     */
    private Map<String, String> validationErrors;

    /**
     * List of error messages (for multiple errors)
     */
    private List<String> errors;
}

