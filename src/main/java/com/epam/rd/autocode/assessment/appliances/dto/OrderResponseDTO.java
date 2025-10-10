package com.epam.rd.autocode.assessment.appliances.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrderResponseDTO {
    private Long id;
    private EmployeeResponseDTO employee;
    private ClientResponseDTO client;
    private List<OrderRowResponseDTO> orderRows;
    private Boolean approved;
    private BigDecimal totalAmount;
}