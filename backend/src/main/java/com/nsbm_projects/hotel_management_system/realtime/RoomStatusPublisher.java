package com.nsbm_projects.hotel_management_system.realtime;

import com.nsbm_projects.hotel_management_system.model.Room;
import com.nsbm_projects.hotel_management_system.model.RoomStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

@Service
public class RoomStatusPublisher {

    private final SimpMessagingTemplate messagingTemplate;
    public static final String WS_TOPIC = "/topic/room-updates";

    public RoomStatusPublisher(SimpMessagingTemplate messagingTemplate) {
        this.messagingTemplate = messagingTemplate;
    }

    public void publish(Room room) {
        RoomStatusMessage message = new RoomStatusMessage(
                room.getId(),
                room.getRoomNumber(),
                room.getStatus()
        );

        messagingTemplate.convertAndSend("/topic/room-updates", message);
    }

    @Data
    @AllArgsConstructor
    static class RoomStatusMessage {
        private Long roomId;
        private String roomNumber;
        private RoomStatus status;
    }
}
