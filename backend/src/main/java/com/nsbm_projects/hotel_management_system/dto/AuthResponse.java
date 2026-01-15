package com.nsbm_projects.hotel_management_system.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class AuthResponse {
    private String token;
    private String tokenType = "Bearer";

    // NEW FIELDS FOR FRONTEND INTEGRATION
    private String role;     // Will be "guest", "manager", "housekeeping", or "administration"
    private String fullName; // To display "Welcome, Alex" on the dashboard
    private Long id;         // The database ID to fetch specific guest/staff records
}