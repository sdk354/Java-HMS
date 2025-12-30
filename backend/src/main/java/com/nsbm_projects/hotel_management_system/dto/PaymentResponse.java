package com.nsbm_projects.hotel_management_system.dto;

import com.nsbm_projects.hotel_management_system.model.PaymentMethod;
import com.nsbm_projects.hotel_management_system.model.PaymentStatus;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
public class PaymentResponse {
    private Long id;
    private Long bookingId;
    private double amount;
    private PaymentMethod method;
    private PaymentStatus status;
    private LocalDateTime createdAt;
}
