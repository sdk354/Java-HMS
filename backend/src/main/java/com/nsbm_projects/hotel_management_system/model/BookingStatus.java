package com.nsbm_projects.hotel_management_system.model;

import lombok.Getter;

@Getter
public enum BookingStatus {
    CONFIRMED("Confirmed"), CANCELLED("Cancelled"), PENDING("Pending"), CHECKED_IN("Checked-In"), CHECKED_OUT("Checked-Out");

    private final String dbValue;

    BookingStatus(String dbValue) {
        this.dbValue = dbValue;
    }

    public static BookingStatus fromDbValue(String value) {
        for (BookingStatus status : BookingStatus.values()) {
            if (status.dbValue.equalsIgnoreCase(value)) {
                return status;
            }
        }
        return PENDING;
    }
}