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

    // The ID of the RoomType (for internal mapping)
    private Integer roomTypeId;

    // The display name of the type (e.g., "Deluxe Suite")
    private String type;

    private Integer floorNumber;

    private boolean available;

    // The price if you want to update the RoomType's base price via this request
    private BigDecimal price;

    // Coordinates for the interactive hotel map
    private String mapCoordinates;
}