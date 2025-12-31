package com.nsbm_projects.hotel_management_system.realtime;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.nsbm_projects.hotel_management_system.service.RoomStatusPublisher;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Component;

/**
 * Listens to Redis channel and forwards messages to WebSocket topic.
 * This enables multi-instance scaling (Task 9/10).
 */
@Component
public class RedisRoomStatusSubscriber {

    private final SimpMessagingTemplate messagingTemplate;
    private final ObjectMapper objectMapper;

    public RedisRoomStatusSubscriber(SimpMessagingTemplate messagingTemplate, ObjectMapper objectMapper) {
        this.messagingTemplate = messagingTemplate;
        this.objectMapper = objectMapper;
    }

    // Called by MessageListenerAdapter
    public void handleMessage(String message) {
        try {
            RoomStatusMessage msg = objectMapper.readValue(message, RoomStatusMessage.class);
            messagingTemplate.convertAndSend(RoomStatusPublisher.WS_TOPIC, msg);
        } catch (Exception ignored) {
            // ignore invalid messages
        }
    }
}
