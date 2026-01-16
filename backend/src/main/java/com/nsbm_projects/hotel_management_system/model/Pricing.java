package com.nsbm_projects.hotel_management_system.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "DynamicPricing")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Pricing {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer pricingID;

    @ManyToOne
    @JoinColumn(name = "roomTypeID")
    private RoomType roomType;

    @Transient
    @JsonProperty("roomTypeID")
    private Integer roomTypeID;

    private LocalDate startDate;
    private LocalDate endDate;

    @Column(name = "pricingMultiplier", precision = 5, scale = 2)
    private BigDecimal pricingMultiplier;

    private String seasonName;

    @PostLoad
    public void fillRoomTypeID() {
        if (roomType != null) {
            this.roomTypeID = roomType.getTypeID();
        }
    }
}