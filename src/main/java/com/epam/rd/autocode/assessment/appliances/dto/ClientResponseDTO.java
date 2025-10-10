package com.epam.rd.autocode.assessment.appliances.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = true)
public class ClientResponseDTO extends UserResponseDTO {
    private String phone;
    private String address;
    private String card;

    public ClientResponseDTO(Long id, String firstName, String lastName, String email, String role, String phone, String address, String card) {
        super(id, firstName, lastName, email, role);
        this.phone = phone;
        this.address = address;
        this.card = card;
    }
}