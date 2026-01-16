package com.nsbm_projects.hotel_management_system.realtime;

import com.nsbm_projects.hotel_management_system.model.Room;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.time.Instant;

@Service
@RequiredArgsConstructor
@Slf4j
public class RoomStatusPublisher {

    private final StringRedisTemplate redisTemplate;
    private final ObjectMapper objectMapper;

    public static final String REDIS_CHANNEL = "room-status-channel";
    public static final String WS_TOPIC = "/topic/room-updates";

    public void publish(Room room) {
        try {
            RoomStatusMessage message = new RoomStatusMessage(
                    room.getRoomNumber(), room.getStatus(),
                    Instant.now()
            );

            String jsonMessage = objectMapper.writeValueAsString(message);

            redisTemplate.convertAndSend(REDIS_CHANNEL, jsonMessage);

            log.info("Published room status update to Redis for room: {}", room.getRoomNumber());
        } catch (Exception e) {
            log.error("Failed to publish room status update", e);
        }
    }
}