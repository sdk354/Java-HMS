package com.nsbm_projects.hotel_management_system.dto;

import com.nsbm_projects.hotel_management_system.model.BookingStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class BookingResponse {
    private Integer bookingId;
    private Integer guestId;
    private String guestName;
    private Integer roomId;      // This acts as the unique room ID
    private String roomNumber;   // This is the display number (e.g., "101")
    private LocalDate checkInDate;
    private LocalDate checkOutDate;
    private BookingStatus bookingStatus;
    private BigDecimal totalAmount;

    // Fixed: The constructor now actually assigns the values
    public BookingResponse(Integer bookingId, Integer guestId, String guestName, Integer roomId,
                           LocalDate checkInDate, LocalDate checkOutDate,
                           BookingStatus bookingStatus, BigDecimal totalAmount) {
        this.bookingId = bookingId;
        this.guestId = guestId;
        this.guestName = guestName;
        this.roomId = roomId;
        this.checkInDate = checkInDate;
        this.checkOutDate = checkOutDate;
        this.bookingStatus = bookingStatus;
        this.totalAmount = totalAmount;
    }
}