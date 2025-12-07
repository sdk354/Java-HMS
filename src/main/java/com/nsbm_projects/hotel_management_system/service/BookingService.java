package com.nsbm_projects.hotel_management_system.service;

import com.nsbm_projects.hotel_management_system.model.Booking;
import com.nsbm_projects.hotel_management_system.model.Room;
import com.nsbm_projects.hotel_management_system.repository.BookingRepository;
import com.nsbm_projects.hotel_management_system.repository.RoomRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public class BookingService {

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private RoomRepository roomRepository;

    // 1. Simple Create Booking (So you can have data to test)
    public Booking createBooking(Booking booking) {
        // In a real app, we would check if dates overlap here
        return bookingRepository.save(booking);
    }

    // 2. Get All Bookings
    public List<Booking> getAllBookings() {
        return bookingRepository.findAll();
    }

    // 3. CHECK-IN Workflow
    public Booking checkIn(Long bookingId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        // Update Booking Status
        booking.setStatus("CHECKED_IN");

        // Update Room Status to "Not Available" (Occupied)
        Room room = booking.getRoom();
        room.setAvailable(false);
        roomRepository.save(room);

        return bookingRepository.save(booking);
    }

    // 4. CHECK-OUT Workflow
    public Booking checkOut(Long bookingId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        // Update Booking Status
        booking.setStatus("CHECKED_OUT");

        // Update Room Status back to "Available" (Free)
        Room room = booking.getRoom();
        room.setAvailable(true);
        roomRepository.save(room);

        return bookingRepository.save(booking);
    }
}