package com.nsbm_projects.hotel_management_system.model;

import com.fasterxml.jackson.annotation.JsonValue;
import lombok.Getter;

@Getter
public enum RoomStatus {
    AVAILABLE("Available"), OCCUPIED("Booked"), CLEANING("Cleaning"), MAINTENANCE("Maintenance");

    private final String dbValue;

    RoomStatus(String dbValue) {
        this.dbValue = dbValue;
    }

    @JsonValue
    public String getDbValue() {
        return dbValue;
    }

    public static RoomStatus fromDbValue(String value) {
        for (RoomStatus status : RoomStatus.values()) {
            if (status.dbValue.equalsIgnoreCase(value)) {
                return status;
            }
        }
        return AVAILABLE;
    }
}