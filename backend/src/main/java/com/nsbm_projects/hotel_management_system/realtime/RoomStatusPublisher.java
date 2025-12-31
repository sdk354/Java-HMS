package com.nsbm_projects.hotel_management_system.realtime;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.nsbm_projects.hotel_management_system.config.RedisPubSubConfig;
import com.nsbm_projects.hotel_management_system.model.Room;
import com.nsbm_projects.hotel_management_system.realtime.RoomStatusMessage;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.time.Instant;

@Service
public class RoomStatusPublisher {

    private final SimpMessagingTemplate messagingTemplate;
    private final StringRedisTemplate stringRedisTemplate;
    private final ObjectMapper objectMapper;

    public static final String WS_TOPIC = "/topic/room-status";

    public RoomStatusPublisher(SimpMessagingTemplate messagingTemplate,
                               StringRedisTemplate stringRedisTemplate,
                               ObjectMapper objectMapper) {
        this.messagingTemplate = messagingTemplate;
        this.stringRedisTemplate = stringRedisTemplate;
        this.objectMapper = objectMapper;
    }

    /**
     * Call this after status changes (e.g., check-in/check-out).
     * Publishes to:
     *  - WebSocket topic (local instance)
     *  - Redis pub/sub channel (so other instances publish too)
     */
    public void publish(Room room, String reason) {
        RoomStatusMessage msg = new RoomStatusMessage(
                room.getId(),
                room.getRoomNumber(),
                room.getStatus(),
                room.isAvailable(),
                reason,
                Instant.now()
        );

        // 1) Local WS publish
        messagingTemplate.convertAndSend(WS_TOPIC, msg);

        // 2) Redis publish (fail-open if Redis is down)
        try {
            String json = objectMapper.writeValueAsString(msg);
            stringRedisTemplate.convertAndSend(RedisPubSubConfig.ROOM_STATUS_CHANNEL, json);
        } catch (JsonProcessingException | RuntimeException ignored) {
            // ignore to keep app running if Redis not available
        }
    }
}
