package com.nsbm_projects.hotel_management_system.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class RoomResponse {
    private Integer id;
    private Integer roomNumber;
    private String type;
    private BigDecimal price;
    private boolean available;
    private Integer capacity;
    private String status; // <--- ADD THIS LINE
}