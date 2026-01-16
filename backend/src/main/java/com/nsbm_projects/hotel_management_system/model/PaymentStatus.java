package com.nsbm_projects.hotel_management_system.model;

import com.fasterxml.jackson.annotation.JsonValue;
import lombok.Getter;

@Getter
public enum PaymentStatus {
    PENDING("PENDING"), COMPLETED("COMPLETED"), FAILED("FAILED");

    private final String displayValue;

    PaymentStatus(String displayValue) {
        this.displayValue = displayValue;
    }

    @JsonValue
    public String getDisplayValue() {
        return displayValue;
    }
}