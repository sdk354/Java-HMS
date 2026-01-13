package com.nsbm_projects.hotel_management_system.service;

import com.nsbm_projects.hotel_management_system.dto.*;
import com.nsbm_projects.hotel_management_system.model.*;
import com.nsbm_projects.hotel_management_system.repository.MenuItemRepository;
import com.nsbm_projects.hotel_management_system.repository.OrderRepository;
import com.nsbm_projects.hotel_management_system.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Service
public class OrderService {

    private final OrderRepository orderRepository;
    private final MenuItemRepository menuItemRepository;
    private final UserRepository userRepository;

    public OrderService(OrderRepository orderRepository,
                        MenuItemRepository menuItemRepository,
                        UserRepository userRepository) {
        this.orderRepository = orderRepository;
        this.menuItemRepository = menuItemRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public OrderResponse placeOrder(PlaceOrderRequest request) {
        if (request.getItems() == null || request.getItems().isEmpty()) {
            throw new IllegalArgumentException("Order must contain at least 1 item");
        }

        User guest = userRepository.findById(request.getGuestId())
                .orElseThrow(() -> new IllegalArgumentException("Guest not found"));

        Order order = new Order();
        order.setGuest(guest);
        order.setStatus(OrderStatus.NEW);
        order.setTotalAmount(BigDecimal.ZERO);

        List<OrderItemResponse> responseItems = new ArrayList<>();
        BigDecimal total = BigDecimal.ZERO;

        for (OrderItemRequest itemReq : request.getItems()) {
            if (itemReq.getQuantity() <= 0) {
                throw new IllegalArgumentException("Quantity must be > 0");
            }

            MenuItem menuItem = menuItemRepository.findById(itemReq.getMenuItemId())
                    .orElseThrow(() -> new IllegalArgumentException("Menu item not found: " + itemReq.getMenuItemId()));

            if (!menuItem.isAvailable()) {
                throw new IllegalStateException("Menu item unavailable: " + menuItem.getName());
            }

            BigDecimal unitPrice = menuItem.getPrice();
            BigDecimal lineTotal = unitPrice.multiply(BigDecimal.valueOf(itemReq.getQuantity()));
            total = total.add(lineTotal);

            OrderItem oi = new OrderItem();
            oi.setOrder(order);
            oi.setMenuItem(menuItem);
            oi.setQuantity(itemReq.getQuantity());
            oi.setUnitPrice(unitPrice);
            oi.setLineTotal(lineTotal);

            order.getItems().add(oi);

            responseItems.add(new OrderItemResponse(
                    menuItem.getId(),
                    menuItem.getName(),
                    itemReq.getQuantity(),
                    unitPrice,
                    lineTotal
            ));
        }

        order.setTotalAmount(total);

        Order saved = orderRepository.save(order);

        return new OrderResponse(
                saved.getId(),
                guest.getId(),
                saved.getStatus(),
                saved.getTotalAmount(),
                saved.getCreatedAt(),
                responseItems
        );
    }
    @Transactional(readOnly = true)
    public List<OrderResponse> getOrdersByStatus(OrderStatus status) {

        return orderRepository.findByStatus(status)
                .stream()
                .map(order -> new OrderResponse(
                        order.getId(),
                        order.getGuest().getId(),
                        order.getStatus(),
                        order.getTotalAmount(),
                        order.getCreatedAt(),
                        order.getItems().stream()
                                .map(i -> new OrderItemResponse(
                                        i.getMenuItem().getId(),
                                        i.getMenuItem().getName(),
                                        i.getQuantity(),
                                        i.getUnitPrice(),
                                        i.getLineTotal()
                                ))
                                .toList()
                ))
                .toList();
    }
    @Transactional
    public void updateOrderStatus(Long orderId, OrderStatus newStatus) {

        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        order.setStatus(newStatus);
        orderRepository.save(order);
    }
}
