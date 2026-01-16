package com.nsbm_projects.hotel_management_system.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RoomRequest {
    private Integer roomNumber;
    private Integer roomTypeId;
    private String type;
    private Integer floorNumber;
    private boolean available;
    private String status; // <--- ADD THIS LINE
    private BigDecimal price;
    private String mapCoordinates;
}