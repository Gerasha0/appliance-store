package com.epam.rd.autocode.assessment.appliances.service;

import com.epam.rd.autocode.assessment.appliances.model.Orders;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface OrderService {
    Orders createOrder(Orders order);
    Orders updateOrder(Long id, Orders order);
    void deleteOrder(Long id);
    Orders getOrderById(Long id);
    List<Orders> getAllOrders();
    Page<Orders> getAllOrders(Pageable pageable);
    Orders approveOrder(Long id, Long employeeId);
    Page<Orders> getOrdersByClientId(Long clientId, Pageable pageable);
    Page<Orders> getOrdersByEmployeeId(Long employeeId, Pageable pageable);
    Page<Orders> getOrdersByApprovalStatus(Boolean approved, Pageable pageable);
}