package com.nsbm_projects.hotel_management_system.controller;

import com.nsbm_projects.hotel_management_system.dto.OrderResponse;
import com.nsbm_projects.hotel_management_system.dto.PlaceOrderRequest;
import com.nsbm_projects.hotel_management_system.service.OrderService;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173", "http://localhost:4173"})
public class OrderController {

    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('GUEST', 'ADMIN', 'STAFF')")
    public OrderResponse placeOrder(@RequestBody PlaceOrderRequest request) {
        return orderService.placeOrder(request);
    }

    @GetMapping("/status/{status}")
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
    public List<OrderResponse> getOrdersByStatus(@PathVariable String status) {
        return orderService.getOrdersByStatus(status.toUpperCase());
    }

    @PatchMapping("/{id}/status")
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
    public void updateOrderStatus(@PathVariable Integer id, @RequestParam String status) {
        orderService.updateOrderStatus(id, status.toUpperCase());
    }
}