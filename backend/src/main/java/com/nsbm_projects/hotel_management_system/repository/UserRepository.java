package com.nsbm_projects.hotel_management_system.repository;

import com.nsbm_projects.hotel_management_system.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Integer> {
    Optional<User> findByUsername(String username);
    Optional<User> findByEmail(String email);
    boolean existsByUsername(String username);
    boolean existsByEmail(String email);

    /**
     * Used by HousekeepingController to count staff on duty.
     * Matches the 'role' column in your Users table.
     */
    long countByRole(String role);

    /**
     * Useful for counting multiple staff types (e.g., ['admin', 'manager']).
     */
    long countByRoleIn(List<String> roles);
}