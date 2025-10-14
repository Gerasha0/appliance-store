package com.epam.rd.autocode.assessment.appliances.service;

import com.epam.rd.autocode.assessment.appliances.exception.ResourceNotFoundException;
import com.epam.rd.autocode.assessment.appliances.model.*;
import com.epam.rd.autocode.assessment.appliances.repository.ApplianceRepository;
import com.epam.rd.autocode.assessment.appliances.service.impl.ApplianceServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

import java.math.BigDecimal;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ApplianceServiceImplTest {

    @Mock
    private ApplianceRepository applianceRepository;

    @InjectMocks
    private ApplianceServiceImpl applianceService;

    private Appliance testAppliance;
    private Manufacturer testManufacturer;

    @BeforeEach
    void setUp() {
        testManufacturer = new Manufacturer();
        testManufacturer.setId(1L);
        testManufacturer.setName("Samsung");

        testAppliance = new Appliance();
        testAppliance.setId(1L);
        testAppliance.setName("Refrigerator");
        testAppliance.setCategory(Category.BIG);
        testAppliance.setModel("RF28R7351SR");
        testAppliance.setManufacturer(testManufacturer);
        testAppliance.setPowerType(PowerType.AC220);
        testAppliance.setCharacteristic("French Door");
        testAppliance.setDescription("High-end refrigerator");
        testAppliance.setPower(200);
        testAppliance.setPrice(new BigDecimal("1500.00"));
    }

    @Test
    void createAppliance_ShouldReturnSavedAppliance() {
        when(applianceRepository.save(any(Appliance.class))).thenReturn(testAppliance);

        Appliance result = applianceService.createAppliance(testAppliance);

        assertThat(result).isNotNull();
        assertThat(result.getId()).isEqualTo(1L);
        assertThat(result.getName()).isEqualTo("Refrigerator");
        assertThat(result.getPrice()).isEqualTo(new BigDecimal("1500.00"));
        verify(applianceRepository, times(1)).save(testAppliance);
    }

    @Test
    void updateAppliance_WithValidId_ShouldReturnUpdatedAppliance() {
        Appliance updatedAppliance = new Appliance();
        updatedAppliance.setName("Updated Refrigerator");
        updatedAppliance.setCategory(Category.BIG);
        updatedAppliance.setModel("RF28R7351SR-V2");
        updatedAppliance.setManufacturer(testManufacturer);
        updatedAppliance.setPowerType(PowerType.AC220);
        updatedAppliance.setCharacteristic("French Door Pro");
        updatedAppliance.setDescription("Premium refrigerator");
        updatedAppliance.setPower(220);
        updatedAppliance.setPrice(new BigDecimal("1800.00"));

        when(applianceRepository.findById(1L)).thenReturn(Optional.of(testAppliance));
        when(applianceRepository.save(any(Appliance.class))).thenReturn(testAppliance);

        Appliance result = applianceService.updateAppliance(1L, updatedAppliance);

        assertThat(result).isNotNull();
        verify(applianceRepository, times(1)).findById(1L);
        verify(applianceRepository, times(1)).save(testAppliance);
    }

    @Test
    void updateAppliance_WithInvalidId_ShouldThrowResourceNotFoundException() {
        when(applianceRepository.findById(anyLong())).thenReturn(Optional.empty());

        assertThatThrownBy(() -> applianceService.updateAppliance(999L, testAppliance))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("Appliance")
                .hasMessageContaining("id")
                .hasMessageContaining("999");

        verify(applianceRepository, times(1)).findById(999L);
        verify(applianceRepository, never()).save(any());
    }

    @Test
    void deleteAppliance_ShouldCallRepositoryDelete() {
        doNothing().when(applianceRepository).deleteById(1L);

        applianceService.deleteAppliance(1L);

        verify(applianceRepository, times(1)).deleteById(1L);
    }

    @Test
    void getApplianceById_WithValidId_ShouldReturnAppliance() {
        when(applianceRepository.findById(1L)).thenReturn(Optional.of(testAppliance));

        Appliance result = applianceService.getApplianceById(1L);

        assertThat(result).isNotNull();
        assertThat(result.getId()).isEqualTo(1L);
        assertThat(result.getName()).isEqualTo("Refrigerator");
        verify(applianceRepository, times(1)).findById(1L);
    }

    @Test
    void getApplianceById_WithInvalidId_ShouldThrowResourceNotFoundException() {
        when(applianceRepository.findById(anyLong())).thenReturn(Optional.empty());

        assertThatThrownBy(() -> applianceService.getApplianceById(999L))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("Appliance")
                .hasMessageContaining("id")
                .hasMessageContaining("999");

        verify(applianceRepository, times(1)).findById(999L);
    }

    @Test
    void getAllAppliances_ShouldReturnListOfAppliances() {
        Appliance appliance2 = new Appliance();
        appliance2.setId(2L);
        appliance2.setName("Washing Machine");

        List<Appliance> appliances = Arrays.asList(testAppliance, appliance2);
        when(applianceRepository.findAll()).thenReturn(appliances);

        List<Appliance> result = applianceService.getAllAppliances();

        assertThat(result).isNotNull();
        assertThat(result).hasSize(2);
        assertThat(result).containsExactly(testAppliance, appliance2);
        verify(applianceRepository, times(1)).findAll();
    }

    @Test
    void getAllAppliances_WithPageable_ShouldReturnPageOfAppliances() {
        List<Appliance> appliances = Arrays.asList(testAppliance);
        Page<Appliance> page = new PageImpl<>(appliances);
        Pageable pageable = PageRequest.of(0, 10);

        when(applianceRepository.findAll(pageable)).thenReturn(page);

        Page<Appliance> result = applianceService.getAllAppliances(pageable);

        assertThat(result).isNotNull();
        assertThat(result.getContent()).hasSize(1);
        assertThat(result.getTotalElements()).isEqualTo(1);
        verify(applianceRepository, times(1)).findAll(pageable);
    }

    @Test
    void searchAppliances_ShouldReturnFilteredAppliances() {
        String searchTerm = "Refrig";
        List<Appliance> appliances = Arrays.asList(testAppliance);
        Page<Appliance> page = new PageImpl<>(appliances);
        Pageable pageable = PageRequest.of(0, 10);

        when(applianceRepository.searchAppliances(searchTerm, pageable)).thenReturn(page);

        Page<Appliance> result = applianceService.searchAppliances(searchTerm, pageable);

        assertThat(result).isNotNull();
        assertThat(result.getContent()).hasSize(1);
        verify(applianceRepository, times(1)).searchAppliances(searchTerm, pageable);
    }

    @Test
    void getAppliancesByCategory_ShouldReturnAppliancesOfCategory() {
        List<Appliance> appliances = Arrays.asList(testAppliance);
        Page<Appliance> page = new PageImpl<>(appliances);
        Pageable pageable = PageRequest.of(0, 10);

        when(applianceRepository.findByCategory(Category.BIG, pageable)).thenReturn(page);

        Page<Appliance> result = applianceService.getAppliancesByCategory(Category.BIG, pageable);

        assertThat(result).isNotNull();
        assertThat(result.getContent()).hasSize(1);
        assertThat(result.getContent().get(0).getCategory()).isEqualTo(Category.BIG);
        verify(applianceRepository, times(1)).findByCategory(Category.BIG, pageable);
    }

    @Test
    void getAppliancesByPowerType_ShouldReturnAppliancesOfPowerType() {
        List<Appliance> appliances = Arrays.asList(testAppliance);
        Page<Appliance> page = new PageImpl<>(appliances);
        Pageable pageable = PageRequest.of(0, 10);

        when(applianceRepository.findByPowerType(PowerType.AC220, pageable)).thenReturn(page);

        Page<Appliance> result = applianceService.getAppliancesByPowerType(PowerType.AC220, pageable);

        assertThat(result).isNotNull();
        assertThat(result.getContent()).hasSize(1);
        assertThat(result.getContent().get(0).getPowerType()).isEqualTo(PowerType.AC220);
        verify(applianceRepository, times(1)).findByPowerType(PowerType.AC220, pageable);
    }

    @Test
    void getAppliancesByCategory_WithNoResults_ShouldReturnEmptyPage() {
        Page<Appliance> emptyPage = new PageImpl<>(Arrays.asList());
        Pageable pageable = PageRequest.of(0, 10);

        when(applianceRepository.findByCategory(Category.SMALL, pageable)).thenReturn(emptyPage);

        Page<Appliance> result = applianceService.getAppliancesByCategory(Category.SMALL, pageable);

        assertThat(result).isNotNull();
        assertThat(result.getContent()).isEmpty();
        verify(applianceRepository, times(1)).findByCategory(Category.SMALL, pageable);
    }
}