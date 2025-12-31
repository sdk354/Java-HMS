package com.nsbm_projects.hotel_management_system.dto;

import lombok.Data;

@Data
public class OrderItemRequest {
    private Long menuItemId;
    private int quantity;
}
