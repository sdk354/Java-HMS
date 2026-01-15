package com.nsbm_projects.hotel_management_system;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.nsbm_projects.hotel_management_system.dto.PlaceOrderRequest;
import com.nsbm_projects.hotel_management_system.model.User;
import com.nsbm_projects.hotel_management_system.model.ServiceItem;
import com.nsbm_projects.hotel_management_system.repository.UserRepository;
import com.nsbm_projects.hotel_management_system.repository.ServiceItemRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
class OrderIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ServiceItemRepository serviceItemRepository;

    @Test
    @WithMockUser(username = "john_doe", roles = {"GUEST"})
    void placeOrder_shouldReturn200() throws Exception {

        // 1. Setup User matching your Users table seed (ID: 1)
        Integer testUserId = 1;
        if (!userRepository.existsById(testUserId)) {
            User testUser = User.builder()
                    .userID(testUserId)
                    .username("john_doe")
                    .email("jdoe@example.com")
                    .passwordHash("$2a$12$Y3Xd7PNstFHvXZA6dGFZQeGjEzZwH5qBkJ5/rMYRoE0JrweNJQB/q")
                    .fullName("John Doe")
                    .role("GUEST")
                    .enabled(true)
                    .build();
            userRepository.save(testUser);
        }

        // 2. Setup ServiceItem (ID: 1)
        Integer serviceItemId = 1;
        if (!serviceItemRepository.existsById(serviceItemId)) {
            ServiceItem item = ServiceItem.builder()
                    .itemID(serviceItemId)
                    .itemName("Breakfast")
                    .unitPrice(new BigDecimal("25.00"))
                    .category("Food")
                    .availability("Available")
                    .build();
            serviceItemRepository.save(item);
        }

        // 3. Construct Request - Synchronized with the new PlaceOrderRequest DTO
        PlaceOrderRequest request = new PlaceOrderRequest();
        request.setGuestId(testUserId);      // Required by OrderService
        request.setReservationId(1);        // Links to existing seed data
        request.setTotalCost(new BigDecimal("25.00"));
        request.setStatus("PENDING");

        // 4. Perform Request
        mockMvc.perform(post("/api/orders")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk());
    }
}