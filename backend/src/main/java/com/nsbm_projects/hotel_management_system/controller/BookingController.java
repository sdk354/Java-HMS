package com.nsbm_projects.hotel_management_system.controller;

import com.nsbm_projects.hotel_management_system.dto.BookingRequest;
import com.nsbm_projects.hotel_management_system.dto.BookingResponse;
import com.nsbm_projects.hotel_management_system.service.BookingService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bookings")
public class BookingController {

    private final BookingService bookingService;

    public BookingController(BookingService bookingService) {
        this.bookingService = bookingService;
    }

    // ================= CREATE BOOKING =================
    @PostMapping
    public ResponseEntity<BookingResponse> createBooking(
            @RequestBody BookingRequest request
    ) {
        return ResponseEntity.ok(bookingService.createBooking(request));
    }

    // ================= GET ALL BOOKINGS =================
    @GetMapping
    public ResponseEntity<List<BookingResponse>> getAllBookings() {
        return ResponseEntity.ok(bookingService.getAllBookings());
    }
}
