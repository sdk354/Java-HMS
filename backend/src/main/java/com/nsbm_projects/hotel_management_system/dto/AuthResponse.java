package com.nsbm_projects.hotel_management_system.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
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

    @Builder.Default
    private String tokenType = "Bearer";

    private String role;
    private String fullName;

    // This ensures the JSON sent to React is {"id": ...} instead of {"userID": ...}
    @JsonProperty("id")
    private Integer userID;
}