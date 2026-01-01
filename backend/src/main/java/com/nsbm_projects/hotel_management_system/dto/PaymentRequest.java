  // Review trigger comment
package com.nsbm_projects.hotel_management_system.dto;

import lombok.Data;

@Data
public class PaymentRequest {
    private Long bookingId;
    private double amount;
    private String method; // CASH, CARD, ONLINE
}
