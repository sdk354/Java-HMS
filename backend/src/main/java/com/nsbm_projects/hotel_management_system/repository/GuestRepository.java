package com.nsbm_projects.hotel_management_system.repository;

import com.nsbm_projects.hotel_management_system.model.Guest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface GuestRepository extends JpaRepository<Guest, Integer> {

    /**
     * Finds a Guest profile by the underlying User ID.
     * Based on your SQL: Guest table has a userID column.
     */
    Optional<Guest> findByUser_UserID(Integer userID);
}