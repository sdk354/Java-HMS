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

    // Matches VARCHAR(50) status in SQL
    private String status;

    // Matches DECIMAL(10, 2) totalCost in SQL
    private BigDecimal totalCost;

    // Matches DATETIME(6) orderDate in SQL
    private LocalDateTime orderDate;

    // Kept as an empty list to avoid breaking other parts of the UI
    // that might expect an array, though the schema won't populate it.
    private List<Void> items;
}