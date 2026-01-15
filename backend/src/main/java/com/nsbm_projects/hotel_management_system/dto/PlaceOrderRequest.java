package com.nsbm_projects.hotel_management_system.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PlaceOrderRequest {

    // Matches the User ID of the person placing the order
    private Integer guestId;

    // Added to link directly to the Reservation as per SQL schema
    private Integer reservationId;

    // Added to pass the total cost to the ServiceOrder table
    private BigDecimal totalCost;

    // Optional: Added to set status from the request if needed
    private String status;
}