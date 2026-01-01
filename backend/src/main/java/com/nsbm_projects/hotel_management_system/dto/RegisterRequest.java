  // Review trigger comment
package com.nsbm_projects.hotel_management_system.dto;

import lombok.Data;

@Data
public class RegisterRequest {
    private String username;
    private String email;
    private String password;
    private String fullName;
}
