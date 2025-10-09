package com.epam.rd.autocode.assessment.appliances.service;

import com.epam.rd.autocode.assessment.appliances.exception.ResourceAlreadyExistsException;
import com.epam.rd.autocode.assessment.appliances.exception.ResourceNotFoundException;
import com.epam.rd.autocode.assessment.appliances.model.Client;
import com.epam.rd.autocode.assessment.appliances.model.Employee;
import com.epam.rd.autocode.assessment.appliances.model.User;
import com.epam.rd.autocode.assessment.appliances.repository.UserRepository;
import com.epam.rd.autocode.assessment.appliances.service.impl.UserServiceImpl;
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
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
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
class UserServiceImplTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private UserServiceImpl userService;

    private User testUser;
    private Employee testEmployee;
    private Client testClient;

    @BeforeEach
    void setUp() {
        testUser = new User();
        testUser.setId(1L);
        testUser.setFirstName("Test");
        testUser.setLastName("User");
        testUser.setEmail("test@example.com");
        testUser.setPassword("encodedPassword");

        testEmployee = new Employee();
        testEmployee.setId(2L);
        testEmployee.setFirstName("Jane");
        testEmployee.setLastName("Smith");
        testEmployee.setEmail("jane@example.com");
        testEmployee.setPassword("encodedPassword");
        testEmployee.setPosition("Sales Manager");

        testClient = new Client();
        testClient.setId(3L);
        testClient.setFirstName("John");
        testClient.setLastName("Doe");
        testClient.setEmail("john@example.com");
        testClient.setPassword("encodedPassword");
        testClient.setPhone("+1234567890");
        testClient.setAddress("123 Main St");
        testClient.setCard("1234567890123456");
    }

    @Test
    void loadUserByUsername_WithValidEmail_ShouldReturnUserDetails() {
        // Given
        when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.of(testUser));

        // When
        UserDetails result = userService.loadUserByUsername("test@example.com");

        // Then
        assertThat(result).isNotNull();
        assertThat(result.getUsername()).isEqualTo("test@example.com");
        assertThat(result.getPassword()).isEqualTo("encodedPassword");
        assertThat(result.getAuthorities()).hasSize(1);
        verify(userRepository, times(1)).findByEmail("test@example.com");
    }

    @Test
    void loadUserByUsername_WithEmployee_ShouldReturnUserDetailsWithEmployeeRole() {
        // Given
        when(userRepository.findByEmail("jane@example.com")).thenReturn(Optional.of(testEmployee));

        // When
        UserDetails result = userService.loadUserByUsername("jane@example.com");

        // Then
        assertThat(result).isNotNull();
        assertThat(result.getAuthorities()).anyMatch(auth -> auth.getAuthority().equals("ROLE_EMPLOYEE"));
        verify(userRepository, times(1)).findByEmail("jane@example.com");
    }

    @Test
    void loadUserByUsername_WithClient_ShouldReturnUserDetailsWithClientRole() {
        // Given
        when(userRepository.findByEmail("john@example.com")).thenReturn(Optional.of(testClient));

        // When
        UserDetails result = userService.loadUserByUsername("john@example.com");

        // Then
        assertThat(result).isNotNull();
        assertThat(result.getAuthorities()).anyMatch(auth -> auth.getAuthority().equals("ROLE_CLIENT"));
        verify(userRepository, times(1)).findByEmail("john@example.com");
    }

    @Test
    void loadUserByUsername_WithInvalidEmail_ShouldThrowUsernameNotFoundException() {
        // Given
        when(userRepository.findByEmail(anyString())).thenReturn(Optional.empty());

        // When & Then
        assertThatThrownBy(() -> userService.loadUserByUsername("invalid@example.com"))
                .isInstanceOf(UsernameNotFoundException.class)
                .hasMessageContaining("User not found with email");

        verify(userRepository, times(1)).findByEmail("invalid@example.com");
    }

    @Test
    void createUser_WithValidData_ShouldEncodePasswordAndReturnSavedUser() {
        // Given
        User newUser = new User();
        newUser.setFirstName("New");
        newUser.setLastName("User");
        newUser.setEmail("newuser@example.com");
        newUser.setPassword("plainPassword");

        when(userRepository.existsByEmail("newuser@example.com")).thenReturn(false);
        when(passwordEncoder.encode("plainPassword")).thenReturn("encodedPassword");
        when(userRepository.save(any(User.class))).thenReturn(newUser);

        // When
        User result = userService.createUser(newUser);

        // Then
        assertThat(result).isNotNull();
        verify(userRepository, times(1)).existsByEmail("newuser@example.com");
        verify(passwordEncoder, times(1)).encode("plainPassword");
        verify(userRepository, times(1)).save(newUser);
    }

    @Test
    void createUser_WithDuplicateEmail_ShouldThrowResourceAlreadyExistsException() {
        // Given
        when(userRepository.existsByEmail("test@example.com")).thenReturn(true);

        // When & Then
        assertThatThrownBy(() -> userService.createUser(testUser))
                .isInstanceOf(ResourceAlreadyExistsException.class)
                .hasMessageContaining("User")
                .hasMessageContaining("email")
                .hasMessageContaining("test@example.com");

        verify(userRepository, times(1)).existsByEmail("test@example.com");
        verify(userRepository, never()).save(any());
    }

    @Test
    void updateUser_WithValidIdAndSameEmail_ShouldUpdateWithoutCheckingEmailExistence() {
        // Given
        User updatedUser = new User();
        updatedUser.setFirstName("Updated");
        updatedUser.setLastName("Name");
        updatedUser.setEmail("test@example.com");
        updatedUser.setPassword(null);

        when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));
        when(userRepository.save(any(User.class))).thenReturn(testUser);

        // When
        User result = userService.updateUser(1L, updatedUser);

        // Then
        assertThat(result).isNotNull();
        verify(userRepository, times(1)).findById(1L);
        verify(userRepository, never()).existsByEmail(anyString());
        verify(userRepository, times(1)).save(testUser);
    }

    @Test
    void updateUser_WithValidIdAndNewEmail_ShouldCheckEmailExistenceAndUpdate() {
        // Given
        User updatedUser = new User();
        updatedUser.setFirstName("Updated");
        updatedUser.setLastName("Name");
        updatedUser.setEmail("newemail@example.com");
        updatedUser.setPassword(null);

        when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));
        when(userRepository.existsByEmail("newemail@example.com")).thenReturn(false);
        when(userRepository.save(any(User.class))).thenReturn(testUser);

        // When
        User result = userService.updateUser(1L, updatedUser);

        // Then
        assertThat(result).isNotNull();
        verify(userRepository, times(1)).findById(1L);
        verify(userRepository, times(1)).existsByEmail("newemail@example.com");
        verify(userRepository, times(1)).save(testUser);
    }

    @Test
    void updateUser_WithDuplicateNewEmail_ShouldThrowResourceAlreadyExistsException() {
        // Given
        User updatedUser = new User();
        updatedUser.setFirstName("Updated");
        updatedUser.setLastName("Name");
        updatedUser.setEmail("duplicate@example.com");

        when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));
        when(userRepository.existsByEmail("duplicate@example.com")).thenReturn(true);

        // When & Then
        assertThatThrownBy(() -> userService.updateUser(1L, updatedUser))
                .isInstanceOf(ResourceAlreadyExistsException.class)
                .hasMessageContaining("User")
                .hasMessageContaining("email")
                .hasMessageContaining("duplicate@example.com");

        verify(userRepository, times(1)).findById(1L);
        verify(userRepository, times(1)).existsByEmail("duplicate@example.com");
        verify(userRepository, never()).save(any());
    }

    @Test
    void updateUser_WithPasswordChange_ShouldEncodeNewPassword() {
        // Given
        User updatedUser = new User();
        updatedUser.setFirstName("Updated");
        updatedUser.setLastName("Name");
        updatedUser.setEmail("test@example.com");
        updatedUser.setPassword("newPlainPassword");

        when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));
        when(passwordEncoder.encode("newPlainPassword")).thenReturn("newEncodedPassword");
        when(userRepository.save(any(User.class))).thenReturn(testUser);

        // When
        User result = userService.updateUser(1L, updatedUser);

        // Then
        assertThat(result).isNotNull();
        verify(passwordEncoder, times(1)).encode("newPlainPassword");
        verify(userRepository, times(1)).save(testUser);
    }

    @Test
    void updateUser_WithInvalidId_ShouldThrowResourceNotFoundException() {
        // Given
        when(userRepository.findById(anyLong())).thenReturn(Optional.empty());

        // When & Then
        assertThatThrownBy(() -> userService.updateUser(999L, testUser))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("User")
                .hasMessageContaining("id")
                .hasMessageContaining("999");

        verify(userRepository, times(1)).findById(999L);
        verify(userRepository, never()).save(any());
    }

    @Test
    void deleteUser_ShouldCallRepositoryDelete() {
        // Given
        doNothing().when(userRepository).deleteById(1L);

        // When
        userService.deleteUser(1L);

        // Then
        verify(userRepository, times(1)).deleteById(1L);
    }

    @Test
    void getUserById_WithValidId_ShouldReturnUser() {
        // Given
        when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));

        // When
        User result = userService.getUserById(1L);

        // Then
        assertThat(result).isNotNull();
        assertThat(result.getId()).isEqualTo(1L);
        assertThat(result.getFirstName()).isEqualTo("Test");
        verify(userRepository, times(1)).findById(1L);
    }

    @Test
    void getUserById_WithInvalidId_ShouldThrowResourceNotFoundException() {
        // Given
        when(userRepository.findById(anyLong())).thenReturn(Optional.empty());

        // When & Then
        assertThatThrownBy(() -> userService.getUserById(999L))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("User")
                .hasMessageContaining("id")
                .hasMessageContaining("999");

        verify(userRepository, times(1)).findById(999L);
    }

    @Test
    void getUserByEmail_WithValidEmail_ShouldReturnUser() {
        // Given
        when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.of(testUser));

        // When
        User result = userService.getUserByEmail("test@example.com");

        // Then
        assertThat(result).isNotNull();
        assertThat(result.getEmail()).isEqualTo("test@example.com");
        verify(userRepository, times(1)).findByEmail("test@example.com");
    }

    @Test
    void getUserByEmail_WithInvalidEmail_ShouldThrowResourceNotFoundException() {
        // Given
        when(userRepository.findByEmail(anyString())).thenReturn(Optional.empty());

        // When & Then
        assertThatThrownBy(() -> userService.getUserByEmail("invalid@example.com"))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("User")
                .hasMessageContaining("email")
                .hasMessageContaining("invalid@example.com");

        verify(userRepository, times(1)).findByEmail("invalid@example.com");
    }

    @Test
    void getAllUsers_ShouldReturnListOfUsers() {
        // Given
        List<User> users = Arrays.asList(testUser, testEmployee, testClient);
        when(userRepository.findAll()).thenReturn(users);

        // When
        List<User> result = userService.getAllUsers();

        // Then
        assertThat(result).isNotNull();
        assertThat(result).hasSize(3);
        assertThat(result).containsExactly(testUser, testEmployee, testClient);
        verify(userRepository, times(1)).findAll();
    }

    @Test
    void getAllUsers_WithPageable_ShouldReturnPageOfUsers() {
        // Given
        List<User> users = Arrays.asList(testUser, testEmployee);
        Page<User> page = new PageImpl<>(users);
        Pageable pageable = PageRequest.of(0, 10);

        when(userRepository.findAll(pageable)).thenReturn(page);

        // When
        Page<User> result = userService.getAllUsers(pageable);

        // Then
        assertThat(result).isNotNull();
        assertThat(result.getContent()).hasSize(2);
        assertThat(result.getTotalElements()).isEqualTo(2);
        verify(userRepository, times(1)).findAll(pageable);
    }

    @Test
    void searchUsers_ShouldReturnFilteredUsers() {
        // Given
        String searchTerm = "Test";
        List<User> users = Arrays.asList(testUser);
        Page<User> page = new PageImpl<>(users);
        Pageable pageable = PageRequest.of(0, 10);

        when(userRepository.searchUsers(searchTerm, pageable)).thenReturn(page);

        // When
        Page<User> result = userService.searchUsers(searchTerm, pageable);

        // Then
        assertThat(result).isNotNull();
        assertThat(result.getContent()).hasSize(1);
        verify(userRepository, times(1)).searchUsers(searchTerm, pageable);
    }

    @Test
    void searchUsers_WithNoResults_ShouldReturnEmptyPage() {
        // Given
        String searchTerm = "NonExistent";
        Page<User> emptyPage = new PageImpl<>(Arrays.asList());
        Pageable pageable = PageRequest.of(0, 10);

        when(userRepository.searchUsers(searchTerm, pageable)).thenReturn(emptyPage);

        // When
        Page<User> result = userService.searchUsers(searchTerm, pageable);

        // Then
        assertThat(result).isNotNull();
        assertThat(result.getContent()).isEmpty();
        assertThat(result.getTotalElements()).isEqualTo(0);
        verify(userRepository, times(1)).searchUsers(searchTerm, pageable);
    }
}
