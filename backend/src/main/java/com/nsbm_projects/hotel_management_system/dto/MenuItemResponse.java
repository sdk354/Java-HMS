package com.nsbm_projects.hotel_management_system.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import java.math.BigDecimal;

@Data
@AllArgsConstructor
public class MenuItemResponse {
    private Long id;
    private String name;
    private String category;
    private BigDecimal price;
    private boolean available;
}
