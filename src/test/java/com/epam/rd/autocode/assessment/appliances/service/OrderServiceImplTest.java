package com.epam.rd.autocode.assessment.appliances.service;

import com.epam.rd.autocode.assessment.appliances.exception.ResourceNotFoundException;
import com.epam.rd.autocode.assessment.appliances.model.*;
import com.epam.rd.autocode.assessment.appliances.repository.ClientRepository;
import com.epam.rd.autocode.assessment.appliances.repository.EmployeeRepository;
import com.epam.rd.autocode.assessment.appliances.repository.OrdersRepository;
import com.epam.rd.autocode.assessment.appliances.service.impl.OrderServiceImpl;
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
import java.util.HashSet;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class OrderServiceImplTest {

    @Mock
    private OrdersRepository ordersRepository;

    @Mock
    private EmployeeRepository employeeRepository;

    @Mock
    private ClientRepository clientRepository;

    @InjectMocks
    private OrderServiceImpl orderService;

    private Orders testOrder;
    private Client testClient;
    private Employee testEmployee;

    @BeforeEach
    void setUp() {
        testClient = new Client();
        testClient.setId(1L);
        testClient.setFirstName("John");
        testClient.setLastName("Doe");
        testClient.setEmail("john@example.com");
        testClient.setPhone("+1234567890");
        testClient.setAddress("123 Main St");

        testEmployee = new Employee();
        testEmployee.setId(1L);
        testEmployee.setFirstName("Jane");
        testEmployee.setLastName("Smith");
        testEmployee.setEmail("jane@example.com");
        testEmployee.setPosition("Sales Manager");

        testOrder = new Orders();
        testOrder.setId(1L);
        testOrder.setClient(testClient);
        testOrder.setApproved(false);
        testOrder.setOrderRowSet(new HashSet<>());
    }

    @Test
    void createOrder_ShouldReturnSavedOrderWithApprovedFalse() {
        when(ordersRepository.save(any(Orders.class))).thenReturn(testOrder);

        Orders result = orderService.createOrder(testOrder);

        assertThat(result).isNotNull();
        assertThat(result.getId()).isEqualTo(1L);
        assertThat(result.getApproved()).isFalse();
        verify(ordersRepository, times(1)).save(testOrder);
    }

    @Test
    void updateOrder_WithValidId_ShouldReturnUpdatedOrder() {
        Orders updatedOrder = new Orders();
        updatedOrder.setClient(testClient);
        updatedOrder.setOrderRowSet(new HashSet<>());

        when(ordersRepository.findById(1L)).thenReturn(Optional.of(testOrder));
        when(ordersRepository.save(any(Orders.class))).thenReturn(testOrder);

        Orders result = orderService.updateOrder(1L, updatedOrder);

        assertThat(result).isNotNull();
        verify(ordersRepository, times(1)).findById(1L);
        verify(ordersRepository, times(1)).save(testOrder);
    }

    @Test
    void updateOrder_WithInvalidId_ShouldThrowResourceNotFoundException() {
        when(ordersRepository.findById(anyLong())).thenReturn(Optional.empty());

        assertThatThrownBy(() -> orderService.updateOrder(999L, testOrder))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("Order")
                .hasMessageContaining("id")
                .hasMessageContaining("999");

        verify(ordersRepository, times(1)).findById(999L);
        verify(ordersRepository, never()).save(any());
    }

    @Test
    void deleteOrder_ShouldCallRepositoryDelete() {
        doNothing().when(ordersRepository).deleteById(1L);

        orderService.deleteOrder(1L);

        verify(ordersRepository, times(1)).deleteById(1L);
    }

    @Test
    void getOrderById_WithValidId_ShouldReturnOrder() {
        when(ordersRepository.findById(1L)).thenReturn(Optional.of(testOrder));

        Orders result = orderService.getOrderById(1L);

        assertThat(result).isNotNull();
        assertThat(result.getId()).isEqualTo(1L);
        verify(ordersRepository, times(1)).findById(1L);
    }

    @Test
    void getOrderById_WithInvalidId_ShouldThrowResourceNotFoundException() {
        when(ordersRepository.findById(anyLong())).thenReturn(Optional.empty());

        assertThatThrownBy(() -> orderService.getOrderById(999L))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("Order")
                .hasMessageContaining("id")
                .hasMessageContaining("999");

        verify(ordersRepository, times(1)).findById(999L);
    }

    @Test
    void getAllOrders_ShouldReturnListOfOrders() {
        Orders order2 = new Orders();
        order2.setId(2L);
        order2.setClient(testClient);

        List<Orders> orders = Arrays.asList(testOrder, order2);
        when(ordersRepository.findAll()).thenReturn(orders);

        List<Orders> result = orderService.getAllOrders();

        assertThat(result).isNotNull();
        assertThat(result).hasSize(2);
        verify(ordersRepository, times(1)).findAll();
    }

    @Test
    void getAllOrders_WithPageable_ShouldReturnPageOfOrders() {
        List<Orders> orders = Arrays.asList(testOrder);
        Page<Orders> page = new PageImpl<>(orders);
        Pageable pageable = PageRequest.of(0, 10);

        when(ordersRepository.findAll(pageable)).thenReturn(page);

        Page<Orders> result = orderService.getAllOrders(pageable);

        assertThat(result).isNotNull();
        assertThat(result.getContent()).hasSize(1);
        assertThat(result.getTotalElements()).isEqualTo(1);
        verify(ordersRepository, times(1)).findAll(pageable);
    }

    @Test
    void approveOrder_WithValidIds_ShouldReturnApprovedOrder() {
        when(ordersRepository.findById(1L)).thenReturn(Optional.of(testOrder));
        when(employeeRepository.findById(1L)).thenReturn(Optional.of(testEmployee));
        when(ordersRepository.save(any(Orders.class))).thenReturn(testOrder);

        Orders result = orderService.approveOrder(1L, 1L);

        assertThat(result).isNotNull();
        assertThat(result.getApproved()).isTrue();
        assertThat(result.getEmployee()).isEqualTo(testEmployee);
        verify(ordersRepository, times(1)).findById(1L);
        verify(employeeRepository, times(1)).findById(1L);
        verify(ordersRepository, times(1)).save(testOrder);
    }

    @Test
    void approveOrder_WithInvalidOrderId_ShouldThrowResourceNotFoundException() {
        when(ordersRepository.findById(anyLong())).thenReturn(Optional.empty());

        assertThatThrownBy(() -> orderService.approveOrder(999L, 1L))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("Order")
                .hasMessageContaining("id")
                .hasMessageContaining("999");

        verify(ordersRepository, times(1)).findById(999L);
        verify(employeeRepository, never()).findById(any());
    }

    @Test
    void approveOrder_WithInvalidEmployeeId_ShouldThrowResourceNotFoundException() {
        when(ordersRepository.findById(1L)).thenReturn(Optional.of(testOrder));
        when(employeeRepository.findById(anyLong())).thenReturn(Optional.empty());

        assertThatThrownBy(() -> orderService.approveOrder(1L, 999L))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("Employee")
                .hasMessageContaining("id")
                .hasMessageContaining("999");

        verify(ordersRepository, times(1)).findById(1L);
        verify(employeeRepository, times(1)).findById(999L);
        verify(ordersRepository, never()).save(any());
    }

    @Test
    void getOrdersByClientId_WithValidClientId_ShouldReturnClientOrders() {
        List<Orders> orders = Arrays.asList(testOrder);
        Page<Orders> page = new PageImpl<>(orders);
        Pageable pageable = PageRequest.of(0, 10);

        when(clientRepository.findById(1L)).thenReturn(Optional.of(testClient));
        when(ordersRepository.findByClient(testClient, pageable)).thenReturn(page);

        Page<Orders> result = orderService.getOrdersByClientId(1L, pageable);

        assertThat(result).isNotNull();
        assertThat(result.getContent()).hasSize(1);
        assertThat(result.getContent().get(0).getClient()).isEqualTo(testClient);
        verify(clientRepository, times(1)).findById(1L);
        verify(ordersRepository, times(1)).findByClient(testClient, pageable);
    }

    @Test
    void getOrdersByClientId_WithInvalidClientId_ShouldThrowResourceNotFoundException() {
        when(clientRepository.findById(anyLong())).thenReturn(Optional.empty());

        assertThatThrownBy(() -> orderService.getOrdersByClientId(999L, PageRequest.of(0, 10)))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("Client")
                .hasMessageContaining("id")
                .hasMessageContaining("999");

        verify(clientRepository, times(1)).findById(999L);
        verify(ordersRepository, never()).findByClient(any(), any());
    }

    @Test
    void getOrdersByEmployeeId_WithValidEmployeeId_ShouldReturnEmployeeOrders() {
        testOrder.setEmployee(testEmployee);
        testOrder.setApproved(true);

        List<Orders> orders = Arrays.asList(testOrder);
        Page<Orders> page = new PageImpl<>(orders);
        Pageable pageable = PageRequest.of(0, 10);

        when(employeeRepository.findById(1L)).thenReturn(Optional.of(testEmployee));
        when(ordersRepository.findByEmployee(testEmployee, pageable)).thenReturn(page);

        Page<Orders> result = orderService.getOrdersByEmployeeId(1L, pageable);

        assertThat(result).isNotNull();
        assertThat(result.getContent()).hasSize(1);
        assertThat(result.getContent().get(0).getEmployee()).isEqualTo(testEmployee);
        verify(employeeRepository, times(1)).findById(1L);
        verify(ordersRepository, times(1)).findByEmployee(testEmployee, pageable);
    }

    @Test
    void getOrdersByEmployeeId_WithInvalidEmployeeId_ShouldThrowResourceNotFoundException() {
        when(employeeRepository.findById(anyLong())).thenReturn(Optional.empty());

        assertThatThrownBy(() -> orderService.getOrdersByEmployeeId(999L, PageRequest.of(0, 10)))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("Employee")
                .hasMessageContaining("id")
                .hasMessageContaining("999");

        verify(employeeRepository, times(1)).findById(999L);
        verify(ordersRepository, never()).findByEmployee(any(), any());
    }

    @Test
    void getOrdersByApprovalStatus_WithTrue_ShouldReturnApprovedOrders() {
        testOrder.setApproved(true);
        List<Orders> orders = Arrays.asList(testOrder);
        Page<Orders> page = new PageImpl<>(orders);
        Pageable pageable = PageRequest.of(0, 10);

        when(ordersRepository.findByApproved(true, pageable)).thenReturn(page);

        Page<Orders> result = orderService.getOrdersByApprovalStatus(true, pageable);

        assertThat(result).isNotNull();
        assertThat(result.getContent()).hasSize(1);
        assertThat(result.getContent().get(0).getApproved()).isTrue();
        verify(ordersRepository, times(1)).findByApproved(true, pageable);
    }

    @Test
    void getOrdersByApprovalStatus_WithFalse_ShouldReturnPendingOrders() {
        List<Orders> orders = Arrays.asList(testOrder);
        Page<Orders> page = new PageImpl<>(orders);
        Pageable pageable = PageRequest.of(0, 10);

        when(ordersRepository.findByApproved(false, pageable)).thenReturn(page);

        Page<Orders> result = orderService.getOrdersByApprovalStatus(false, pageable);

        assertThat(result).isNotNull();
        assertThat(result.getContent()).hasSize(1);
        assertThat(result.getContent().get(0).getApproved()).isFalse();
        verify(ordersRepository, times(1)).findByApproved(false, pageable);
    }
}