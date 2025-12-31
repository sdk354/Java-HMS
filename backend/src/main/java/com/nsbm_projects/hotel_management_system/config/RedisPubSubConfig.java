package com.nsbm_projects.hotel_management_system.config;

import com.nsbm_projects.hotel_management_system.realtime.RedisRoomStatusSubscriber;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.data.redis.listener.*;
import org.springframework.data.redis.listener.adapter.MessageListenerAdapter;

@Configuration
public class RedisPubSubConfig {

    public static final String ROOM_STATUS_CHANNEL = "hms:room-status";

    @Bean
    public ChannelTopic roomStatusTopic() {
        return new ChannelTopic(ROOM_STATUS_CHANNEL);
    }

    @Bean
    public MessageListenerAdapter roomStatusListenerAdapter(RedisRoomStatusSubscriber subscriber) {
        // subscriber must have handleMessage(String message)
        return new MessageListenerAdapter(subscriber, "handleMessage");
    }

    @Bean
    public RedisMessageListenerContainer redisMessageListenerContainer(
            RedisConnectionFactory connectionFactory,
            MessageListenerAdapter roomStatusListenerAdapter,
            ChannelTopic roomStatusTopic
    ) {
        RedisMessageListenerContainer container = new RedisMessageListenerContainer();
        container.setConnectionFactory(connectionFactory);

        // Subscribe to the channel and forward messages to WS clients
        container.addMessageListener(roomStatusListenerAdapter, roomStatusTopic);
        return container;
    }
}
