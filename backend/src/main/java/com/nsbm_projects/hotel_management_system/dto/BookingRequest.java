package com.nsbm_projects.hotel_management_system.dto;

import lombok.Data;
import java.time.LocalDate;

@Data
public class BookingRequest {
    private Long guestId;
    private Long roomId;
    private LocalDate checkInDate;
    private LocalDate checkOutDate;
}
