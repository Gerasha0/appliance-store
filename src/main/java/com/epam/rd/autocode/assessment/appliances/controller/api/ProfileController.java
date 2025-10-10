package com.epam.rd.autocode.assessment.appliances.controller.api;
import com.epam.rd.autocode.assessment.appliances.dto.ClientResponseDTO;
import com.epam.rd.autocode.assessment.appliances.dto.EmployeeResponseDTO;
import com.epam.rd.autocode.assessment.appliances.dto.ProfileUpdateDTO;
import com.epam.rd.autocode.assessment.appliances.dto.mapper.EntityMapper;
import com.epam.rd.autocode.assessment.appliances.model.Client;
import com.epam.rd.autocode.assessment.appliances.model.Employee;
import com.epam.rd.autocode.assessment.appliances.model.User;
import com.epam.rd.autocode.assessment.appliances.service.ClientService;
import com.epam.rd.autocode.assessment.appliances.service.EmployeeService;
import com.epam.rd.autocode.assessment.appliances.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
@RestController
@RequestMapping("/api/profile")
@RequiredArgsConstructor
public class ProfileController {
    private final UserService userService;
    private final ClientService clientService;
    private final EmployeeService employeeService;
    private final EntityMapper entityMapper;
    private final PasswordEncoder passwordEncoder;
    @GetMapping
    public ResponseEntity<?> getProfile(Authentication authentication) {
        String email = authentication.getName();
        User user = userService.getUserByEmail(email);
        if (user instanceof Client) {
            Client client = (Client) user;
            return ResponseEntity.ok(entityMapper.toClientResponseDTO(client));
        } else if (user instanceof Employee) {
            Employee employee = (Employee) user;
            return ResponseEntity.ok(entityMapper.toEmployeeResponseDTO(employee));
        }
        return ResponseEntity.badRequest().body("Unknown user type");
    }
    @PutMapping
    public ResponseEntity<?> updateProfile(
            @Valid @RequestBody ProfileUpdateDTO dto,
            Authentication authentication) {
        String email = authentication.getName();
        User user = userService.getUserByEmail(email);
        if (user instanceof Client) {
            Client client = (Client) user;
            client.setFirstName(dto.getFirstName());
            client.setLastName(dto.getLastName());
            client.setEmail(dto.getEmail());
            if (dto.getPhone() != null && !dto.getPhone().isBlank()) {
                client.setPhone(dto.getPhone());
            }
            if (dto.getAddress() != null && !dto.getAddress().isBlank()) {
                client.setAddress(dto.getAddress());
            }
            if (dto.getCard() != null && !dto.getCard().isBlank()) {
                client.setCard(dto.getCard());
            }
            if (dto.getPassword() != null && !dto.getPassword().isBlank()) {
                client.setPassword(passwordEncoder.encode(dto.getPassword()));
            }
            Client updated = clientService.updateClient(client.getId(), client);
            return ResponseEntity.ok(entityMapper.toClientResponseDTO(updated));
        } else if (user instanceof Employee) {
            Employee employee = (Employee) user;
            employee.setFirstName(dto.getFirstName());
            employee.setLastName(dto.getLastName());
            employee.setEmail(dto.getEmail());
            if (dto.getPosition() != null && !dto.getPosition().isBlank()) {
                employee.setPosition(dto.getPosition());
            }
            if (dto.getPassword() != null && !dto.getPassword().isBlank()) {
                employee.setPassword(passwordEncoder.encode(dto.getPassword()));
            }
            Employee updated = employeeService.updateEmployee(employee.getId(), employee);
            return ResponseEntity.ok(entityMapper.toEmployeeResponseDTO(updated));
        }
        return ResponseEntity.badRequest().body("Unknown user type");
    }
}
