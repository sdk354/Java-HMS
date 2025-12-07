package com.nsbm_projects.hotel_management_system.model;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "food_orders")
public class FoodOrders {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private LocalDateTime orderTime;

    private BigDecimal totalAmount;

    // Status: "NEW", "PREPARING", "READY", "DELIVERED"
    private String status;

    // We link it to a Room so we know where to deliver
    private String roomNumber;

    // Constructors
    public FoodOrders() {}

    public FoodOrders(BigDecimal totalAmount, String roomNumber) {
        this.orderTime = LocalDateTime.now();
        this.totalAmount = totalAmount;
        this.status = "NEW"; // Default status
        this.roomNumber = roomNumber;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public LocalDateTime getOrderTime() { return orderTime; }
    public void setOrderTime(LocalDateTime orderTime) { this.orderTime = orderTime; }

    public BigDecimal getTotalAmount() { return totalAmount; }
    public void setTotalAmount(BigDecimal totalAmount) { this.totalAmount = totalAmount; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getRoomNumber() { return roomNumber; }
    public void setRoomNumber(String roomNumber) { this.roomNumber = roomNumber; }
}