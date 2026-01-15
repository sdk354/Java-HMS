package com.nsbm_projects.hotel_management_system.model;

import com.fasterxml.jackson.annotation.JsonValue;
import lombok.Getter;

@Getter
public enum OrderStatus {
    PENDING("Pending"),       // Order received, waiting for staff
    PREPARING("Preparing"),   // Order is being worked on
    DELIVERED("Delivered"),   // Order has reached the guest
    COMPLETED("Completed"),   // Order is finished and billed
    CANCELLED("Cancelled");   // Order was aborted

    private final String displayValue;

    OrderStatus(String displayValue) {
        this.displayValue = displayValue;
    }

    @JsonValue
    public String getDisplayValue() {
        return displayValue;
    }
}