package com.nsbm_projects.hotel_management_system.dto;

import com.nsbm_projects.hotel_management_system.model.BookingStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BookingRequest {
    private Integer guestId;
    private Integer roomId;
    private LocalDate checkInDate;
    private LocalDate checkOutDate;

    private BookingStatus bookingStatus;
    private BigDecimal totalAmount;
}