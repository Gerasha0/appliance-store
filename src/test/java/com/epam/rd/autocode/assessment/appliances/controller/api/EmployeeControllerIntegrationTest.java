package com.epam.rd.autocode.assessment.appliances.controller.api;

import com.epam.rd.autocode.assessment.appliances.dto.EmployeeRequestDTO;
import com.epam.rd.autocode.assessment.appliances.model.Employee;
import com.epam.rd.autocode.assessment.appliances.repository.EmployeeRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import static org.hamcrest.Matchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class EmployeeControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private EmployeeRepository employeeRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    private Employee testEmployee;

    @BeforeEach
    void setUp() {
        employeeRepository.deleteAll();

        testEmployee = new Employee();
        testEmployee.setFirstName("Test");
        testEmployee.setLastName("Employee");
        testEmployee.setEmail("test.employee@example.com");
        testEmployee.setPassword(passwordEncoder.encode("Password1@"));
        testEmployee.setPosition("IT Manager");
        testEmployee = employeeRepository.save(testEmployee);
    }

    @AfterEach
    void tearDown() {
        employeeRepository.deleteAll();
    }

    @Test
    @WithMockUser(roles = "EMPLOYEE")
    void getAllEmployees_AsEmployee_ShouldReturnResults() throws Exception {
        mockMvc.perform(get("/api/employees"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content", hasSize(1)))
                .andExpect(jsonPath("$.content[0].email", is("test.employee@example.com")))
                .andExpect(jsonPath("$.content[0].firstName", is("Test")))
                .andExpect(jsonPath("$.content[0].position", is("IT Manager")));
    }

    @Test
    @WithMockUser(roles = "CLIENT")
    void getAllEmployees_AsClient_ShouldReturn403() throws Exception {
        mockMvc.perform(get("/api/employees"))
                .andExpect(status().isForbidden());
    }

    @Test
    void getAllEmployees_WithoutAuth_ShouldReturn401() throws Exception {
        mockMvc.perform(get("/api/employees"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @WithMockUser(roles = "EMPLOYEE")
    void searchEmployees_ShouldReturnMatchingResults() throws Exception {
        mockMvc.perform(get("/api/employees/search")
                        .param("query", "Test"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content", hasSize(1)))
                .andExpect(jsonPath("$.content[0].firstName", is("Test")));
    }

    @Test
    @WithMockUser(roles = "EMPLOYEE")
    void getEmployeeById_WhenExists_ShouldReturn() throws Exception {
        mockMvc.perform(get("/api/employees/{id}", testEmployee.getId()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id", is(testEmployee.getId().intValue())))
                .andExpect(jsonPath("$.email", is("test.employee@example.com")))
                .andExpect(jsonPath("$.firstName", is("Test")))
                .andExpect(jsonPath("$.position", is("IT Manager")));
    }

    @Test
    @WithMockUser(roles = "EMPLOYEE")
    void getEmployeeById_WhenNotExists_ShouldReturn404() throws Exception {
        mockMvc.perform(get("/api/employees/{id}", 999L))
                .andExpect(status().isNotFound());
    }

    @Test
    @WithMockUser(roles = "EMPLOYEE")
    void createEmployee_WithValidData_ShouldReturn201() throws Exception {
        EmployeeRequestDTO dto = new EmployeeRequestDTO(
                "New",
                "Employee",
                "new.employee@example.com",
                "Password1@",
                "Sales Manager"
        );

        mockMvc.perform(post("/api/employees")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.email", is("new.employee@example.com")))
                .andExpect(jsonPath("$.firstName", is("New")))
                .andExpect(jsonPath("$.position", is("Sales Manager")));
    }

    @Test
    @WithMockUser(roles = "EMPLOYEE")
    void createEmployee_WithInvalidEmail_ShouldReturn400() throws Exception {
        EmployeeRequestDTO dto = new EmployeeRequestDTO(
                "New",
                "Employee",
                "invalid-email",
                "Password1@",
                "Sales Manager"
        );

        mockMvc.perform(post("/api/employees")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isBadRequest());
    }

    @Test
    @WithMockUser(roles = "EMPLOYEE")
    void updateEmployee_WithValidData_ShouldReturn200() throws Exception {
        EmployeeRequestDTO dto = new EmployeeRequestDTO(
                "Updated",
                "Employee",
                "updated.employee@example.com",
                "NewPassword1@",
                "Management Director"
        );

        mockMvc.perform(put("/api/employees/{id}", testEmployee.getId())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.email", is("updated.employee@example.com")))
                .andExpect(jsonPath("$.firstName", is("Updated")))
                .andExpect(jsonPath("$.position", is("Management Director")));
    }

    @Test
    @WithMockUser(roles = "EMPLOYEE")
    void deleteEmployee_WhenExists_ShouldReturn204() throws Exception {
        mockMvc.perform(delete("/api/employees/{id}", testEmployee.getId()))
                .andExpect(status().isNoContent());
    }

    @Test
    @WithMockUser(roles = "CLIENT")
    void deleteEmployee_AsClient_ShouldReturn403() throws Exception {
        mockMvc.perform(delete("/api/employees/{id}", testEmployee.getId()))
                .andExpect(status().isForbidden());
    }

    @Test
    @WithMockUser(roles = "EMPLOYEE")
    void pagination_ShouldWorkCorrectly() throws Exception {
        for (int i = 0; i < 15; i++) {
            Employee employee = new Employee();
            employee.setFirstName("Employee");
            employee.setLastName(getNameSuffix(i));
            employee.setEmail("employee" + i + "@example.com");
            employee.setPassword(passwordEncoder.encode("Password1@"));
            employee.setPosition("Dept" + i);
            employeeRepository.save(employee);
        }

        mockMvc.perform(get("/api/employees")
                        .param("page", "0")
                        .param("size", "10"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content", hasSize(10)))
                .andExpect(jsonPath("$.totalElements", is(16)))
                .andExpect(jsonPath("$.totalPages", is(2)));
    }

    private String getNameSuffix(int i) {
        String[] names = {"One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen"};
        return names[i % names.length];
    }
}
