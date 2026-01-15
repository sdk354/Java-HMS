package com.nsbm_projects.hotel_management_system.model;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "Reservation")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Booking {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "reservationID")
    private Integer reservationID;

    @ManyToOne(optional = false)
    @JoinColumn(name = "guestID")
    private Guest guest;

    @ManyToOne(optional = false)
    @JoinColumn(name = "roomID")
    private Room room;

    @Column(name = "checkInDate", nullable = false)
    private LocalDate checkInDate;

    @Column(name = "checkOutDate", nullable = false)
    private LocalDate checkOutDate;

    // FIX: Remove @Enumerated and use @Convert
    @Convert(converter = BookingStatusConverter.class)
    @Column(name = "bookingStatus", nullable = false)
    private BookingStatus bookingStatus;

    @Column(name = "totalAmount", nullable = false)
    private BigDecimal totalAmount;
}