package com.epam.rd.autocode.assessment.appliances.controller.api;

import com.epam.rd.autocode.assessment.appliances.dto.ApplianceRequestDTO;
import com.epam.rd.autocode.assessment.appliances.dto.ApplianceResponseDTO;
import com.epam.rd.autocode.assessment.appliances.dto.PageResponseDTO;
import com.epam.rd.autocode.assessment.appliances.dto.mapper.EntityMapper;
import com.epam.rd.autocode.assessment.appliances.model.Appliance;
import com.epam.rd.autocode.assessment.appliances.model.Category;
import com.epam.rd.autocode.assessment.appliances.model.Manufacturer;
import com.epam.rd.autocode.assessment.appliances.model.PowerType;
import com.epam.rd.autocode.assessment.appliances.service.ApplianceService;
import com.epam.rd.autocode.assessment.appliances.service.ManufacturerService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/appliances")
@RequiredArgsConstructor
public class ApplianceController {

    private final ApplianceService applianceService;
    private final ManufacturerService manufacturerService;
    private final EntityMapper entityMapper;

    @GetMapping
    public ResponseEntity<PageResponseDTO<ApplianceResponseDTO>> getAllAppliances(
            @PageableDefault(size = 10, sort = "id", direction = Sort.Direction.ASC) Pageable pageable) {
        Page<Appliance> page = applianceService.getAllAppliances(pageable);
        PageResponseDTO<ApplianceResponseDTO> response = entityMapper.toPageResponseDTO(
                page, entityMapper::toApplianceResponseDTO);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/search")
    public ResponseEntity<PageResponseDTO<ApplianceResponseDTO>> searchAppliances(
            @RequestParam String query,
            @PageableDefault(size = 10, sort = "id", direction = Sort.Direction.ASC) Pageable pageable) {
        Page<Appliance> page = applianceService.searchAppliances(query, pageable);
        PageResponseDTO<ApplianceResponseDTO> response = entityMapper.toPageResponseDTO(
                page, entityMapper::toApplianceResponseDTO);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/category/{category}")
    public ResponseEntity<PageResponseDTO<ApplianceResponseDTO>> getAppliancesByCategory(
            @PathVariable Category category,
            @PageableDefault(size = 10, sort = "id", direction = Sort.Direction.ASC) Pageable pageable) {
        Page<Appliance> page = applianceService.getAppliancesByCategory(category, pageable);
        PageResponseDTO<ApplianceResponseDTO> response = entityMapper.toPageResponseDTO(
                page, entityMapper::toApplianceResponseDTO);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/power-type/{powerType}")
    public ResponseEntity<PageResponseDTO<ApplianceResponseDTO>> getAppliancesByPowerType(
            @PathVariable PowerType powerType,
            @PageableDefault(size = 10, sort = "id", direction = Sort.Direction.ASC) Pageable pageable) {
        Page<Appliance> page = applianceService.getAppliancesByPowerType(powerType, pageable);
        PageResponseDTO<ApplianceResponseDTO> response = entityMapper.toPageResponseDTO(
                page, entityMapper::toApplianceResponseDTO);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApplianceResponseDTO> getApplianceById(@PathVariable Long id) {
        Appliance appliance = applianceService.getApplianceById(id);
        return ResponseEntity.ok(entityMapper.toApplianceResponseDTO(appliance));
    }

    @PostMapping
    @PreAuthorize("hasRole('EMPLOYEE')")
    public ResponseEntity<ApplianceResponseDTO> createAppliance(@Valid @RequestBody ApplianceRequestDTO dto) {
        Manufacturer manufacturer = manufacturerService.getManufacturerById(dto.getManufacturerId());
        Appliance appliance = entityMapper.toApplianceEntity(dto, manufacturer);
        Appliance created = applianceService.createAppliance(appliance);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(entityMapper.toApplianceResponseDTO(created));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('EMPLOYEE')")
    public ResponseEntity<ApplianceResponseDTO> updateAppliance(
            @PathVariable Long id, @Valid @RequestBody ApplianceRequestDTO dto) {
        Appliance appliance = applianceService.getApplianceById(id);
        Manufacturer manufacturer = manufacturerService.getManufacturerById(dto.getManufacturerId());
        entityMapper.updateApplianceFromDTO(dto, appliance, manufacturer);
        Appliance updated = applianceService.updateAppliance(id, appliance);
        return ResponseEntity.ok(entityMapper.toApplianceResponseDTO(updated));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('EMPLOYEE')")
    public ResponseEntity<Void> deleteAppliance(@PathVariable Long id) {
        applianceService.deleteAppliance(id);
        return ResponseEntity.noContent().build();
    }
}