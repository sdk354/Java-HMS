package com.nsbm_projects.hotel_management_system.dto;

import lombok.Data;

import java.util.List;

@Data
public class PlaceOrderRequest {
    private Long guestId;
    private List<OrderItemRequest> items;
}
