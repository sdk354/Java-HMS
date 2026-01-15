package com.nsbm_projects.hotel_management_system.model;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "ServiceOrder")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "orderID")
    private Integer orderID;

    // Matches 'reservationID' in your SQL
    @ManyToOne(optional = false)
    @JoinColumn(name = "reservationID", nullable = false)
    private Booking reservation;

    @Column(name = "status", length = 50)
    private String status; // Changed to String to match your SQL VARCHAR(50)

    @Column(name = "totalCost", precision = 10, scale = 2)
    private BigDecimal totalCost; // Renamed to match SQL 'totalCost'

    @Column(name = "orderDate")
    private LocalDateTime orderDate; // Matches SQL DATETIME(6)

    // REMOVED: List<OrderItem> items - This table does not exist in your SQL schema.

    public Guest getGuest() {
        return this.reservation != null ? this.reservation.getGuest() : null;
    }
}