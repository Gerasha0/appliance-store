package com.epam.rd.autocode.assessment.appliances.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrderRowResponseDTO {
    private Long id;
    private ApplianceResponseDTO appliance;
    private Long quantity;
    private BigDecimal amount;
}