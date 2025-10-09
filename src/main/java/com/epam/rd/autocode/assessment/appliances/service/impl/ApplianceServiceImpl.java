package com.epam.rd.autocode.assessment.appliances.service.impl;

import com.epam.rd.autocode.assessment.appliances.aspect.Loggable;
import com.epam.rd.autocode.assessment.appliances.exception.ResourceNotFoundException;
import com.epam.rd.autocode.assessment.appliances.model.Appliance;
import com.epam.rd.autocode.assessment.appliances.model.Category;
import com.epam.rd.autocode.assessment.appliances.model.PowerType;
import com.epam.rd.autocode.assessment.appliances.repository.ApplianceRepository;
import com.epam.rd.autocode.assessment.appliances.service.ApplianceService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
@RequiredArgsConstructor
public class ApplianceServiceImpl implements ApplianceService {

    private final ApplianceRepository applianceRepository;

    @Override
    @Loggable
    public Appliance createAppliance(Appliance appliance) {
        return applianceRepository.save(appliance);
    }

    @Override
    @Loggable
    public Appliance updateAppliance(Long id, Appliance appliance) {
        Appliance existing = getApplianceById(id);
        existing.setName(appliance.getName());
        existing.setCategory(appliance.getCategory());
        existing.setModel(appliance.getModel());
        existing.setManufacturer(appliance.getManufacturer());
        existing.setPowerType(appliance.getPowerType());
        existing.setCharacteristic(appliance.getCharacteristic());
        existing.setDescription(appliance.getDescription());
        existing.setPower(appliance.getPower());
        existing.setPrice(appliance.getPrice());
        return applianceRepository.save(existing);
    }

    @Override
    @Loggable
    public void deleteAppliance(Long id) {
        applianceRepository.deleteById(id);
    }

    @Override
    public Appliance getApplianceById(Long id) {
        return applianceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Appliance", "id", id));
    }

    @Override
    public List<Appliance> getAllAppliances() {
        return applianceRepository.findAll();
    }

    @Override
    public Page<Appliance> getAllAppliances(Pageable pageable) {
        return applianceRepository.findAll(pageable);
    }

    @Override
    public Page<Appliance> searchAppliances(String search, Pageable pageable) {
        return applianceRepository.searchAppliances(search, pageable);
    }

    @Override
    public Page<Appliance> getAppliancesByCategory(Category category, Pageable pageable) {
        return applianceRepository.findByCategory(category, pageable);
    }

    @Override
    public Page<Appliance> getAppliancesByPowerType(PowerType powerType, Pageable pageable) {
        return applianceRepository.findByPowerType(powerType, pageable);
    }
}
