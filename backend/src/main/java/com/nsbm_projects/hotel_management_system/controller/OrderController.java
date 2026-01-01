package com.nsbm_projects.hotel_management_system.controller;

import com.nsbm_projects.hotel_management_system.dto.OrderResponse;
import com.nsbm_projects.hotel_management_system.dto.PlaceOrderRequest;
import com.nsbm_projects.hotel_management_system.dto.UpdateOrderStatusRequest;
import com.nsbm_projects.hotel_management_system.model.OrderStatus;
import com.nsbm_projects.hotel_management_system.service.OrderService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    @PreAuthorize("hasAnyRole('USER','GUEST','ADMIN','STAFF')")
    @PostMapping
    public ResponseEntity<OrderResponse> placeOrder(
            @RequestBody PlaceOrderRequest request) {

        return ResponseEntity.ok(orderService.placeOrder(request));
    }

    @GetMapping
    @PreAuthorize("hasRole('STAFF')")
    public List<OrderResponse> getOrdersByStatus(
            @RequestParam OrderStatus status) {

        return orderService.getOrdersByStatus(status);
    }

    @PutMapping("/{id}/status")
    @PreAuthorize("hasRole('STAFF')")
    public ResponseEntity<Void> updateOrderStatus(
            @PathVariable Long id,
            @RequestBody UpdateOrderStatusRequest request) {

        orderService.updateOrderStatus(id, request.getStatus());
        return ResponseEntity.ok().build();
    }
}
