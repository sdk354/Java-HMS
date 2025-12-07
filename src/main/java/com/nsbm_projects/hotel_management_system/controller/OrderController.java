package com.nsbm_projects.hotel_management_system.controller;

import com.nsbm_projects.hotel_management_system.model.FoodOrders;
import com.nsbm_projects.hotel_management_system.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin("*")
public class OrderController {

    @Autowired
    private OrderService orderService;

    // Place Order
    @PostMapping
    public FoodOrders placeOrder(@RequestBody FoodOrders order) {
        return orderService.placeOrder(order);
    }

    // Kitchen: Get Orders by Status (e.g., /api/orders/status/NEW)
    @GetMapping("/status/{status}")
    public List<FoodOrders> getOrdersByStatus(@PathVariable String status) {
        return orderService.getOrdersByStatus(status);
    }

    // Kitchen: Update Status (e.g., /api/orders/1/status?newStatus=PREPARING)
    @PatchMapping("/{id}/status")
    public ResponseEntity<FoodOrders> updateStatus(@PathVariable Long id, @RequestParam String newStatus) {
        try {
            return ResponseEntity.ok(orderService.updateOrderStatus(id, newStatus));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
}