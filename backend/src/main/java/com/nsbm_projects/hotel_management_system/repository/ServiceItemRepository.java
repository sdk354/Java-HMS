package com.nsbm_projects.hotel_management_system.repository;

import com.nsbm_projects.hotel_management_system.model.ServiceItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ServiceItemRepository extends JpaRepository<ServiceItem, Integer> {

    // Matches SQL column 'availability'
    List<ServiceItem> findByAvailability(String availability);

    // Helper to find items where availability is exactly "Available"
    default List<ServiceItem> findByAvailabilityTrue() {
        return findByAvailability("Available");
    }

    // Matches SQL column 'category'
    List<ServiceItem> findByCategory(String category);
}