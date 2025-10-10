package com.epam.rd.autocode.assessment.appliances.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrderRequestDTO {

    @NotNull(message = "Client ID is required")
    private Long clientId;

    @NotEmpty(message = "Order must contain at least one item")
    @Valid
    private List<OrderRowRequestDTO> orderRows;
}