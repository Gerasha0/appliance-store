package com.epam.rd.autocode.assessment.appliances.service;

import com.epam.rd.autocode.assessment.appliances.exception.ResourceNotFoundException;
import com.epam.rd.autocode.assessment.appliances.model.Manufacturer;
import com.epam.rd.autocode.assessment.appliances.repository.ManufacturerRepository;
import com.epam.rd.autocode.assessment.appliances.service.impl.ManufacturerServiceImpl;
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

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ManufacturerServiceImplTest {

    @Mock
    private ManufacturerRepository manufacturerRepository;

    @InjectMocks
    private ManufacturerServiceImpl manufacturerService;

    private Manufacturer testManufacturer;

    @BeforeEach
    void setUp() {
        testManufacturer = new Manufacturer();
        testManufacturer.setId(1L);
        testManufacturer.setName("Samsung");
    }

    @Test
    void createManufacturer_ShouldReturnSavedManufacturer() {
        // Given
        when(manufacturerRepository.save(any(Manufacturer.class))).thenReturn(testManufacturer);

        // When
        Manufacturer result = manufacturerService.createManufacturer(testManufacturer);

        // Then
        assertThat(result).isNotNull();
        assertThat(result.getId()).isEqualTo(1L);
        assertThat(result.getName()).isEqualTo("Samsung");
        verify(manufacturerRepository, times(1)).save(testManufacturer);
    }

    @Test
    void updateManufacturer_WithValidId_ShouldReturnUpdatedManufacturer() {
        // Given
        Manufacturer updatedManufacturer = new Manufacturer();
        updatedManufacturer.setName("LG");

        when(manufacturerRepository.findById(1L)).thenReturn(Optional.of(testManufacturer));
        when(manufacturerRepository.save(any(Manufacturer.class))).thenReturn(testManufacturer);

        // When
        Manufacturer result = manufacturerService.updateManufacturer(1L, updatedManufacturer);

        // Then
        assertThat(result).isNotNull();
        assertThat(result.getName()).isEqualTo("LG");
        verify(manufacturerRepository, times(1)).findById(1L);
        verify(manufacturerRepository, times(1)).save(testManufacturer);
    }

    @Test
    void updateManufacturer_WithInvalidId_ShouldThrowResourceNotFoundException() {
        // Given
        when(manufacturerRepository.findById(anyLong())).thenReturn(Optional.empty());

        // When & Then
        assertThatThrownBy(() -> manufacturerService.updateManufacturer(999L, testManufacturer))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("Manufacturer")
                .hasMessageContaining("id")
                .hasMessageContaining("999");

        verify(manufacturerRepository, times(1)).findById(999L);
        verify(manufacturerRepository, never()).save(any());
    }

    @Test
    void deleteManufacturer_ShouldCallRepositoryDelete() {
        // Given
        doNothing().when(manufacturerRepository).deleteById(1L);

        // When
        manufacturerService.deleteManufacturer(1L);

        // Then
        verify(manufacturerRepository, times(1)).deleteById(1L);
    }

    @Test
    void getManufacturerById_WithValidId_ShouldReturnManufacturer() {
        // Given
        when(manufacturerRepository.findById(1L)).thenReturn(Optional.of(testManufacturer));

        // When
        Manufacturer result = manufacturerService.getManufacturerById(1L);

        // Then
        assertThat(result).isNotNull();
        assertThat(result.getId()).isEqualTo(1L);
        assertThat(result.getName()).isEqualTo("Samsung");
        verify(manufacturerRepository, times(1)).findById(1L);
    }

    @Test
    void getManufacturerById_WithInvalidId_ShouldThrowResourceNotFoundException() {
        // Given
        when(manufacturerRepository.findById(anyLong())).thenReturn(Optional.empty());

        // When & Then
        assertThatThrownBy(() -> manufacturerService.getManufacturerById(999L))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("Manufacturer")
                .hasMessageContaining("id")
                .hasMessageContaining("999");

        verify(manufacturerRepository, times(1)).findById(999L);
    }

    @Test
    void getAllManufacturers_ShouldReturnListOfManufacturers() {
        // Given
        Manufacturer manufacturer2 = new Manufacturer();
        manufacturer2.setId(2L);
        manufacturer2.setName("LG");

        List<Manufacturer> manufacturers = Arrays.asList(testManufacturer, manufacturer2);
        when(manufacturerRepository.findAll()).thenReturn(manufacturers);

        // When
        List<Manufacturer> result = manufacturerService.getAllManufacturers();

        // Then
        assertThat(result).isNotNull();
        assertThat(result).hasSize(2);
        assertThat(result).containsExactly(testManufacturer, manufacturer2);
        verify(manufacturerRepository, times(1)).findAll();
    }

    @Test
    void getAllManufacturers_WithPageable_ShouldReturnPageOfManufacturers() {
        // Given
        Manufacturer manufacturer2 = new Manufacturer();
        manufacturer2.setId(2L);
        manufacturer2.setName("LG");

        List<Manufacturer> manufacturers = Arrays.asList(testManufacturer, manufacturer2);
        Page<Manufacturer> page = new PageImpl<>(manufacturers);
        Pageable pageable = PageRequest.of(0, 10);

        when(manufacturerRepository.findAll(pageable)).thenReturn(page);

        // When
        Page<Manufacturer> result = manufacturerService.getAllManufacturers(pageable);

        // Then
        assertThat(result).isNotNull();
        assertThat(result.getContent()).hasSize(2);
        assertThat(result.getTotalElements()).isEqualTo(2);
        verify(manufacturerRepository, times(1)).findAll(pageable);
    }

    @Test
    void searchManufacturers_ShouldReturnFilteredManufacturers() {
        // Given
        String searchTerm = "Sam";
        List<Manufacturer> manufacturers = Arrays.asList(testManufacturer);
        Page<Manufacturer> page = new PageImpl<>(manufacturers);
        Pageable pageable = PageRequest.of(0, 10);

        when(manufacturerRepository.searchManufacturers(searchTerm, pageable)).thenReturn(page);

        // When
        Page<Manufacturer> result = manufacturerService.searchManufacturers(searchTerm, pageable);

        // Then
        assertThat(result).isNotNull();
        assertThat(result.getContent()).hasSize(1);
        assertThat(result.getContent().get(0).getName()).contains("Sam");
        verify(manufacturerRepository, times(1)).searchManufacturers(searchTerm, pageable);
    }

    @Test
    void searchManufacturers_WithNoResults_ShouldReturnEmptyPage() {
        // Given
        String searchTerm = "NonExistent";
        Page<Manufacturer> emptyPage = new PageImpl<>(Arrays.asList());
        Pageable pageable = PageRequest.of(0, 10);

        when(manufacturerRepository.searchManufacturers(searchTerm, pageable)).thenReturn(emptyPage);

        // When
        Page<Manufacturer> result = manufacturerService.searchManufacturers(searchTerm, pageable);

        // Then
        assertThat(result).isNotNull();
        assertThat(result.getContent()).isEmpty();
        assertThat(result.getTotalElements()).isEqualTo(0);
        verify(manufacturerRepository, times(1)).searchManufacturers(searchTerm, pageable);
    }
}

