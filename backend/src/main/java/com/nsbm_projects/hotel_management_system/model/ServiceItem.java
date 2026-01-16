package com.nsbm_projects.hotel_management_system.model;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

@Entity
@Table(name = "ServiceItem")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ServiceItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "itemID")
    private Integer itemID;

    @Column(name = "itemName")
    private String itemName;

    @Column(name = "category")
    private String category;

    @Column(name = "unitPrice")
    private BigDecimal unitPrice;

    @Column(name = "availability")
    private String availability;
}