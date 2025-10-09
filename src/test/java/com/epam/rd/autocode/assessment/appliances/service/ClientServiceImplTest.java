package com.epam.rd.autocode.assessment.appliances.service;

import com.epam.rd.autocode.assessment.appliances.exception.ResourceNotFoundException;
import com.epam.rd.autocode.assessment.appliances.model.Client;
import com.epam.rd.autocode.assessment.appliances.repository.ClientRepository;
import com.epam.rd.autocode.assessment.appliances.service.impl.ClientServiceImpl;
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
class ClientServiceImplTest {

    @Mock
    private ClientRepository clientRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private ClientServiceImpl clientService;

    private Client testClient;

    @BeforeEach
    void setUp() {
        testClient = new Client();
        testClient.setId(1L);
        testClient.setFirstName("John");
        testClient.setLastName("Doe");
        testClient.setEmail("john@example.com");
        testClient.setPassword("encodedPassword");
        testClient.setPhone("+1234567890");
        testClient.setAddress("123 Main St");
        testClient.setCard("1234567890123456");
    }

    @Test
    void createClient_ShouldEncodePasswordAndReturnSavedClient() {
        // Given
        Client newClient = new Client();
        newClient.setFirstName("Jane");
        newClient.setLastName("Smith");
        newClient.setEmail("jane@example.com");
        newClient.setPassword("plainPassword");
        newClient.setPhone("+0987654321");
        newClient.setAddress("456 Oak Ave");
        newClient.setCard("0987654321098765");

        when(passwordEncoder.encode("plainPassword")).thenReturn("encodedPassword");
        when(clientRepository.save(any(Client.class))).thenReturn(newClient);

        // When
        Client result = clientService.createClient(newClient);

        // Then
        assertThat(result).isNotNull();
        verify(passwordEncoder, times(1)).encode("plainPassword");
        verify(clientRepository, times(1)).save(newClient);
    }

    @Test
    void updateClient_WithValidIdAndNoPasswordChange_ShouldUpdateWithoutEncodingPassword() {
        // Given
        Client updatedClient = new Client();
        updatedClient.setFirstName("John");
        updatedClient.setLastName("Updated");
        updatedClient.setEmail("john.updated@example.com");
        updatedClient.setPhone("+1111111111");
        updatedClient.setAddress("789 Elm St");
        updatedClient.setCard("1111111111111111");
        updatedClient.setPassword(null);

        when(clientRepository.findById(1L)).thenReturn(Optional.of(testClient));
        when(clientRepository.save(any(Client.class))).thenReturn(testClient);

        // When
        Client result = clientService.updateClient(1L, updatedClient);

        // Then
        assertThat(result).isNotNull();
        verify(clientRepository, times(1)).findById(1L);
        verify(passwordEncoder, never()).encode(anyString());
        verify(clientRepository, times(1)).save(testClient);
    }

    @Test
    void updateClient_WithValidIdAndPasswordChange_ShouldEncodeNewPassword() {
        // Given
        Client updatedClient = new Client();
        updatedClient.setFirstName("John");
        updatedClient.setLastName("Updated");
        updatedClient.setEmail("john.updated@example.com");
        updatedClient.setPhone("+1111111111");
        updatedClient.setAddress("789 Elm St");
        updatedClient.setCard("1111111111111111");
        updatedClient.setPassword("newPlainPassword");

        when(clientRepository.findById(1L)).thenReturn(Optional.of(testClient));
        when(passwordEncoder.encode("newPlainPassword")).thenReturn("newEncodedPassword");
        when(clientRepository.save(any(Client.class))).thenReturn(testClient);

        // When
        Client result = clientService.updateClient(1L, updatedClient);

        // Then
        assertThat(result).isNotNull();
        verify(clientRepository, times(1)).findById(1L);
        verify(passwordEncoder, times(1)).encode("newPlainPassword");
        verify(clientRepository, times(1)).save(testClient);
    }

    @Test
    void updateClient_WithEmptyPassword_ShouldNotEncodePassword() {
        // Given
        Client updatedClient = new Client();
        updatedClient.setFirstName("John");
        updatedClient.setLastName("Updated");
        updatedClient.setEmail("john.updated@example.com");
        updatedClient.setPhone("+1111111111");
        updatedClient.setAddress("789 Elm St");
        updatedClient.setCard("1111111111111111");
        updatedClient.setPassword("");

        when(clientRepository.findById(1L)).thenReturn(Optional.of(testClient));
        when(clientRepository.save(any(Client.class))).thenReturn(testClient);

        // When
        Client result = clientService.updateClient(1L, updatedClient);

        // Then
        assertThat(result).isNotNull();
        verify(passwordEncoder, never()).encode(anyString());
        verify(clientRepository, times(1)).save(testClient);
    }

    @Test
    void updateClient_WithInvalidId_ShouldThrowResourceNotFoundException() {
        // Given
        when(clientRepository.findById(anyLong())).thenReturn(Optional.empty());

        // When & Then
        assertThatThrownBy(() -> clientService.updateClient(999L, testClient))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("Client")
                .hasMessageContaining("id")
                .hasMessageContaining("999");

        verify(clientRepository, times(1)).findById(999L);
        verify(clientRepository, never()).save(any());
    }

    @Test
    void deleteClient_ShouldCallRepositoryDelete() {
        // Given
        doNothing().when(clientRepository).deleteById(1L);

        // When
        clientService.deleteClient(1L);

        // Then
        verify(clientRepository, times(1)).deleteById(1L);
    }

    @Test
    void getClientById_WithValidId_ShouldReturnClient() {
        // Given
        when(clientRepository.findById(1L)).thenReturn(Optional.of(testClient));

        // When
        Client result = clientService.getClientById(1L);

        // Then
        assertThat(result).isNotNull();
        assertThat(result.getId()).isEqualTo(1L);
        assertThat(result.getFirstName()).isEqualTo("John");
        verify(clientRepository, times(1)).findById(1L);
    }

    @Test
    void getClientById_WithInvalidId_ShouldThrowResourceNotFoundException() {
        // Given
        when(clientRepository.findById(anyLong())).thenReturn(Optional.empty());

        // When & Then
        assertThatThrownBy(() -> clientService.getClientById(999L))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("Client")
                .hasMessageContaining("id")
                .hasMessageContaining("999");

        verify(clientRepository, times(1)).findById(999L);
    }

    @Test
    void getAllClients_ShouldReturnListOfClients() {
        // Given
        Client client2 = new Client();
        client2.setId(2L);
        client2.setFirstName("Jane");
        client2.setLastName("Smith");

        List<Client> clients = Arrays.asList(testClient, client2);
        when(clientRepository.findAll()).thenReturn(clients);

        // When
        List<Client> result = clientService.getAllClients();

        // Then
        assertThat(result).isNotNull();
        assertThat(result).hasSize(2);
        assertThat(result).containsExactly(testClient, client2);
        verify(clientRepository, times(1)).findAll();
    }

    @Test
    void getAllClients_WithPageable_ShouldReturnPageOfClients() {
        // Given
        List<Client> clients = Arrays.asList(testClient);
        Page<Client> page = new PageImpl<>(clients);
        Pageable pageable = PageRequest.of(0, 10);

        when(clientRepository.findAll(pageable)).thenReturn(page);

        // When
        Page<Client> result = clientService.getAllClients(pageable);

        // Then
        assertThat(result).isNotNull();
        assertThat(result.getContent()).hasSize(1);
        assertThat(result.getTotalElements()).isEqualTo(1);
        verify(clientRepository, times(1)).findAll(pageable);
    }

    @Test
    void searchClients_ShouldReturnFilteredClients() {
        // Given
        String searchTerm = "John";
        List<Client> clients = Arrays.asList(testClient);
        Page<Client> page = new PageImpl<>(clients);
        Pageable pageable = PageRequest.of(0, 10);

        when(clientRepository.searchClients(searchTerm, pageable)).thenReturn(page);

        // When
        Page<Client> result = clientService.searchClients(searchTerm, pageable);

        // Then
        assertThat(result).isNotNull();
        assertThat(result.getContent()).hasSize(1);
        verify(clientRepository, times(1)).searchClients(searchTerm, pageable);
    }

    @Test
    void searchClients_WithNoResults_ShouldReturnEmptyPage() {
        // Given
        String searchTerm = "NonExistent";
        Page<Client> emptyPage = new PageImpl<>(Arrays.asList());
        Pageable pageable = PageRequest.of(0, 10);

        when(clientRepository.searchClients(searchTerm, pageable)).thenReturn(emptyPage);

        // When
        Page<Client> result = clientService.searchClients(searchTerm, pageable);

        // Then
        assertThat(result).isNotNull();
        assertThat(result.getContent()).isEmpty();
        assertThat(result.getTotalElements()).isEqualTo(0);
        verify(clientRepository, times(1)).searchClients(searchTerm, pageable);
    }
}
