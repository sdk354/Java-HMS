package com.nsbm_projects.hotel_management_system.dto;

import com.nsbm_projects.hotel_management_system.model.OrderStatus;
import lombok.Data;

@Data
public class UpdateOrderStatusRequest {
    private OrderStatus status;
}
