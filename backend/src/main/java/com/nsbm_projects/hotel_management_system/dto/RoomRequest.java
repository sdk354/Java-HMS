  // Review trigger comment
package com.nsbm_projects.hotel_management_system.dto;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class RoomRequest {

    private String roomNumber;
    private String type;
    private BigDecimal pricePerNight;   // ✅ FIXED
    private boolean available;
}
