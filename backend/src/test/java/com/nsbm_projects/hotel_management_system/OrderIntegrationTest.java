package com.nsbm_projects.hotel_management_system;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.nsbm_projects.hotel_management_system.dto.PlaceOrderRequest;
import com.nsbm_projects.hotel_management_system.dto.OrderItemRequest;
import com.nsbm_projects.hotel_management_system.model.User;
import com.nsbm_projects.hotel_management_system.model.MenuItem;
import com.nsbm_projects.hotel_management_system.repository.UserRepository;
import com.nsbm_projects.hotel_management_system.repository.MenuItemRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;
import java.util.List;
import java.util.HashSet;

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
    private MenuItemRepository menuItemRepository;

    @Test
    @WithMockUser(username = "testuser", roles = {"USER"})
    void placeOrder_shouldReturn200() throws Exception {
        if (!userRepository.existsById(1L)) {
            User testUser = new User();
            testUser.setId(1L);
            testUser.setUsername("testuser");
            testUser.setEmail("test@example.com");
            testUser.setPassword("Password123");
            testUser.setEnabled(true);
            testUser.setRoles(new HashSet<>());
            userRepository.save(testUser);
        }

        if (!menuItemRepository.existsById(1L)) {
            MenuItem item = new MenuItem();
            item.setId(1L);
            item.setName("Test Item");
            item.setPrice(new BigDecimal("10.00"));
            menuItemRepository.save(item);
        }

        PlaceOrderRequest request = new PlaceOrderRequest();
        request.setGuestId(1L);

        OrderItemRequest item = new OrderItemRequest();
        item.setMenuItemId(1L);
        item.setQuantity(2);

        request.setItems(List.of(item));

        mockMvc.perform(post("/api/orders")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk());
    }
}