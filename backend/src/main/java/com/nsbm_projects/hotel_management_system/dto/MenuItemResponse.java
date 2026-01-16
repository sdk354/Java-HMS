package com.nsbm_projects.hotel_management_system.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class MenuItemResponse {
    private Integer itemID;
    private String name;
    private String category;
    private BigDecimal price;
    private boolean available;
}