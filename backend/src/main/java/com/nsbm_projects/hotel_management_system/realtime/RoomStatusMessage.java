package com.nsbm_projects.hotel_management_system.realtime;

import com.nsbm_projects.hotel_management_system.model.RoomStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class RoomStatusMessage {
    private Integer roomNumber;
    private RoomStatus status;

    private Instant timestamp;
}