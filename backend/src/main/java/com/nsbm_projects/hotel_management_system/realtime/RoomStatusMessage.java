package com.nsbm_projects.hotel_management_system.realtime;

import com.nsbm_projects.hotel_management_system.model.RoomStatus;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.Instant;

@Data
@AllArgsConstructor
public class RoomStatusMessage {
    private Long roomId;
    private String roomNumber;
    private RoomStatus status;
    private boolean available;
    private String reason;     // e.g., CHECKIN, CHECKOUT, MAINTENANCE
    private Instant timestamp;
}
