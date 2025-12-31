package com.nsbm_projects.hotel_management_system.config;

import org.springframework.boot.actuator.health.Health;
import org.springframework.boot.actuator.health.HealthIndicator;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.stereotype.Component;

@Component
public class RedisHealthIndicator implements HealthIndicator {

    private final RedisConnectionFactory connectionFactory;

    public RedisHealthIndicator(RedisConnectionFactory connectionFactory) {
        this.connectionFactory = connectionFactory;
    }

    @Override
    public Health health() {
        try (var conn = connectionFactory.getConnection()) {
            String pong = conn.ping();
            return Health.up().withDetail("redis", pong).build();
        } catch (Exception e) {
            return Health.down(e).build();
        }
    }
}
