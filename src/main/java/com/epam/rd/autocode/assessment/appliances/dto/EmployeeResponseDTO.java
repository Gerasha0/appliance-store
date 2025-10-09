package com.epam.rd.autocode.assessment.appliances.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = true)
public class EmployeeResponseDTO extends UserResponseDTO {
    private String position;

    public EmployeeResponseDTO(Long id, String firstName, String lastName, String email, String role, String position) {
        super(id, firstName, lastName, email, role);
        this.position = position;
    }
}
