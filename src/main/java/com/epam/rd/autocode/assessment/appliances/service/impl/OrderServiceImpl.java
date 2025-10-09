package com.epam.rd.autocode.assessment.appliances.service.impl;

import com.epam.rd.autocode.assessment.appliances.aspect.Loggable;
import com.epam.rd.autocode.assessment.appliances.exception.ResourceNotFoundException;
import com.epam.rd.autocode.assessment.appliances.model.Client;
import com.epam.rd.autocode.assessment.appliances.model.Employee;
import com.epam.rd.autocode.assessment.appliances.model.Orders;
import com.epam.rd.autocode.assessment.appliances.repository.ClientRepository;
import com.epam.rd.autocode.assessment.appliances.repository.EmployeeRepository;
import com.epam.rd.autocode.assessment.appliances.repository.OrdersRepository;
import com.epam.rd.autocode.assessment.appliances.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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
        order.setApproved(false);
        return ordersRepository.save(order);
    }

    @Override
    @Loggable
    public Orders updateOrder(Long id, Orders order) {
        Orders existing = getOrderById(id);
        existing.setClient(order.getClient());
        // Clear existing order rows and add new ones
        existing.getOrderRowSet().clear();
        if (order.getOrderRowSet() != null) {
            existing.getOrderRowSet().addAll(order.getOrderRowSet());
        }
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
