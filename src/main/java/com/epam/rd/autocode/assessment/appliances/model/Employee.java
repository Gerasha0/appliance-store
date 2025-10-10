package com.epam.rd.autocode.assessment.appliances.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "employees")
@Data
@NoArgsConstructor
@EqualsAndHashCode(callSuper = true)
public class Employee extends User {
    
    @NotBlank(message = "Position is required")
    @Size(min = 2, max = 100, message = "Position must be between 2 and 100 characters")
    @Column(nullable = false)
    private String position;

    public Employee(Long id, String firstName, String lastName, String email, String password, String position) {
        super(id, firstName, lastName, email, password);
        this.position = position;
    }
}