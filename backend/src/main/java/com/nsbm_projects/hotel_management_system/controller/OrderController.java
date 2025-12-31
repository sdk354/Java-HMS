package com.nsbm_projects.hotel_management_system.controller;

import com.nsbm_projects.hotel_management_system.dto.OrderResponse;
import com.nsbm_projects.hotel_management_system.dto.PlaceOrderRequest;
import com.nsbm_projects.hotel_management_system.service.OrderService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    // RBAC audit: only authenticated users with USER/GUEST can place orders (Task 15)
    @PreAuthorize("hasAnyRole('USER','GUEST','ADMIN','STAFF')")
    @PostMapping
    public ResponseEntity<OrderResponse> placeOrder(@RequestBody PlaceOrderRequest request) {
        return ResponseEntity.ok(orderService.placeOrder(request));
    }
}
