package com.epam.rd.autocode.assessment.appliances.service;

import com.epam.rd.autocode.assessment.appliances.model.Appliance;
import com.epam.rd.autocode.assessment.appliances.model.Category;
import com.epam.rd.autocode.assessment.appliances.model.PowerType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface ApplianceService {
    Appliance createAppliance(Appliance appliance);
    Appliance updateAppliance(Long id, Appliance appliance);
    void deleteAppliance(Long id);
    Appliance getApplianceById(Long id);
    List<Appliance> getAllAppliances();
    Page<Appliance> getAllAppliances(Pageable pageable);
    Page<Appliance> searchAppliances(String search, Pageable pageable);
    Page<Appliance> getAppliancesByCategory(Category category, Pageable pageable);
    Page<Appliance> getAppliancesByPowerType(PowerType powerType, Pageable pageable);
}