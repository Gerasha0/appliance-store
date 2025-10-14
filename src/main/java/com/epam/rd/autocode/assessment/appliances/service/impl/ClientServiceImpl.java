package com.epam.rd.autocode.assessment.appliances.service.impl;

import com.epam.rd.autocode.assessment.appliances.aspect.Loggable;
import com.epam.rd.autocode.assessment.appliances.exception.ResourceNotFoundException;
import com.epam.rd.autocode.assessment.appliances.model.Client;
import com.epam.rd.autocode.assessment.appliances.repository.ClientRepository;
import com.epam.rd.autocode.assessment.appliances.service.ClientService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Slf4j
@Service
@Transactional
@RequiredArgsConstructor
public class ClientServiceImpl implements ClientService {

    private final ClientRepository clientRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    @Loggable
    public Client createClient(Client client) {
        client.setPassword(passwordEncoder.encode(client.getPassword()));
        return clientRepository.save(client);
    }

    @Override
    @Loggable
    public Client updateClient(Long id, Client client, String newPassword) {
        Client existing = getClientById(id);
        
        log.info("Updating client {}: client object hash={}, existing object hash={}, are same? {}", 
            id, 
            System.identityHashCode(client),
            System.identityHashCode(existing),
            client == existing);
        
        existing.setFirstName(client.getFirstName());
        existing.setLastName(client.getLastName());
        existing.setEmail(client.getEmail());
        existing.setPhone(client.getPhone());
        existing.setAddress(client.getAddress());
        existing.setCard(client.getCard());
        
        if (newPassword != null && !newPassword.trim().isEmpty()) {
            log.info("Encoding and updating new password for client {}", id);
            existing.setPassword(passwordEncoder.encode(newPassword));
        } else {
            log.info("No new password provided, keeping existing password for client {}", id);
        }
        
        return clientRepository.save(existing);
    }

    @Override
    @Loggable
    public void deleteClient(Long id) {
        clientRepository.deleteById(id);
    }

    @Override
    public Client getClientById(Long id) {
        return clientRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Client", "id", id));
    }

    @Override
    public List<Client> getAllClients() {
        return clientRepository.findAll();
    }

    @Override
    public Page<Client> getAllClients(Pageable pageable) {
        return clientRepository.findAll(pageable);
    }

    @Override
    public Page<Client> searchClients(String search, Pageable pageable) {
        return clientRepository.searchClients(search, pageable);
    }
}