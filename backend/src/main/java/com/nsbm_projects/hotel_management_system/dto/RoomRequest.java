package com.nsbm_projects.hotel_management_system.dto;

import lombok.Data;

@Data
public class RoomRequest {
    private String roomNumber;
    private String type;
    private double pricePerNight;
    private boolean available;
}
