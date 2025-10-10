package com.epam.rd.autocode.assessment.appliances.controller.api;

import com.epam.rd.autocode.assessment.appliances.dto.EmployeeRequestDTO;
import com.epam.rd.autocode.assessment.appliances.dto.EmployeeResponseDTO;
import com.epam.rd.autocode.assessment.appliances.dto.PageResponseDTO;
import com.epam.rd.autocode.assessment.appliances.dto.mapper.EntityMapper;
import com.epam.rd.autocode.assessment.appliances.model.Employee;
import com.epam.rd.autocode.assessment.appliances.service.EmployeeService;
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
@RequestMapping("/api/employees")
@RequiredArgsConstructor
@PreAuthorize("hasRole('EMPLOYEE')")
public class EmployeeController {

    private final EmployeeService employeeService;
    private final EntityMapper entityMapper;

    @GetMapping
    public ResponseEntity<PageResponseDTO<EmployeeResponseDTO>> getAllEmployees(
            @PageableDefault(size = 10, sort = "id", direction = Sort.Direction.ASC) Pageable pageable) {
        Page<Employee> page = employeeService.getAllEmployees(pageable);
        PageResponseDTO<EmployeeResponseDTO> response = entityMapper.toPageResponseDTO(
                page, entityMapper::toEmployeeResponseDTO);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/search")
    public ResponseEntity<PageResponseDTO<EmployeeResponseDTO>> searchEmployees(
            @RequestParam String query,
            @PageableDefault(size = 10, sort = "id", direction = Sort.Direction.ASC) Pageable pageable) {
        Page<Employee> page = employeeService.searchEmployees(query, pageable);
        PageResponseDTO<EmployeeResponseDTO> response = entityMapper.toPageResponseDTO(
                page, entityMapper::toEmployeeResponseDTO);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<EmployeeResponseDTO> getEmployeeById(@PathVariable Long id) {
        Employee employee = employeeService.getEmployeeById(id);
        return ResponseEntity.ok(entityMapper.toEmployeeResponseDTO(employee));
    }

    @PostMapping
    public ResponseEntity<EmployeeResponseDTO> createEmployee(@Valid @RequestBody EmployeeRequestDTO dto) {
        Employee employee = entityMapper.toEmployeeEntity(dto);
        Employee created = employeeService.createEmployee(employee);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(entityMapper.toEmployeeResponseDTO(created));
    }

    @PutMapping("/{id}")
    public ResponseEntity<EmployeeResponseDTO> updateEmployee(
            @PathVariable Long id, @Valid @RequestBody EmployeeRequestDTO dto) {
        Employee employee = employeeService.getEmployeeById(id);
        entityMapper.updateEmployeeFromDTO(dto, employee);
        Employee updated = employeeService.updateEmployee(id, employee);
        return ResponseEntity.ok(entityMapper.toEmployeeResponseDTO(updated));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEmployee(@PathVariable Long id) {
        employeeService.deleteEmployee(id);
        return ResponseEntity.noContent().build();
    }
}