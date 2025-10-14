package com.epam.rd.autocode.assessment.appliances.service;

import com.epam.rd.autocode.assessment.appliances.exception.ResourceNotFoundException;
import com.epam.rd.autocode.assessment.appliances.model.Employee;
import com.epam.rd.autocode.assessment.appliances.repository.EmployeeRepository;
import com.epam.rd.autocode.assessment.appliances.service.impl.EmployeeServiceImpl;
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
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class EmployeeServiceImplTest {

    @Mock
    private EmployeeRepository employeeRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private EmployeeServiceImpl employeeService;

    private Employee testEmployee;

    @BeforeEach
    void setUp() {
        testEmployee = new Employee();
        testEmployee.setId(1L);
        testEmployee.setFirstName("Jane");
        testEmployee.setLastName("Smith");
        testEmployee.setEmail("jane@example.com");
        testEmployee.setPassword("encodedPassword");
        testEmployee.setPosition("Sales Manager");
    }

    @Test
    void createEmployee_ShouldEncodePasswordAndReturnSavedEmployee() {
        Employee newEmployee = new Employee();
        newEmployee.setFirstName("John");
        newEmployee.setLastName("Doe");
        newEmployee.setEmail("john@example.com");
        newEmployee.setPassword("plainPassword");
        newEmployee.setPosition("IT Specialist");

        when(passwordEncoder.encode("plainPassword")).thenReturn("encodedPassword");
        when(employeeRepository.save(any(Employee.class))).thenReturn(newEmployee);

        Employee result = employeeService.createEmployee(newEmployee);

        assertThat(result).isNotNull();
        verify(passwordEncoder, times(1)).encode("plainPassword");
        verify(employeeRepository, times(1)).save(newEmployee);
    }

    @Test
    void updateEmployee_WithValidIdAndNoPasswordChange_ShouldUpdateWithoutEncodingPassword() {
        Employee updatedEmployee = new Employee();
        updatedEmployee.setFirstName("Jane");
        updatedEmployee.setLastName("Updated");
        updatedEmployee.setEmail("jane.updated@example.com");
        updatedEmployee.setPosition("Marketing Manager");
        updatedEmployee.setPassword(null);

        when(employeeRepository.findById(1L)).thenReturn(Optional.of(testEmployee));
        when(employeeRepository.save(any(Employee.class))).thenReturn(testEmployee);

        Employee result = employeeService.updateEmployee(1L, updatedEmployee);

        assertThat(result).isNotNull();
        verify(employeeRepository, times(1)).findById(1L);
        verify(passwordEncoder, never()).encode(anyString());
        verify(employeeRepository, times(1)).save(testEmployee);
    }

    @Test
    void updateEmployee_WithValidIdAndPasswordChange_ShouldEncodeNewPassword() {
        Employee updatedEmployee = new Employee();
        updatedEmployee.setFirstName("Jane");
        updatedEmployee.setLastName("Updated");
        updatedEmployee.setEmail("jane.updated@example.com");
        updatedEmployee.setPosition("Marketing Manager");
        updatedEmployee.setPassword("newPlainPassword");

        when(employeeRepository.findById(1L)).thenReturn(Optional.of(testEmployee));
        when(passwordEncoder.encode("newPlainPassword")).thenReturn("newEncodedPassword");
        when(employeeRepository.save(any(Employee.class))).thenReturn(testEmployee);

        Employee result = employeeService.updateEmployee(1L, updatedEmployee);

        assertThat(result).isNotNull();
        verify(employeeRepository, times(1)).findById(1L);
        verify(passwordEncoder, times(1)).encode("newPlainPassword");
        verify(employeeRepository, times(1)).save(testEmployee);
    }

    @Test
    void updateEmployee_WithEmptyPassword_ShouldNotEncodePassword() {
        Employee updatedEmployee = new Employee();
        updatedEmployee.setFirstName("Jane");
        updatedEmployee.setLastName("Updated");
        updatedEmployee.setEmail("jane.updated@example.com");
        updatedEmployee.setPosition("Marketing Manager");
        updatedEmployee.setPassword("");

        when(employeeRepository.findById(1L)).thenReturn(Optional.of(testEmployee));
        when(employeeRepository.save(any(Employee.class))).thenReturn(testEmployee);

        Employee result = employeeService.updateEmployee(1L, updatedEmployee);

        assertThat(result).isNotNull();
        verify(passwordEncoder, never()).encode(anyString());
        verify(employeeRepository, times(1)).save(testEmployee);
    }

    @Test
    void updateEmployee_WithInvalidId_ShouldThrowResourceNotFoundException() {
        when(employeeRepository.findById(anyLong())).thenReturn(Optional.empty());

        assertThatThrownBy(() -> employeeService.updateEmployee(999L, testEmployee))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("Employee")
                .hasMessageContaining("id")
                .hasMessageContaining("999");

        verify(employeeRepository, times(1)).findById(999L);
        verify(employeeRepository, never()).save(any());
    }

    @Test
    void deleteEmployee_ShouldCallRepositoryDelete() {
        doNothing().when(employeeRepository).deleteById(1L);

        employeeService.deleteEmployee(1L);

        verify(employeeRepository, times(1)).deleteById(1L);
    }

    @Test
    void getEmployeeById_WithValidId_ShouldReturnEmployee() {
        when(employeeRepository.findById(1L)).thenReturn(Optional.of(testEmployee));

        Employee result = employeeService.getEmployeeById(1L);

        assertThat(result).isNotNull();
        assertThat(result.getId()).isEqualTo(1L);
        assertThat(result.getFirstName()).isEqualTo("Jane");
        verify(employeeRepository, times(1)).findById(1L);
    }

    @Test
    void getEmployeeById_WithInvalidId_ShouldThrowResourceNotFoundException() {
        when(employeeRepository.findById(anyLong())).thenReturn(Optional.empty());

        assertThatThrownBy(() -> employeeService.getEmployeeById(999L))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("Employee")
                .hasMessageContaining("id")
                .hasMessageContaining("999");

        verify(employeeRepository, times(1)).findById(999L);
    }

    @Test
    void getAllEmployees_ShouldReturnListOfEmployees() {
        Employee employee2 = new Employee();
        employee2.setId(2L);
        employee2.setFirstName("John");
        employee2.setLastName("Doe");

        List<Employee> employees = Arrays.asList(testEmployee, employee2);
        when(employeeRepository.findAll()).thenReturn(employees);

        List<Employee> result = employeeService.getAllEmployees();

        assertThat(result).isNotNull();
        assertThat(result).hasSize(2);
        assertThat(result).containsExactly(testEmployee, employee2);
        verify(employeeRepository, times(1)).findAll();
    }

    @Test
    void getAllEmployees_WithPageable_ShouldReturnPageOfEmployees() {
        List<Employee> employees = Arrays.asList(testEmployee);
        Page<Employee> page = new PageImpl<>(employees);
        Pageable pageable = PageRequest.of(0, 10);

        when(employeeRepository.findAll(pageable)).thenReturn(page);

        Page<Employee> result = employeeService.getAllEmployees(pageable);

        assertThat(result).isNotNull();
        assertThat(result.getContent()).hasSize(1);
        assertThat(result.getTotalElements()).isEqualTo(1);
        verify(employeeRepository, times(1)).findAll(pageable);
    }

    @Test
    void searchEmployees_ShouldReturnFilteredEmployees() {
        String searchTerm = "Jane";
        List<Employee> employees = Arrays.asList(testEmployee);
        Page<Employee> page = new PageImpl<>(employees);
        Pageable pageable = PageRequest.of(0, 10);

        when(employeeRepository.searchEmployees(searchTerm, pageable)).thenReturn(page);

        Page<Employee> result = employeeService.searchEmployees(searchTerm, pageable);

        assertThat(result).isNotNull();
        assertThat(result.getContent()).hasSize(1);
        verify(employeeRepository, times(1)).searchEmployees(searchTerm, pageable);
    }

    @Test
    void searchEmployees_WithNoResults_ShouldReturnEmptyPage() {
        String searchTerm = "NonExistent";
        Page<Employee> emptyPage = new PageImpl<>(Arrays.asList());
        Pageable pageable = PageRequest.of(0, 10);

        when(employeeRepository.searchEmployees(searchTerm, pageable)).thenReturn(emptyPage);

        Page<Employee> result = employeeService.searchEmployees(searchTerm, pageable);

        assertThat(result).isNotNull();
        assertThat(result.getContent()).isEmpty();
        assertThat(result.getTotalElements()).isEqualTo(0);
        verify(employeeRepository, times(1)).searchEmployees(searchTerm, pageable);
    }
}