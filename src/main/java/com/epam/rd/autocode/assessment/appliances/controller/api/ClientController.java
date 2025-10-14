package com.epam.rd.autocode.assessment.appliances.controller.api;

import com.epam.rd.autocode.assessment.appliances.dto.ClientRequestDTO;
import com.epam.rd.autocode.assessment.appliances.dto.ClientResponseDTO;
import com.epam.rd.autocode.assessment.appliances.dto.PageResponseDTO;
import com.epam.rd.autocode.assessment.appliances.dto.mapper.EntityMapper;
import com.epam.rd.autocode.assessment.appliances.model.Client;
import com.epam.rd.autocode.assessment.appliances.service.ClientService;
import com.epam.rd.autocode.assessment.appliances.validation.OnCreate;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequestMapping("/api/clients")
@RequiredArgsConstructor
@PreAuthorize("hasRole('EMPLOYEE')")
public class ClientController {

    private final ClientService clientService;
    private final EntityMapper entityMapper;

    @GetMapping
    public ResponseEntity<PageResponseDTO<ClientResponseDTO>> getAllClients(
            @PageableDefault(size = 10, sort = "id", direction = Sort.Direction.ASC) Pageable pageable) {
        Page<Client> page = clientService.getAllClients(pageable);
        PageResponseDTO<ClientResponseDTO> response = entityMapper.toPageResponseDTO(
                page, entityMapper::toClientResponseDTO);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/search")
    public ResponseEntity<PageResponseDTO<ClientResponseDTO>> searchClients(
            @RequestParam String query,
            @PageableDefault(size = 10, sort = "id", direction = Sort.Direction.ASC) Pageable pageable) {
        Page<Client> page = clientService.searchClients(query, pageable);
        PageResponseDTO<ClientResponseDTO> response = entityMapper.toPageResponseDTO(
                page, entityMapper::toClientResponseDTO);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ClientResponseDTO> getClientById(@PathVariable Long id) {
        Client client = clientService.getClientById(id);
        return ResponseEntity.ok(entityMapper.toClientResponseDTO(client));
    }

    @PostMapping
    public ResponseEntity<ClientResponseDTO> createClient(
            @Validated(OnCreate.class) @RequestBody ClientRequestDTO dto) {
        Client client = entityMapper.toClientEntity(dto);
        Client created = clientService.createClient(client);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(entityMapper.toClientResponseDTO(created));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ClientResponseDTO> updateClient(
            @PathVariable Long id, @Valid @RequestBody ClientRequestDTO dto) {
        log.info("Updating client {}, password provided: {}", id, dto.getPassword() != null);
        
        Client client = clientService.getClientById(id);
        entityMapper.updateClientFromDTO(dto, client);

        boolean updatePassword = dto.getPassword() != null && !dto.getPassword().trim().isEmpty();
        if (updatePassword) {
            log.info("New password provided for client {}", id);
        } else {
            log.info("Password not provided, keeping existing password for client {}", id);
        }

        Client updated = clientService.updateClient(id, client, updatePassword ? dto.getPassword() : null);
        return ResponseEntity.ok(entityMapper.toClientResponseDTO(updated));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteClient(@PathVariable Long id) {
        clientService.deleteClient(id);
        return ResponseEntity.noContent().build();
    }
}