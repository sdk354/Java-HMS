package com.nsbm_projects.hotel_management_system.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class OrderResponse {

    private Integer orderId;

    private Integer guestId;

    private String status;

    private BigDecimal totalCost;

    private LocalDateTime orderDate;

    private List<Void> items;
}