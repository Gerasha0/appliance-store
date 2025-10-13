package com.epam.rd.autocode.assessment.appliances.service.impl;

import com.epam.rd.autocode.assessment.appliances.aspect.Loggable;
import com.epam.rd.autocode.assessment.appliances.exception.ResourceNotFoundException;
import com.epam.rd.autocode.assessment.appliances.model.Client;
import com.epam.rd.autocode.assessment.appliances.model.Employee;
import com.epam.rd.autocode.assessment.appliances.model.Orders;
import com.epam.rd.autocode.assessment.appliances.model.OrderRow;
import com.epam.rd.autocode.assessment.appliances.repository.ClientRepository;
import com.epam.rd.autocode.assessment.appliances.repository.EmployeeRepository;
import com.epam.rd.autocode.assessment.appliances.repository.OrdersRepository;
import com.epam.rd.autocode.assessment.appliances.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
@Transactional
@RequiredArgsConstructor
public class OrderServiceImpl implements OrderService {

    private final OrdersRepository ordersRepository;
    private final EmployeeRepository employeeRepository;
    private final ClientRepository clientRepository;

    @Override
    @Loggable
    public Orders createOrder(Orders order) {
        // Ensure approved is set to false for new orders
        order.setApproved(false);

        // Ensure all order rows have the correct bidirectional relationship
        // This should already be done by addOrderRow() method, but we double-check
        if (order.getOrderRowSet() != null) {
            for (OrderRow orderRow : order.getOrderRowSet()) {
                if (orderRow.getOrder() == null) {
                    orderRow.setOrder(order);
                }
            }
        }

        return ordersRepository.save(order);
    }

    @Override
    @Loggable
    public Orders updateOrder(Long id, Orders order) {
        Orders existing = getOrderById(id);

        // Update client if changed
        existing.setClient(order.getClient());

        // Clear existing order rows completely
        // Create a temporary list to avoid ConcurrentModificationException
        List<OrderRow> rowsToRemove = new ArrayList<>(existing.getOrderRowSet());
        for (OrderRow row : rowsToRemove) {
            existing.removeOrderRow(row);
        }

        // Add new order rows with proper bidirectional relationship
        if (order.getOrderRowSet() != null && !order.getOrderRowSet().isEmpty()) {
            for (OrderRow orderRow : order.getOrderRowSet()) {
                // Create a new detached OrderRow to avoid issues with existing ones
                OrderRow newRow = new OrderRow();
                newRow.setAppliance(orderRow.getAppliance());
                newRow.setQuantity(orderRow.getQuantity());
                newRow.setAmount(orderRow.getAmount());
                existing.addOrderRow(newRow);
            }
        }

        // Save and return the updated order
        return ordersRepository.save(existing);
    }

    @Override
    @Loggable
    public void deleteOrder(Long id) {
        ordersRepository.deleteById(id);
    }

    @Override
    public Orders getOrderById(Long id) {
        return ordersRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Order", "id", id));
    }

    @Override
    public List<Orders> getAllOrders() {
        return ordersRepository.findAll();
    }

    @Override
    public Page<Orders> getAllOrders(Pageable pageable) {
        return ordersRepository.findAll(pageable);
    }

    @Override
    @Loggable
    public Orders approveOrder(Long id, Long employeeId) {
        Orders order = getOrderById(id);
        Employee employee = employeeRepository.findById(employeeId)
                .orElseThrow(() -> new ResourceNotFoundException("Employee", "id", employeeId));
        order.setEmployee(employee);
        order.setApproved(true);
        return ordersRepository.save(order);
    }

    @Override
    public Page<Orders> getOrdersByClientId(Long clientId, Pageable pageable) {
        Client client = clientRepository.findById(clientId)
                .orElseThrow(() -> new ResourceNotFoundException("Client", "id", clientId));
        return ordersRepository.findByClient(client, pageable);
    }

    @Override
    public Page<Orders> getOrdersByEmployeeId(Long employeeId, Pageable pageable) {
        Employee employee = employeeRepository.findById(employeeId)
                .orElseThrow(() -> new ResourceNotFoundException("Employee", "id", employeeId));
        return ordersRepository.findByEmployee(employee, pageable);
    }

    @Override
    public Page<Orders> getOrdersByApprovalStatus(Boolean approved, Pageable pageable) {
        return ordersRepository.findByApproved(approved, pageable);
    }
}