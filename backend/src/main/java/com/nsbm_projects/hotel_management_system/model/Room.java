package com.nsbm_projects.hotel_management_system.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "rooms")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
public class Room {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String roomNumber;

    @Column(nullable = false)
    private String type; // e.g., Single, Double, Suite

    @Column(nullable = false)
    private double pricePerNight;

    @Column(nullable = false)
    private boolean available = true;
}
