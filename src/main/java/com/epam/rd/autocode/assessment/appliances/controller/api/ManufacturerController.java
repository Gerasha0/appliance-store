package com.epam.rd.autocode.assessment.appliances.controller.api;

import com.epam.rd.autocode.assessment.appliances.dto.ManufacturerRequestDTO;
import com.epam.rd.autocode.assessment.appliances.dto.ManufacturerResponseDTO;
import com.epam.rd.autocode.assessment.appliances.dto.PageResponseDTO;
import com.epam.rd.autocode.assessment.appliances.dto.mapper.EntityMapper;
import com.epam.rd.autocode.assessment.appliances.model.Manufacturer;
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
@RequestMapping("/api/manufacturers")
@RequiredArgsConstructor
@PreAuthorize("hasRole('EMPLOYEE')")
public class ManufacturerController {

    private final ManufacturerService manufacturerService;
    private final EntityMapper entityMapper;

    @GetMapping
    public ResponseEntity<PageResponseDTO<ManufacturerResponseDTO>> getAllManufacturers(
            @PageableDefault(size = 10, sort = "id", direction = Sort.Direction.ASC) Pageable pageable) {
        Page<Manufacturer> page = manufacturerService.getAllManufacturers(pageable);
        PageResponseDTO<ManufacturerResponseDTO> response = entityMapper.toPageResponseDTO(
                page, entityMapper::toManufacturerResponseDTO);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/search")
    public ResponseEntity<PageResponseDTO<ManufacturerResponseDTO>> searchManufacturers(
            @RequestParam String query,
            @PageableDefault(size = 10, sort = "id", direction = Sort.Direction.ASC) Pageable pageable) {
        Page<Manufacturer> page = manufacturerService.searchManufacturers(query, pageable);
        PageResponseDTO<ManufacturerResponseDTO> response = entityMapper.toPageResponseDTO(
                page, entityMapper::toManufacturerResponseDTO);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ManufacturerResponseDTO> getManufacturerById(@PathVariable Long id) {
        Manufacturer manufacturer = manufacturerService.getManufacturerById(id);
        return ResponseEntity.ok(entityMapper.toManufacturerResponseDTO(manufacturer));
    }

    @PostMapping
    public ResponseEntity<ManufacturerResponseDTO> createManufacturer(@Valid @RequestBody ManufacturerRequestDTO dto) {
        Manufacturer manufacturer = entityMapper.toManufacturerEntity(dto);
        Manufacturer created = manufacturerService.createManufacturer(manufacturer);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(entityMapper.toManufacturerResponseDTO(created));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ManufacturerResponseDTO> updateManufacturer(
            @PathVariable Long id, @Valid @RequestBody ManufacturerRequestDTO dto) {
        Manufacturer manufacturer = manufacturerService.getManufacturerById(id);
        entityMapper.updateManufacturerFromDTO(dto, manufacturer);
        Manufacturer updated = manufacturerService.updateManufacturer(id, manufacturer);
        return ResponseEntity.ok(entityMapper.toManufacturerResponseDTO(updated));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteManufacturer(@PathVariable Long id) {
        manufacturerService.deleteManufacturer(id);
        return ResponseEntity.noContent().build();
    }
}
