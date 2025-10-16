package com.epam.rd.autocode.assessment.appliances.controller.api;

import com.epam.rd.autocode.assessment.appliances.dto.ManufacturerRequestDTO;
import com.epam.rd.autocode.assessment.appliances.model.Manufacturer;
import com.epam.rd.autocode.assessment.appliances.repository.ManufacturerRepository;
import com.epam.rd.autocode.assessment.appliances.repository.ApplianceRepository;
import com.epam.rd.autocode.assessment.appliances.repository.OrderRowRepository;
import com.epam.rd.autocode.assessment.appliances.repository.OrdersRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import static org.hamcrest.Matchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class ManufacturerControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private ManufacturerRepository manufacturerRepository;

    @Autowired
    private ApplianceRepository applianceRepository;

    @Autowired
    private OrderRowRepository orderRowRepository;

    @Autowired
    private OrdersRepository ordersRepository;

    private Manufacturer testManufacturer;

    @BeforeEach
    void setUp() {
        orderRowRepository.deleteAll();
        ordersRepository.deleteAll();
        applianceRepository.deleteAll();
        manufacturerRepository.deleteAll();

        testManufacturer = new Manufacturer();
        testManufacturer.setName("TestManufacturer");
        testManufacturer.setAddress("123 Test Street");
        testManufacturer.setCountry("USA");
        testManufacturer = manufacturerRepository.save(testManufacturer);
    }

    @AfterEach
    void tearDown() {
        orderRowRepository.deleteAll();
        ordersRepository.deleteAll();
        applianceRepository.deleteAll();
        manufacturerRepository.deleteAll();
    }

    @Test
    @WithMockUser(roles = "EMPLOYEE")
    void getAllManufacturers_ShouldReturnPagedResults() throws Exception {
        mockMvc.perform(get("/api/manufacturers")
                        .param("page", "0")
                        .param("size", "10"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content", hasSize(1)))
                .andExpect(jsonPath("$.content[0].name", is("TestManufacturer")))
                .andExpect(jsonPath("$.totalElements", is(1)))
                .andExpect(jsonPath("$.totalPages", is(1)));
    }

    @Test
    @WithMockUser(roles = "EMPLOYEE")
    void getAllManufacturers_WithSorting_ShouldReturnSortedResults() throws Exception {
        Manufacturer manufacturer2 = new Manufacturer();
        manufacturer2.setName("AnotherManufacturer");
        manufacturer2.setAddress("456 Another St");
        manufacturer2.setCountry("Canada");
        manufacturerRepository.save(manufacturer2);

        mockMvc.perform(get("/api/manufacturers")
                        .param("sort", "name,asc"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content", hasSize(2)))
                .andExpect(jsonPath("$.content[0].name", is("AnotherManufacturer")));
    }

    @Test
    @WithMockUser(roles = "EMPLOYEE")
    void searchManufacturers_ShouldReturnMatchingResults() throws Exception {
        mockMvc.perform(get("/api/manufacturers/search")
                        .param("query", "Test"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content", hasSize(1)))
                .andExpect(jsonPath("$.content[0].name", is("TestManufacturer")));
    }

    @Test
    @WithMockUser(roles = "EMPLOYEE")
    void getManufacturerById_WhenExists_ShouldReturnManufacturer() throws Exception {
        mockMvc.perform(get("/api/manufacturers/{id}", testManufacturer.getId()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id", is(testManufacturer.getId().intValue())))
                .andExpect(jsonPath("$.name", is("TestManufacturer")));
    }

    @Test
    @WithMockUser(roles = "EMPLOYEE")
    void getManufacturerById_WhenNotExists_ShouldReturn404() throws Exception {
        mockMvc.perform(get("/api/manufacturers/{id}", 999L))
                .andExpect(status().isNotFound());
    }

    @Test
    @WithMockUser(roles = "EMPLOYEE")
    void createManufacturer_WithValidData_ShouldReturnCreated() throws Exception {
        ManufacturerRequestDTO dto = new ManufacturerRequestDTO("NewManufacturer", "123 Industrial St", "USA");

        mockMvc.perform(post("/api/manufacturers")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.name", is("NewManufacturer")));
    }

    @Test
    @WithMockUser(roles = "EMPLOYEE")
    void createManufacturer_WithInvalidData_ShouldReturn400() throws Exception {
        ManufacturerRequestDTO dto = new ManufacturerRequestDTO("", "", "");

        mockMvc.perform(post("/api/manufacturers")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isBadRequest());
    }

    @Test
    @WithMockUser(roles = "EMPLOYEE")
    void updateManufacturer_WithValidData_ShouldReturnUpdated() throws Exception {
        ManufacturerRequestDTO dto = new ManufacturerRequestDTO("UpdatedManufacturer", "456 Factory Ave", "Canada");

        mockMvc.perform(put("/api/manufacturers/{id}", testManufacturer.getId())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name", is("UpdatedManufacturer")));
    }

    @Test
    @WithMockUser(roles = "EMPLOYEE")
    void updateManufacturer_WhenNotExists_ShouldReturn404() throws Exception {
        ManufacturerRequestDTO dto = new ManufacturerRequestDTO("UpdatedManufacturer", "456 Factory Ave", "Canada");

        mockMvc.perform(put("/api/manufacturers/{id}", 999L)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isNotFound());
    }

    @Test
    @WithMockUser(roles = "EMPLOYEE")
    void deleteManufacturer_WhenExists_ShouldReturn204() throws Exception {
        mockMvc.perform(delete("/api/manufacturers/{id}", testManufacturer.getId()))
                .andExpect(status().isNoContent());
    }

    @Test
    @WithMockUser(roles = "EMPLOYEE")
    void deleteManufacturer_WhenNotExists_ShouldReturn404() throws Exception {
        mockMvc.perform(delete("/api/manufacturers/{id}", 999L))
                .andExpect(status().isNoContent());
    }

    @Test
    void getAllManufacturers_WithoutAuthentication_ShouldReturn401() throws Exception {
        mockMvc.perform(get("/api/manufacturers"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @WithMockUser(roles = "CLIENT")
    void getAllManufacturers_WithClientRole_ShouldReturn200() throws Exception {
        mockMvc.perform(get("/api/manufacturers"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content", hasSize(1)))
                .andExpect(jsonPath("$.content[0].name", is("TestManufacturer")));
    }

    @Test
    @WithMockUser(roles = "CLIENT")
    void getManufacturerById_WithClientRole_ShouldReturn200() throws Exception {
        mockMvc.perform(get("/api/manufacturers/{id}", testManufacturer.getId()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name", is("TestManufacturer")));
    }

    @Test
    @WithMockUser(roles = "CLIENT")
    void createManufacturer_WithClientRole_ShouldReturn403() throws Exception {
        ManufacturerRequestDTO dto = new ManufacturerRequestDTO("NewManufacturer", "123 Industrial St", "USA");

        mockMvc.perform(post("/api/manufacturers")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isForbidden());
    }

    @Test
    @WithMockUser(roles = "CLIENT")
    void updateManufacturer_WithClientRole_ShouldReturn403() throws Exception {
        ManufacturerRequestDTO dto = new ManufacturerRequestDTO("UpdatedManufacturer", "456 Factory Ave", "Canada");

        mockMvc.perform(put("/api/manufacturers/{id}", testManufacturer.getId())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isForbidden());
    }

    @Test
    @WithMockUser(roles = "CLIENT")
    void deleteManufacturer_WithClientRole_ShouldReturn403() throws Exception {
        mockMvc.perform(delete("/api/manufacturers/{id}", testManufacturer.getId()))
                .andExpect(status().isForbidden());
    }

    @Test
    @WithMockUser(roles = "EMPLOYEE")
    void getPagination_ShouldWorkCorrectly() throws Exception {
        for (int i = 0; i < 15; i++) {
            Manufacturer m = new Manufacturer();
            m.setName("Manufacturer" + i);
            m.setAddress("Address " + i);
            m.setCountry("Country" + (i % 3));
            manufacturerRepository.save(m);
        }

        mockMvc.perform(get("/api/manufacturers")
                        .param("page", "0")
                        .param("size", "5"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content", hasSize(5)))
                .andExpect(jsonPath("$.totalElements", is(16)))
                .andExpect(jsonPath("$.totalPages", is(4)));

        mockMvc.perform(get("/api/manufacturers")
                        .param("page", "1")
                        .param("size", "5"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content", hasSize(5)));
    }
}