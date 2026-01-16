package com.nsbm_projects.hotel_management_system.model;

import com.fasterxml.jackson.annotation.JsonValue;
import lombok.Getter;

@Getter
public enum OrderStatus {
    PENDING("Pending"), PREPARING("Preparing"), DELIVERED("Delivered"), COMPLETED("Completed"), CANCELLED("Cancelled");

    private final String displayValue;

    OrderStatus(String displayValue) {
        this.displayValue = displayValue;
    }

    @JsonValue
    public String getDisplayValue() {
        return displayValue;
    }
}