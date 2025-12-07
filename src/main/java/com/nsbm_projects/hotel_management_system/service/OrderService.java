package com.nsbm_projects.hotel_management_system.service;

import com.nsbm_projects.hotel_management_system.model.FoodOrders;
import com.nsbm_projects.hotel_management_system.repository.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class OrderService {

    @Autowired
    private OrderRepository orderRepository;

    // Create Order (So you can test)
    public FoodOrders placeOrder(FoodOrders order) {
        order.setStatus("NEW"); // Always start as NEW
        return orderRepository.save(order);
    }

    // KITCHEN TASK: Get orders by status (e.g., "NEW", "PREPARING")
    public List<FoodOrders> getOrdersByStatus(String status) {
        return orderRepository.findByStatus(status);
    }

    // KITCHEN TASK: Update Status (e.g., "NEW" -> "PREPARING")
    public FoodOrders updateOrderStatus(Long id, String newStatus) {
        return orderRepository.findById(id).map(order -> {
            order.setStatus(newStatus);
            return orderRepository.save(order);
        }).orElseThrow(() -> new RuntimeException("Order not found"));
    }
}