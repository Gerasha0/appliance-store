package com.epam.rd.autocode.assessment.appliances.service;

import com.epam.rd.autocode.assessment.appliances.model.Client;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface ClientService {
    Client createClient(Client client);
    Client updateClient(Long id, Client client);
    void deleteClient(Long id);
    Client getClientById(Long id);
    List<Client> getAllClients();
    Page<Client> getAllClients(Pageable pageable);
    Page<Client> searchClients(String search, Pageable pageable);
}
