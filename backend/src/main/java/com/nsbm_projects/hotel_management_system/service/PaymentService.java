package com.nsbm_projects.hotel_management_system.service;

import com.nsbm_projects.hotel_management_system.dto.PaymentRequest;
import com.nsbm_projects.hotel_management_system.dto.PaymentResponse;
import com.nsbm_projects.hotel_management_system.model.*;
import com.nsbm_projects.hotel_management_system.repository.BookingRepository;
import com.nsbm_projects.hotel_management_system.repository.PaymentRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class PaymentService {

    private final PaymentRepository paymentRepository;
    private final BookingRepository bookingRepository;

    public PaymentService(PaymentRepository paymentRepository, BookingRepository bookingRepository) {
        this.paymentRepository = paymentRepository;
        this.bookingRepository = bookingRepository;
    }

    @Transactional
    public PaymentResponse makePayment(PaymentRequest request) {
        Booking booking = bookingRepository.findById(request.getBookingId())
                .orElseThrow(() -> new IllegalArgumentException("Booking not found"));

        Payment payment = new Payment();
        payment.setBooking(booking);
        payment.setAmount(request.getAmount()); // Uses helper in Payment.java

        try {
            payment.setMethod(PaymentMethod.valueOf(request.getMethod().toUpperCase()));
        } catch (IllegalArgumentException e) {
            payment.setMethod(PaymentMethod.CASH);
        }

        payment.setStatus(PaymentStatus.COMPLETED);

        booking.setBookingStatus(BookingStatus.CONFIRMED);
        bookingRepository.save(booking);

        Payment saved = paymentRepository.save(payment);
        return mapToResponse(saved);
    }

    public PaymentResponse getPaymentByBookingId(Integer bookingId) {
        // Matches the method name in PaymentRepository
        Payment payment = paymentRepository.findByBooking_ReservationID(bookingId)
                .orElseThrow(() -> new RuntimeException("Payment record not found for this booking"));

        return mapToResponse(payment);
    }

    private PaymentResponse mapToResponse(Payment payment) {
        return new PaymentResponse(
                payment.getBillID(),
                payment.getBooking().getReservationID(),
                payment.getAmount(), // Uses helper in Payment.java
                payment.getMethod(),
                payment.getStatus(),
                // FIXED: Converts LocalDate to LocalDateTime to match DTO
                payment.getCreatedAt() != null ? payment.getCreatedAt().atStartOfDay() : null
        );
    }
}