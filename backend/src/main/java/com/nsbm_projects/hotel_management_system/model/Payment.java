package com.nsbm_projects.hotel_management_system.model;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "Bill")
@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Payment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "billID")
    private Integer billID;

    @OneToOne(optional = false)
    @JoinColumn(name = "reservationID", nullable = false)
    private Booking booking;

    @Column(name = "generatedDate", nullable = false)
    @Builder.Default
    private LocalDate createdAt = LocalDate.now();

    @Column(name = "roomCharges", nullable = false)
    private BigDecimal roomCharges;

    @Column(name = "serviceCharges", nullable = false)
    private BigDecimal serviceCharges;

    @Column(name = "taxAmount", nullable = false)
    private BigDecimal taxAmount;

    @Column(name = "grandTotal", nullable = false)
    private BigDecimal grandTotal;

    @Enumerated(EnumType.STRING)
    @Column(name = "paymentMethod") // MATCHES init.sql exactly (no underscore)
    private PaymentMethod method;

    @Enumerated(EnumType.STRING)
    @Column(name = "paymentStatus") // MATCHES init.sql exactly (no underscore)
    private PaymentStatus status = PaymentStatus.PENDING;

    public void setAmount(BigDecimal amount) {
        this.grandTotal = amount;
    }

    public BigDecimal getAmount() {
        return this.grandTotal;
    }
}