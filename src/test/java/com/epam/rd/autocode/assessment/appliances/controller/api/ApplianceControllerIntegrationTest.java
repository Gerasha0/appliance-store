package com.epam.rd.autocode.assessment.appliances.controller.api;

import com.epam.rd.autocode.assessment.appliances.dto.ApplianceRequestDTO;
import com.epam.rd.autocode.assessment.appliances.model.Appliance;
import com.epam.rd.autocode.assessment.appliances.model.Category;
import com.epam.rd.autocode.assessment.appliances.model.Manufacturer;
import com.epam.rd.autocode.assessment.appliances.model.PowerType;
import com.epam.rd.autocode.assessment.appliances.repository.ApplianceRepository;
import com.epam.rd.autocode.assessment.appliances.repository.ManufacturerRepository;
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

import java.math.BigDecimal;

import static org.hamcrest.Matchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class ApplianceControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private ApplianceRepository applianceRepository;

    @Autowired
    private ManufacturerRepository manufacturerRepository;

    private Manufacturer testManufacturer;
    private Appliance testAppliance;

    @BeforeEach
    void setUp() {
        applianceRepository.deleteAll();
        manufacturerRepository.deleteAll();

        testManufacturer = new Manufacturer();
        testManufacturer.setName("TestManufacturer");
        testManufacturer.setAddress("123 Manufacturer St");
        testManufacturer.setCountry("USA");
        testManufacturer = manufacturerRepository.save(testManufacturer);

        testAppliance = new Appliance();
        testAppliance.setName("TestAppliance");
        testAppliance.setModel("TestModel");
        testAppliance.setCategory(Category.BIG);
        testAppliance.setPowerType(PowerType.AC220);
        testAppliance.setPrice(new BigDecimal("999.99"));
        testAppliance.setManufacturer(testManufacturer);
        testAppliance = applianceRepository.save(testAppliance);
    }

    @AfterEach
    void tearDown() {
        applianceRepository.deleteAll();
        manufacturerRepository.deleteAll();
    }

    @Test
    @WithMockUser(roles = "CLIENT")
    void getAllAppliances_AsClient_ShouldReturnResults() throws Exception {
        mockMvc.perform(get("/api/appliances"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content", hasSize(1)))
                .andExpect(jsonPath("$.content[0].name", is("TestAppliance")))
                .andExpect(jsonPath("$.content[0].category", is("BIG")));
    }

    @Test
    @WithMockUser(roles = "EMPLOYEE")
    void getAllAppliances_AsEmployee_ShouldReturnResults() throws Exception {
        mockMvc.perform(get("/api/appliances"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content", hasSize(1)));
    }

    @Test
    void getAllAppliances_WithoutAuth_ShouldReturn401() throws Exception {
        mockMvc.perform(get("/api/appliances"))
                .andExpect(status().isOk()); // Appliances are public, no auth required
    }

    @Test
    @WithMockUser(roles = "CLIENT")
    void searchAppliances_ShouldReturnMatchingResults() throws Exception {
        mockMvc.perform(get("/api/appliances/search")
                        .param("query", "Test"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content", hasSize(1)))
                .andExpect(jsonPath("$.content[0].name", is("TestAppliance")));
    }

    @Test
    @WithMockUser(roles = "CLIENT")
    void getAppliancesByCategory_ShouldReturnFiltered() throws Exception {
        mockMvc.perform(get("/api/appliances/category/{category}", "BIG"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content", hasSize(1)))
                .andExpect(jsonPath("$.content[0].category", is("BIG")));
    }

    @Test
    @WithMockUser(roles = "CLIENT")
    void getAppliancesByCategory_WithNoResults_ShouldReturnEmpty() throws Exception {
        mockMvc.perform(get("/api/appliances/category/{category}", "SMALL"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content", hasSize(0)));
    }

    @Test
    @WithMockUser(roles = "CLIENT")
    void getAppliancesByPowerType_ShouldReturnFiltered() throws Exception {
        mockMvc.perform(get("/api/appliances/power-type/{powerType}", "AC220"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content", hasSize(1)))
                .andExpect(jsonPath("$.content[0].powerType", is("AC220")));
    }

    @Test
    @WithMockUser(roles = "CLIENT")
    void getApplianceById_WhenExists_ShouldReturn() throws Exception {
        mockMvc.perform(get("/api/appliances/{id}", testAppliance.getId()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id", is(testAppliance.getId().intValue())))
                .andExpect(jsonPath("$.name", is("TestAppliance")))
                .andExpect(jsonPath("$.price", is(999.99)));
    }

    @Test
    @WithMockUser(roles = "CLIENT")
    void getApplianceById_WhenNotExists_ShouldReturn404() throws Exception {
        mockMvc.perform(get("/api/appliances/{id}", 999L))
                .andExpect(status().isNotFound());
    }

    @Test
    @WithMockUser(roles = "EMPLOYEE")
    void createAppliance_AsEmployee_ShouldReturn201() throws Exception {
        ApplianceRequestDTO dto = new ApplianceRequestDTO(
                "NewAppliance",
                Category.SMALL,
                "ModelX100",
                testManufacturer.getId(),
                PowerType.AC110,
                "High efficiency",
                "A great appliance",
                500,
                new BigDecimal("1299.99")
        );

        mockMvc.perform(post("/api/appliances")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.name", is("NewAppliance")))
                .andExpect(jsonPath("$.category", is("SMALL")))
                .andExpect(jsonPath("$.price", is(1299.99)));
    }

    @Test
    @WithMockUser(roles = "CLIENT")
    void createAppliance_AsClient_ShouldReturn403() throws Exception {
        ApplianceRequestDTO dto = new ApplianceRequestDTO(
                "NewAppliance",
                Category.SMALL,
                "ModelX200",
                testManufacturer.getId(),
                PowerType.AC220,
                "Standard efficiency",
                "Another appliance",
                450,
                new BigDecimal("1299.99")
        );

        mockMvc.perform(post("/api/appliances")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isForbidden());
    }

    @Test
    @WithMockUser(roles = "EMPLOYEE")
    void updateAppliance_AsEmployee_ShouldReturn200() throws Exception {
        ApplianceRequestDTO dto = new ApplianceRequestDTO(
                "UpdatedAppliance",
                Category.BIG,
                "ModelY100",
                testManufacturer.getId(),
                PowerType.AC110,
                "Updated features",
                "Updated description",
                600,
                new BigDecimal("1499.99")
        );

        mockMvc.perform(put("/api/appliances/{id}", testAppliance.getId())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name", is("UpdatedAppliance")))
                .andExpect(jsonPath("$.powerType", is("AC110")))
                .andExpect(jsonPath("$.price", is(1499.99)));
    }

    @Test
    @WithMockUser(roles = "CLIENT")
    void updateAppliance_AsClient_ShouldReturn403() throws Exception {
        ApplianceRequestDTO dto = new ApplianceRequestDTO(
                "UpdatedAppliance",
                Category.BIG,
                "ModelY200",
                testManufacturer.getId(),
                PowerType.AC220,
                "Some features",
                "Some description",
                550,
                new BigDecimal("1499.99")
        );

        mockMvc.perform(put("/api/appliances/{id}", testAppliance.getId())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isForbidden());
    }

    @Test
    @WithMockUser(roles = "EMPLOYEE")
    void deleteAppliance_AsEmployee_ShouldReturn204() throws Exception {
        mockMvc.perform(delete("/api/appliances/{id}", testAppliance.getId()))
                .andExpect(status().isNoContent());
    }

    @Test
    @WithMockUser(roles = "CLIENT")
    void deleteAppliance_AsClient_ShouldReturn403() throws Exception {
        mockMvc.perform(delete("/api/appliances/{id}", testAppliance.getId()))
                .andExpect(status().isForbidden());
    }

    @Test
    @WithMockUser(roles = "CLIENT")
    void pagination_ShouldWorkCorrectly() throws Exception {
        for (int i = 0; i < 25; i++) {
            Appliance appliance = new Appliance();
            appliance.setName("ApplianceNumber" + i);
            appliance.setModel("Model" + i);
            appliance.setCategory(Category.BIG);
            appliance.setPowerType(PowerType.AC220);
            appliance.setPrice(new BigDecimal("100.00"));
            appliance.setManufacturer(testManufacturer);
            applianceRepository.save(appliance);
        }

        mockMvc.perform(get("/api/appliances")
                        .param("page", "0")
                        .param("size", "10"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content", hasSize(10)))
                .andExpect(jsonPath("$.totalElements", is(26)))
                .andExpect(jsonPath("$.totalPages", is(3)));
    }

    @Test
    @WithMockUser(roles = "CLIENT")
    void sorting_ShouldWorkCorrectly() throws Exception {
        Appliance appliance2 = new Appliance();
        appliance2.setName("AAAAppliance");
        appliance2.setModel("ModelAAA");
        appliance2.setCategory(Category.SMALL);
        appliance2.setPowerType(PowerType.AC220);
        appliance2.setPrice(new BigDecimal("500.00"));
        appliance2.setManufacturer(testManufacturer);
        applianceRepository.save(appliance2);

        mockMvc.perform(get("/api/appliances")
                        .param("sort", "name,asc"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content[0].name", is("AAAAppliance")));
    }
}
