package com.nsbm_projects.hotel_management_system.dto;

import lombok.Data;
import java.math.BigDecimal;

@Data
public class MenuItemRequest {
    private String name;
    private String category;
    private BigDecimal price;
    private boolean available;
}
