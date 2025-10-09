package com.epam.rd.autocode.assessment.appliances.service;

import com.epam.rd.autocode.assessment.appliances.model.Manufacturer;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface ManufacturerService {
    Manufacturer createManufacturer(Manufacturer manufacturer);
    Manufacturer updateManufacturer(Long id, Manufacturer manufacturer);
    void deleteManufacturer(Long id);
    Manufacturer getManufacturerById(Long id);
    List<Manufacturer> getAllManufacturers();
    Page<Manufacturer> getAllManufacturers(Pageable pageable);
    Page<Manufacturer> searchManufacturers(String search, Pageable pageable);
}
