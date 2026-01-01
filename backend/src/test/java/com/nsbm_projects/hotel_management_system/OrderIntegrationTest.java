package com.nsbm_projects.hotel_management_system.integration;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.nsbm_projects.hotel_management_system.dto.PlaceOrderRequest;
import com.nsbm_projects.hotel_management_system.dto.OrderItemRequest;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
class OrderIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    void placeOrder_shouldReturn200() throws Exception {

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
