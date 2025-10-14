package com.epam.rd.autocode.assessment.appliances.dto.mapper;

import com.epam.rd.autocode.assessment.appliances.dto.*;
import com.epam.rd.autocode.assessment.appliances.model.*;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Component
public class EntityMapper {

    public UserResponseDTO toUserResponseDTO(User user) {
        if (user == null) return null;

        String role;
        if (user instanceof Employee) {
            role = "ROLE_EMPLOYEE";
        } else if (user instanceof Client) {
            role = "ROLE_CLIENT";
        } else {
            role = "ROLE_USER";
        }

        return new UserResponseDTO(user.getId(), user.getFirstName(), user.getLastName(), user.getEmail(), role);
    }

    public ClientResponseDTO toClientResponseDTO(Client client) {
        if (client == null) return null;
        return new ClientResponseDTO(
            client.getId(),
            client.getFirstName(),
            client.getLastName(),
            client.getEmail(),
            "ROLE_CLIENT",
            client.getPhone(),
            client.getAddress(),
            client.getCard()
        );
    }

    public Client toClientEntity(ClientRequestDTO dto) {
        if (dto == null) return null;
        Client client = new Client();
        client.setFirstName(dto.getFirstName());
        client.setLastName(dto.getLastName());
        client.setEmail(dto.getEmail());
        client.setPassword(dto.getPassword());
        client.setPhone(dto.getPhone());
        client.setAddress(dto.getAddress());
        client.setCard(dto.getCard());
        return client;
    }

    public void updateClientFromDTO(ClientRequestDTO dto, Client client) {
        if (dto == null || client == null) return;
        if (dto.getFirstName() != null) client.setFirstName(dto.getFirstName());
        if (dto.getLastName() != null) client.setLastName(dto.getLastName());
        if (dto.getEmail() != null) client.setEmail(dto.getEmail());
        if (dto.getPhone() != null) client.setPhone(dto.getPhone());
        if (dto.getAddress() != null) client.setAddress(dto.getAddress());
        if (dto.getCard() != null) client.setCard(dto.getCard());
    }

    public EmployeeResponseDTO toEmployeeResponseDTO(Employee employee) {
        if (employee == null) return null;
        return new EmployeeResponseDTO(
            employee.getId(),
            employee.getFirstName(),
            employee.getLastName(),
            employee.getEmail(),
            "ROLE_EMPLOYEE",
            employee.getPosition()
        );
    }

    public Employee toEmployeeEntity(EmployeeRequestDTO dto) {
        if (dto == null) return null;
        Employee employee = new Employee();
        employee.setFirstName(dto.getFirstName());
        employee.setLastName(dto.getLastName());
        employee.setEmail(dto.getEmail());
        employee.setPassword(dto.getPassword());
        employee.setPosition(dto.getPosition());
        return employee;
    }

    public void updateEmployeeFromDTO(EmployeeRequestDTO dto, Employee employee) {
        if (dto == null || employee == null) return;
        if (dto.getFirstName() != null) employee.setFirstName(dto.getFirstName());
        if (dto.getLastName() != null) employee.setLastName(dto.getLastName());
        if (dto.getEmail() != null) employee.setEmail(dto.getEmail());
        if (dto.getPosition() != null) employee.setPosition(dto.getPosition());
    }

    public ManufacturerResponseDTO toManufacturerResponseDTO(Manufacturer manufacturer) {
        if (manufacturer == null) return null;
        return new ManufacturerResponseDTO(
            manufacturer.getId(),
            manufacturer.getName(),
            manufacturer.getAddress(),
            manufacturer.getCountry()
        );
    }

    public Manufacturer toManufacturerEntity(ManufacturerRequestDTO dto) {
        if (dto == null) return null;
        Manufacturer manufacturer = new Manufacturer();
        manufacturer.setName(dto.getName());
        manufacturer.setAddress(dto.getAddress());
        manufacturer.setCountry(dto.getCountry());
        return manufacturer;
    }

    public void updateManufacturerFromDTO(ManufacturerRequestDTO dto, Manufacturer manufacturer) {
        if (dto == null || manufacturer == null) return;
        if (dto.getName() != null) manufacturer.setName(dto.getName());
        if (dto.getAddress() != null) manufacturer.setAddress(dto.getAddress());
        if (dto.getCountry() != null) manufacturer.setCountry(dto.getCountry());
    }

    public ApplianceResponseDTO toApplianceResponseDTO(Appliance appliance) {
        if (appliance == null) return null;

        ApplianceResponseDTO dto = new ApplianceResponseDTO();
        dto.setId(appliance.getId());
        dto.setName(appliance.getName());
        dto.setCategory(appliance.getCategory());
        dto.setModel(appliance.getModel());
        dto.setManufacturer(toManufacturerResponseDTO(appliance.getManufacturer()));
        dto.setPowerType(appliance.getPowerType());
        dto.setCharacteristic(appliance.getCharacteristic());
        dto.setDescription(appliance.getDescription());
        dto.setPower(appliance.getPower());
        dto.setPrice(appliance.getPrice());

        return dto;
    }

    public Appliance toApplianceEntity(ApplianceRequestDTO dto, Manufacturer manufacturer) {
        if (dto == null) return null;

        Appliance appliance = new Appliance();
        appliance.setName(dto.getName());
        appliance.setCategory(dto.getCategory());
        appliance.setModel(dto.getModel());
        appliance.setManufacturer(manufacturer);
        appliance.setPowerType(dto.getPowerType());
        appliance.setCharacteristic(dto.getCharacteristic());
        appliance.setDescription(dto.getDescription());
        appliance.setPower(dto.getPower());
        appliance.setPrice(dto.getPrice());

        return appliance;
    }

    public void updateApplianceFromDTO(ApplianceRequestDTO dto, Appliance appliance, Manufacturer manufacturer) {
        if (dto == null || appliance == null) return;

        if (dto.getName() != null) appliance.setName(dto.getName());
        if (dto.getCategory() != null) appliance.setCategory(dto.getCategory());
        if (dto.getModel() != null) appliance.setModel(dto.getModel());
        if (manufacturer != null) appliance.setManufacturer(manufacturer);
        if (dto.getPowerType() != null) appliance.setPowerType(dto.getPowerType());
        if (dto.getCharacteristic() != null) appliance.setCharacteristic(dto.getCharacteristic());
        if (dto.getDescription() != null) appliance.setDescription(dto.getDescription());
        if (dto.getPower() != null) appliance.setPower(dto.getPower());
        if (dto.getPrice() != null) appliance.setPrice(dto.getPrice());
    }

    public OrderRowResponseDTO toOrderRowResponseDTO(OrderRow orderRow) {
        if (orderRow == null) return null;

        return new OrderRowResponseDTO(
            orderRow.getId(),
            toApplianceResponseDTO(orderRow.getAppliance()),
            orderRow.getQuantity(),
            orderRow.getAmount()
        );
    }

    public OrderRow toOrderRowEntity(OrderRowRequestDTO dto, Appliance appliance) {
        if (dto == null) return null;

        OrderRow orderRow = new OrderRow();
        orderRow.setAppliance(appliance);
        orderRow.setQuantity(dto.getQuantity());

        BigDecimal amount = dto.getAmount();
        if (amount == null || amount.compareTo(BigDecimal.ZERO) == 0) {
            amount = appliance.getPrice()
                .multiply(BigDecimal.valueOf(dto.getQuantity()))
                .setScale(2, java.math.RoundingMode.HALF_UP); // Round to 2 decimal places
        }
        orderRow.setAmount(amount);

        return orderRow;
    }

    public OrderResponseDTO toOrderResponseDTO(Orders order) {
        if (order == null) return null;

        OrderResponseDTO dto = new OrderResponseDTO();
        dto.setId(order.getId());
        dto.setEmployee(order.getEmployee() != null ? toEmployeeResponseDTO(order.getEmployee()) : null);
        dto.setClient(toClientResponseDTO(order.getClient()));

        List<OrderRowResponseDTO> orderRowDTOs = order.getOrderRowSet().stream()
            .map(this::toOrderRowResponseDTO)
            .collect(Collectors.toList());
        dto.setOrderRows(orderRowDTOs);

        dto.setApproved(order.getApproved());

        BigDecimal totalAmount = order.getOrderRowSet().stream()
            .map(OrderRow::getAmount)
            .reduce(BigDecimal.ZERO, BigDecimal::add);
        dto.setTotalAmount(totalAmount);

        return dto;
    }

    public Orders toOrderEntity(OrderRequestDTO dto, Client client, List<OrderRow> orderRows) {
        if (dto == null) return null;

        Orders order = new Orders();
        order.setClient(client);
        order.setApproved(false);
        order.getOrderRowSet().addAll(orderRows);

        return order;
    }

    public <E, D> PageResponseDTO<D> toPageResponseDTO(Page<E> page, List<D> dtoContent) {
        PageResponseDTO<D> dto = new PageResponseDTO<>();
        dto.setContent(dtoContent);
        dto.setPageNumber(page.getNumber());
        dto.setPageSize(page.getSize());
        dto.setTotalElements(page.getTotalElements());
        dto.setTotalPages(page.getTotalPages());
        dto.setFirst(page.isFirst());
        dto.setLast(page.isLast());
        return dto;
    }

    public <E, D> PageResponseDTO<D> toPageResponseDTO(Page<E> page, java.util.function.Function<E, D> mapper) {
        List<D> dtoContent = page.getContent().stream()
            .map(mapper)
            .collect(Collectors.toList());
        return toPageResponseDTO(page, dtoContent);
    }
}