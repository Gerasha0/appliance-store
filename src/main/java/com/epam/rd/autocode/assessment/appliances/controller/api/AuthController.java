package com.epam.rd.autocode.assessment.appliances.controller.api;

import com.epam.rd.autocode.assessment.appliances.dto.*;
import com.epam.rd.autocode.assessment.appliances.dto.mapper.EntityMapper;
import com.epam.rd.autocode.assessment.appliances.model.Client;
import com.epam.rd.autocode.assessment.appliances.model.Employee;
import com.epam.rd.autocode.assessment.appliances.model.User;
import com.epam.rd.autocode.assessment.appliances.security.JwtTokenProvider;
import com.epam.rd.autocode.assessment.appliances.service.ClientService;
import com.epam.rd.autocode.assessment.appliances.service.EmployeeService;
import com.epam.rd.autocode.assessment.appliances.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider tokenProvider;
    private final UserService userService;
    private final ClientService clientService;
    private final EmployeeService employeeService;
    private final EntityMapper entityMapper;

    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {
        log.info("Login attempt for user: {}", loginRequest.getEmail());
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            loginRequest.getEmail(),
                            loginRequest.getPassword()
                    )
            );

            SecurityContextHolder.getContext().setAuthentication(authentication);
            String jwt = tokenProvider.generateToken(authentication);

            User user = userService.getUserByEmail(loginRequest.getEmail());
            String role = determineRole(user);
            
            log.info("Successful login for user: {} with role: {}", loginRequest.getEmail(), role);
            return ResponseEntity.ok(new JwtResponse(jwt, user.getEmail(), role, user.getId(),
                    user.getFirstName(), user.getLastName()));
        } catch (BadCredentialsException e) {
            log.warn("Failed login attempt for user: {} - Invalid credentials", loginRequest.getEmail());
            Map<String, String> error = new HashMap<>();
            error.put("error", "Invalid email or password");
            error.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(error);
        } catch (AuthenticationException e) {
            log.error("Authentication failed for user: {} - {}", loginRequest.getEmail(), e.getMessage());
            Map<String, String> error = new HashMap<>();
            error.put("error", "Authentication failed");
            error.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(error);
        } catch (Exception e) {
            log.error("Server error during authentication for user: {}", loginRequest.getEmail(), e);
            Map<String, String> error = new HashMap<>();
            error.put("error", "Server error");
            error.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    @PostMapping("/register/client")
    public ResponseEntity<ClientResponseDTO> registerClient(@Valid @RequestBody ClientRequestDTO clientDTO) {
        log.info("Registering new client: {}", clientDTO.getEmail());
        try {
            Client client = entityMapper.toClientEntity(clientDTO);
            Client created = clientService.createClient(client);
            log.info("Successfully registered client: {} with ID: {}", created.getEmail(), created.getId());
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(entityMapper.toClientResponseDTO(created));
        } catch (Exception e) {
            log.error("Failed to register client: {}", clientDTO.getEmail(), e);
            throw e;
        }
    }

    @PostMapping("/register/employee")
    public ResponseEntity<EmployeeResponseDTO> registerEmployee(@Valid @RequestBody EmployeeRequestDTO employeeDTO) {
        log.info("Registering new employee: {}", employeeDTO.getEmail());
        try {
            Employee employee = entityMapper.toEmployeeEntity(employeeDTO);
            Employee created = employeeService.createEmployee(employee);
            log.info("Successfully registered employee: {} with ID: {}", created.getEmail(), created.getId());
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(entityMapper.toEmployeeResponseDTO(created));
        } catch (Exception e) {
            log.error("Failed to register employee: {}", employeeDTO.getEmail(), e);
            throw e;
        }
    }

    private String determineRole(User user) {
        if (user instanceof Employee) {
            return "EMPLOYEE";
        } else if (user instanceof Client) {
            return "CLIENT";
        }
        return "USER";
    }
}