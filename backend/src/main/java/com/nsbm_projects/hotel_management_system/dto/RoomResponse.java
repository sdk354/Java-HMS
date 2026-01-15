package com.nsbm_projects.hotel_management_system.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class RoomResponse {
    private Integer id;          // This will act as the unique internal identifier
    private Integer roomNumber;  // This is the display number (e.g., 101)
    private String type;        // Room Type Name (e.g., "Deluxe")
    private BigDecimal price;    // The calculated dynamic price
    private boolean available;   // Availability status
    private Integer capacity;    // Added: How many guests can fit in the room
}