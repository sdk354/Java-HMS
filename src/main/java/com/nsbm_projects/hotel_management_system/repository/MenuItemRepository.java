package com.nsbm_projects.hotel_management_system.repository;

import com.nsbm_projects.hotel_management_system.model.MenuItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MenuItemRepository extends JpaRepository<MenuItem, Long> {
    // Basic CRUD is Auto Generated, i took this class code from AI

}