package com.epam.rd.autocode.assessment.appliances.controller.api;

import com.epam.rd.autocode.assessment.appliances.dto.OrderRequestDTO;
import com.epam.rd.autocode.assessment.appliances.dto.OrderResponseDTO;
import com.epam.rd.autocode.assessment.appliances.dto.PageResponseDTO;
import com.epam.rd.autocode.assessment.appliances.dto.mapper.EntityMapper;
import com.epam.rd.autocode.assessment.appliances.model.*;
import com.epam.rd.autocode.assessment.appliances.service.ApplianceService;
import com.epam.rd.autocode.assessment.appliances.service.ClientService;
import com.epam.rd.autocode.assessment.appliances.service.OrderService;
import com.epam.rd.autocode.assessment.appliances.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
@PreAuthorize("isAuthenticated()")
public class OrderController {

    private final OrderService orderService;
    private final UserService userService;
    private final ClientService clientService;
    private final ApplianceService applianceService;
    private final EntityMapper entityMapper;

    @GetMapping
    @PreAuthorize("hasRole('EMPLOYEE')")
    public ResponseEntity<PageResponseDTO<OrderResponseDTO>> getAllOrders(
            @PageableDefault(size = 10, sort = "id", direction = Sort.Direction.DESC) Pageable pageable) {
        Page<Orders> page = orderService.getAllOrders(pageable);
        PageResponseDTO<OrderResponseDTO> response = entityMapper.toPageResponseDTO(
                page, entityMapper::toOrderResponseDTO);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/client/{clientId}")
    public ResponseEntity<PageResponseDTO<OrderResponseDTO>> getOrdersByClientId(
            @PathVariable Long clientId,
            Authentication authentication,
            @PageableDefault(size = 10, sort = "id", direction = Sort.Direction.DESC) Pageable pageable) {
        // Employees can access any client's orders
        if (!authentication.getAuthorities().contains(new SimpleGrantedAuthority("ROLE_EMPLOYEE"))) {
            // Clients can only access their own orders
            User currentUser = userService.getUserByEmail(authentication.getName());
            if (!(currentUser instanceof Client) || !currentUser.getId().equals(clientId)) {
                throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Access denied");
            }
        }
        Page<Orders> page = orderService.getOrdersByClientId(clientId, pageable);
        PageResponseDTO<OrderResponseDTO> response = entityMapper.toPageResponseDTO(
                page, entityMapper::toOrderResponseDTO);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/employee/{employeeId}")
    @PreAuthorize("hasRole('EMPLOYEE')")
    public ResponseEntity<PageResponseDTO<OrderResponseDTO>> getOrdersByEmployeeId(
            @PathVariable Long employeeId,
            @PageableDefault(size = 10, sort = "id", direction = Sort.Direction.DESC) Pageable pageable) {
        Page<Orders> page = orderService.getOrdersByEmployeeId(employeeId, pageable);
        PageResponseDTO<OrderResponseDTO> response = entityMapper.toPageResponseDTO(
                page, entityMapper::toOrderResponseDTO);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/status/{approved}")
    public ResponseEntity<PageResponseDTO<OrderResponseDTO>> getOrdersByApprovalStatus(
            @PathVariable Boolean approved,
            @PageableDefault(size = 10, sort = "id", direction = Sort.Direction.DESC) Pageable pageable) {
        Page<Orders> page = orderService.getOrdersByApprovalStatus(approved, pageable);
        PageResponseDTO<OrderResponseDTO> response = entityMapper.toPageResponseDTO(
                page, entityMapper::toOrderResponseDTO);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<OrderResponseDTO> getOrderById(@PathVariable Long id, Authentication authentication) {
        Orders order = orderService.getOrderById(id);

        // Employees can access any order
        if (!authentication.getAuthorities().contains(new SimpleGrantedAuthority("ROLE_EMPLOYEE"))) {
            // Clients can only access their own orders
            User currentUser = userService.getUserByEmail(authentication.getName());
            if (!(currentUser instanceof Client) || !order.getClient().getId().equals(currentUser.getId())) {
                throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Access denied");
            }
        }
        return ResponseEntity.ok(entityMapper.toOrderResponseDTO(order));
    }

    @PostMapping
    public ResponseEntity<OrderResponseDTO> createOrder(@Valid @RequestBody OrderRequestDTO dto) {
        // Get client
        Client client = clientService.getClientById(dto.getClientId());

        // Create order rows from DTOs
        List<OrderRow> orderRows = new ArrayList<>();
        for (var rowDto : dto.getOrderRows()) {
            Appliance appliance = applianceService.getApplianceById(rowDto.getApplianceId());
            OrderRow orderRow = entityMapper.toOrderRowEntity(rowDto, appliance);
            orderRows.add(orderRow);
        }

        // Create order
        Orders order = entityMapper.toOrderEntity(dto, client, orderRows);
        Orders created = orderService.createOrder(order);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(entityMapper.toOrderResponseDTO(created));
    }

    @PutMapping("/{id}")
    public ResponseEntity<OrderResponseDTO> updateOrder(
            @PathVariable Long id,
            @Valid @RequestBody OrderRequestDTO dto,
            Authentication authentication) {
        Orders existing = orderService.getOrderById(id);

        // Employees can update any order
        if (!authentication.getAuthorities().contains(new SimpleGrantedAuthority("ROLE_EMPLOYEE"))) {
            // Clients can only update their own orders
            User currentUser = userService.getUserByEmail(authentication.getName());
            if (!(currentUser instanceof Client) || !existing.getClient().getId().equals(currentUser.getId())) {
                throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Access denied");
            }
            // Clients cannot update approved orders
            if (existing.getApproved()) {
                throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Cannot update approved order");
            }
        }

        // Update client if changed
        Client client = clientService.getClientById(dto.getClientId());
        existing.setClient(client);

        // Update order rows
        existing.getOrderRowSet().clear();
        for (var rowDto : dto.getOrderRows()) {
            Appliance appliance = applianceService.getApplianceById(rowDto.getApplianceId());
            OrderRow orderRow = entityMapper.toOrderRowEntity(rowDto, appliance);
            existing.getOrderRowSet().add(orderRow);
        }

        Orders updated = orderService.updateOrder(id, existing);
        return ResponseEntity.ok(entityMapper.toOrderResponseDTO(updated));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteOrder(@PathVariable Long id, Authentication authentication) {
        Orders order = orderService.getOrderById(id);

        // Employees can delete any order
        if (!authentication.getAuthorities().contains(new SimpleGrantedAuthority("ROLE_EMPLOYEE"))) {
            // Clients can only delete their own orders
            User currentUser = userService.getUserByEmail(authentication.getName());
            if (!(currentUser instanceof Client) || !order.getClient().getId().equals(currentUser.getId())) {
                throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Access denied");
            }
            // Clients cannot delete approved orders
            if (order.getApproved()) {
                throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Cannot delete approved order");
            }
        }

        orderService.deleteOrder(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/approve")
    @PreAuthorize("hasRole('EMPLOYEE')")
    public ResponseEntity<OrderResponseDTO> approveOrder(@PathVariable Long id, Authentication authentication) {
        User currentUser = userService.getUserByEmail(authentication.getName());
        if (!(currentUser instanceof Employee)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Only employees can approve orders");
        }

        Orders approved = orderService.approveOrder(id, currentUser.getId());
        return ResponseEntity.ok(entityMapper.toOrderResponseDTO(approved));
    }
}
