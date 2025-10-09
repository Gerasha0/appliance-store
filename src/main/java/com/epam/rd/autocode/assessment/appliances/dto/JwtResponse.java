package com.epam.rd.autocode.assessment.appliances.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class JwtResponse {
    private String token;
    private String type = "Bearer";
    private String email;
    private String role;
    private Long userId;
    private String firstName;
    private String lastName;

    public JwtResponse(String token, String email, String role, Long userId, String firstName, String lastName) {
        this.token = token;
        this.email = email;
        this.role = role;
        this.userId = userId;
        this.firstName = firstName;
        this.lastName = lastName;
    }
}
