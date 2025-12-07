package com.nsbm_projects.hotel_management_system.repository;

import com.nsbm_projects.hotel_management_system.model.Guest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface GuestRepository extends JpaRepository<Guest, Long> {
    // Find a guest by email (useful for login or lookup later)
    Optional<Guest> findByEmail(String email);
}