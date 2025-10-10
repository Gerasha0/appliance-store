package com.epam.rd.autocode.assessment.appliances.repository;

import com.epam.rd.autocode.assessment.appliances.model.Appliance;
import com.epam.rd.autocode.assessment.appliances.model.Category;
import com.epam.rd.autocode.assessment.appliances.model.PowerType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface ApplianceRepository extends JpaRepository<Appliance, Long> {
    Page<Appliance> findByCategory(Category category, Pageable pageable);
    
    Page<Appliance> findByPowerType(PowerType powerType, Pageable pageable);
    
    @Query("SELECT a FROM Appliance a WHERE LOWER(a.name) LIKE LOWER(CONCAT('%', :search, '%')) " +
           "OR LOWER(a.model) LIKE LOWER(CONCAT('%', :search, '%')) " +
           "OR LOWER(a.description) LIKE LOWER(CONCAT('%', :search, '%'))")
    Page<Appliance> searchAppliances(@Param("search") String search, Pageable pageable);
}