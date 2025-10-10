package com.epam.rd.autocode.assessment.appliances.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "clients")
@Data
@NoArgsConstructor
@EqualsAndHashCode(callSuper = true)
public class Client extends User {
    
    @NotBlank(message = "Phone is required")
    @Pattern(regexp = "^[\\d\\s\\-+()]+$",
             message = "Phone number must contain only digits, spaces, hyphens, plus signs, and parentheses")
    @Size(min = 10, max = 20, message = "Phone number must be between 10 and 20 characters")
    @Column(nullable = false)
    private String phone;

    @NotBlank(message = "Address is required")
    @Size(min = 5, max = 255, message = "Address must be between 5 and 255 characters")
    @Column(nullable = false)
    private String address;

    @Size(min = 16, max = 19, message = "Card number must be 16-19 characters")
    @Pattern(regexp = "^(\\d{16}|\\d{4}-\\d{4}-\\d{4}-\\d{4})$",
             message = "Card must be 16 digits or formatted as XXXX-XXXX-XXXX-XXXX")
    @Column(nullable = true)
    private String card;

    public Client(Long id, String firstName, String lastName, String email, String password, String phone, String address, String card) {
        super(id, firstName, lastName, email, password);
        this.phone = phone;
        this.address = address;
        this.card = card;
    }
}