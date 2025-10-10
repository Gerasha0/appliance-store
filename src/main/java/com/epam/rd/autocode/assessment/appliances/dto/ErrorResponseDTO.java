package com.epam.rd.autocode.assessment.appliances.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ErrorResponseDTO {

    private LocalDateTime timestamp;

    private int status;

    private String error;

    private String message;

    private String details;

    private String path;

    private Map<String, String> validationErrors;

    private List<String> errors;
}