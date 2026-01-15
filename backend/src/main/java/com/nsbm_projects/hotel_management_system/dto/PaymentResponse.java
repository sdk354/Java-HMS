    package com.nsbm_projects.hotel_management_system.dto;

    import com.nsbm_projects.hotel_management_system.model.PaymentMethod;
    import com.nsbm_projects.hotel_management_system.model.PaymentStatus;
    import lombok.AllArgsConstructor;
    import lombok.Data;
    import lombok.NoArgsConstructor;

    import java.math.BigDecimal;
    import java.time.LocalDateTime;

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public class PaymentResponse {
        // Changed to Integer and renamed to match DB (billID)
        private Integer billID;

        // Changed to Integer to match Booking primary key
        private Integer bookingId;

        // Changed to BigDecimal for financial precision
        private BigDecimal amount;

        private PaymentMethod method;
        private PaymentStatus status;
        private LocalDateTime createdAt;
    }