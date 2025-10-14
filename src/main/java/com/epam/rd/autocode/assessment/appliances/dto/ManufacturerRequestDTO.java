package com.epam.rd.autocode.assessment.appliances.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ManufacturerRequestDTO {

    @NotBlank(message = "Manufacturer name is required")
    @Size(min = 2, max = 100, message = "Name must be between 2 and 100 characters")
    @Pattern(regexp = "^[^<>\"'%;()&+]*$", message = "Name contains invalid characters")
    private String name;

    @NotBlank(message = "Address is required")
    @Size(min = 5, max = 255, message = "Address must be between 5 and 255 characters")
    @Pattern(regexp = "^[^<>\"'%;()&+]*$", message = "Address contains invalid characters")
    private String address;

    @NotBlank(message = "Country is required")
    @Size(min = 2, max = 100, message = "Country must be between 2 and 100 characters")
    @Pattern(regexp = "^[^<>\"'%;()&+]*$", message = "Country contains invalid characters")
    private String country;
}