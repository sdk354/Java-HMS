package com.nsbm_projects.hotel_management_system.service;

import com.nsbm_projects.hotel_management_system.dto.*;
import com.nsbm_projects.hotel_management_system.model.*;
import com.nsbm_projects.hotel_management_system.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class OrderService {

    private final OrderRepository orderRepository;
    private final ServiceItemRepository serviceItemRepository;
    private final UserRepository userRepository;
    private final BookingRepository bookingRepository;

    public OrderService(OrderRepository orderRepository, ServiceItemRepository serviceItemRepository, UserRepository userRepository, BookingRepository bookingRepository) {
        this.orderRepository = orderRepository;
        this.serviceItemRepository = serviceItemRepository;
        this.userRepository = userRepository;
        this.bookingRepository = bookingRepository;
    }

    @Transactional
    public OrderResponse placeOrder(PlaceOrderRequest request) {
        User user = userRepository.findById(request.getGuestId()).orElseThrow(() -> new IllegalArgumentException("User not found"));

        Booking booking = bookingRepository.findTopByGuest_User_UserIDOrderByCheckInDateDesc(user.getUserID()).orElseThrow(() -> new IllegalStateException("No active reservation found for this guest"));

        Order order = Order.builder().reservation(booking).status("PENDING").totalCost(request.getTotalCost()).orderDate(LocalDateTime.now()).build();

        Order saved = orderRepository.save(order);

        return new OrderResponse(saved.getOrderID(), user.getUserID(), saved.getStatus(), saved.getTotalCost(), saved.getOrderDate(), List.of());
    }

    @Transactional(readOnly = true)
    public List<OrderResponse> getOrdersByStatus(String status) {
        return orderRepository.findByStatus(status).stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    @Transactional
    public void updateOrderStatus(Integer orderId, String newStatus) {
        Order order = orderRepository.findById(orderId).orElseThrow(() -> new RuntimeException("Order not found"));

        order.setStatus(newStatus);
        orderRepository.save(order);
    }

    private OrderResponse mapToResponse(Order order) {
        return new OrderResponse(order.getOrderID(), order.getGuest() != null ? order.getGuest().getUser().getUserID() : null, order.getStatus(), order.getTotalCost(), order.getOrderDate(), List.of());
    }
}