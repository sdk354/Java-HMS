package com.nsbm_projects.hotel_management_system.config;

import com.nsbm_projects.hotel_management_system.realtime.RedisRoomStatusSubscriber;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.data.redis.listener.*;
import org.springframework.data.redis.listener.adapter.MessageListenerAdapter;

@Configuration
@Profile("prod")
public class RedisPubSubConfig {

    public static final String ROOM_STATUS_CHANNEL = "hms:room-status";

    @Bean
    public ChannelTopic roomStatusTopic() {
        return new ChannelTopic(ROOM_STATUS_CHANNEL);
    }

    @Bean
    public MessageListenerAdapter roomStatusListenerAdapter(RedisRoomStatusSubscriber subscriber) {
        return new MessageListenerAdapter(subscriber, "handleMessage");
    }

    @Bean
    public RedisMessageListenerContainer redisMessageListenerContainer(RedisConnectionFactory connectionFactory, MessageListenerAdapter roomStatusListenerAdapter, ChannelTopic roomStatusTopic) {
        RedisMessageListenerContainer container = new RedisMessageListenerContainer();
        container.setConnectionFactory(connectionFactory);

        container.addMessageListener(roomStatusListenerAdapter, roomStatusTopic);
        return container;
    }
}
