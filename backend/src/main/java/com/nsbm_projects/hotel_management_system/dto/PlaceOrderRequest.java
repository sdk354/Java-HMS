package com.nsbm_projects.hotel_management_system.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PlaceOrderRequest {

    private Integer guestId;

    private Integer reservationId;

    private BigDecimal totalCost;

    private String status;
}