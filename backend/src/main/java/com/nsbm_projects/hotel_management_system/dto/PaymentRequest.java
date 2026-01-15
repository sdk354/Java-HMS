package com.nsbm_projects.hotel_management_system.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PaymentRequest {
    // Changed to Integer to match Booking ID
    private Integer bookingId;

    // Changed to BigDecimal for financial precision
    private BigDecimal amount;

    // Method matches your PaymentMethod enum (CASH, CARD, ONLINE)
    private String method;
}