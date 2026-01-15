package com.nsbm_projects.hotel_management_system.controller;

import com.nsbm_projects.hotel_management_system.dto.BookingRequest;
import com.nsbm_projects.hotel_management_system.dto.BookingResponse;
import com.nsbm_projects.hotel_management_system.service.BookingService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bookings")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173", "http://localhost:4173"})
public class BookingController {

    private final BookingService bookingService;

    public BookingController(BookingService bookingService) {
        this.bookingService = bookingService;
    }

    // ================= GET BOOKINGS BY GUEST ID (ADDED) =================
    /**
     * This endpoint handles: api.get("/bookings/guest/2")
     * Secured so only the Guest, Admin, or Manager can see these records.
     */
    @GetMapping("/guest/{guestId}")
    @PreAuthorize("hasAnyRole('GUEST', 'ADMIN', 'MANAGER')")
    public ResponseEntity<List<BookingResponse>> getBookingsByGuest(@PathVariable Long guestId) {
        // Ensure your BookingService has a method that fetches by Guest/User ID
        List<BookingResponse> bookings = bookingService.getBookingsByGuestId(guestId);
        return ResponseEntity.ok(bookings);
    }

    // ================= DASHBOARD ENDPOINT =================
    @GetMapping("/my-active")
    @PreAuthorize("hasAnyRole('GUEST', 'USER', 'ADMIN', 'MANAGER')")
    public ResponseEntity<BookingResponse> getMyActiveBooking(Authentication authentication) {
        String username = authentication.getName();
        return bookingService.findActiveBookingByUsername(username)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.noContent().build());
    }

    // ================= CREATE BOOKING =================
    @PostMapping
    @PreAuthorize("hasAnyRole('GUEST', 'ADMIN', 'MANAGER')")
    public ResponseEntity<BookingResponse> createBooking(
            @RequestBody BookingRequest request
    ) {
        return ResponseEntity.ok(bookingService.createBooking(request));
    }

    // ================= GET ALL BOOKINGS (STAFF ONLY) =================
    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<List<BookingResponse>> getAllBookings() {
        return ResponseEntity.ok(bookingService.getAllBookings());
    }

    // ================= UPDATE BOOKING =================
    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<BookingResponse> updateBooking(@PathVariable Integer id,
                                                         @RequestBody BookingRequest request) {
        return ResponseEntity.ok(bookingService.updateBooking(id, request));
    }

    // ================= CHECK-IN =================
    @PostMapping("/{id}/check-in")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'HOUSEKEEPING')")
    public ResponseEntity<String> checkIn(@PathVariable Integer id) {
        bookingService.checkIn(id);
        return ResponseEntity.ok("Checked in successfully");
    }

    // ================= CHECK-OUT =================
    @PostMapping("/{id}/check-out")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'HOUSEKEEPING')")
    public ResponseEntity<String> checkOut(@PathVariable Integer id) {
        bookingService.checkOut(id);
        return ResponseEntity.ok("Checked out successfully");
    }

    // ================= DELETE BOOKING =================
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteBooking(@PathVariable Integer id) {
        bookingService.deleteBooking(id);
        return ResponseEntity.noContent().build();
    }
}