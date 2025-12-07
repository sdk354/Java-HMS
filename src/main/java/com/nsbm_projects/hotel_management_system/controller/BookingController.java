package com.nsbm_projects.hotel_management_system.controller;

import com.nsbm_projects.hotel_management_system.model.Booking;
import com.nsbm_projects.hotel_management_system.service.BookingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bookings")
@CrossOrigin("*")
public class BookingController {

    @Autowired
    private BookingService bookingService;

    // Create a Booking (For testing purposes)
    @PostMapping
    public Booking createBooking(@RequestBody Booking booking) {
        return bookingService.createBooking(booking);
    }

    // Get All Bookings
    @GetMapping
    public List<Booking> getAllBookings() {
        return bookingService.getAllBookings();
    }

    // RECEPTIONIST ACTION: Check-In Guest
    @PostMapping("/check-in/{id}")
    public ResponseEntity<Booking> checkIn(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(bookingService.checkIn(id));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // RECEPTIONIST ACTION: Check-Out Guest
    @PostMapping("/check-out/{id}")
    public ResponseEntity<Booking> checkOut(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(bookingService.checkOut(id));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
}