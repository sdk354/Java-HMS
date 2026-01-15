package com.nsbm_projects.hotel_management_system.dto;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class HousekeepingStatsDTO {
    // Getters and Setters
    private long pendingTasks;
    private long maintenanceRooms;
    private long staffOnDuty;
    private int progressPercentage;

    // Constructor
    public HousekeepingStatsDTO(long pendingTasks, long maintenanceRooms, long staffOnDuty, int progressPercentage) {
        this.pendingTasks = pendingTasks;
        this.maintenanceRooms = maintenanceRooms;
        this.staffOnDuty = staffOnDuty;
        this.progressPercentage = progressPercentage;
    }

}