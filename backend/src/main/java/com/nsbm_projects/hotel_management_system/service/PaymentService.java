package com.nsbm_projects.hotel_management_system.service;

import com.nsbm_projects.hotel_management_system.dto.PaymentRequest;
import com.nsbm_projects.hotel_management_system.dto.PaymentResponse;
import com.nsbm_projects.hotel_management_system.model.*;
import com.nsbm_projects.hotel_management_system.repository.BookingRepository;
import com.nsbm_projects.hotel_management_system.repository.PaymentRepository;
import org.springframework.stereotype.Service;

@Service
public class PaymentService {

    private final PaymentRepository paymentRepository;
    private final BookingRepository bookingRepository;

    public PaymentService(PaymentRepository paymentRepository, BookingRepository bookingRepository) {
        this.paymentRepository = paymentRepository;
        this.bookingRepository = bookingRepository;
    }

    public PaymentResponse makePayment(PaymentRequest request) {
        Booking booking = bookingRepository.findById(request.getBookingId())
                .orElseThrow(() -> new IllegalArgumentException("Booking not found"));

        Payment payment = new Payment();
        payment.setBooking(booking);
        payment.setAmount(request.getAmount());
        payment.setMethod(PaymentMethod.valueOf(request.getMethod().toUpperCase()));
        payment.setStatus(PaymentStatus.COMPLETED); // assume success for now

        Payment saved = paymentRepository.save(payment);

        return new PaymentResponse(saved.getId(), booking.getId(), saved.getAmount(),
                saved.getMethod(), saved.getStatus(), saved.getCreatedAt());
    }
}
