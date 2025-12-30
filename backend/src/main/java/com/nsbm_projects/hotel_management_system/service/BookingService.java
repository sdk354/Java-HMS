package com.nsbm_projects.hotel_management_system.service;

import com.nsbm_projects.hotel_management_system.dto.BookingRequest;
import com.nsbm_projects.hotel_management_system.dto.BookingResponse;
import com.nsbm_projects.hotel_management_system.model.*;
import com.nsbm_projects.hotel_management_system.repository.BookingRepository;
import com.nsbm_projects.hotel_management_system.repository.RoomRepository;
import com.nsbm_projects.hotel_management_system.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class BookingService {

    private final BookingRepository bookingRepository;
    private final RoomRepository roomRepository;
    private final UserRepository userRepository;

    public BookingService(BookingRepository bookingRepository,
                          RoomRepository roomRepository,
                          UserRepository userRepository) {
        this.bookingRepository = bookingRepository;
        this.roomRepository = roomRepository;
        this.userRepository = userRepository;
    }

    public BookingResponse createBooking(BookingRequest request) {
        Room room = roomRepository.findById(request.getRoomId())
                .orElseThrow(() -> new IllegalArgumentException("Room not found"));
        User guest = userRepository.findById(request.getGuestId())
                .orElseThrow(() -> new IllegalArgumentException("Guest not found"));

        // Prevent double booking
        List<Booking> overlapping = bookingRepository
                .findByRoomIdAndCheckOutDateAfterAndCheckInDateBefore(
                        room.getId(), request.getCheckInDate(), request.getCheckOutDate());

        if (!overlapping.isEmpty()) {
            throw new IllegalStateException("Room already booked for these dates");
        }

        // Calculate total amount
        long nights = request.getCheckOutDate().toEpochDay() - request.getCheckInDate().toEpochDay();
        double total = nights * room.getPricePerNight();

        Booking booking = new Booking();
        booking.setGuest(guest);
        booking.setRoom(room);
        booking.setCheckInDate(request.getCheckInDate());
        booking.setCheckOutDate(request.getCheckOutDate());
        booking.setBookingStatus(BookingStatus.NEW);
        booking.setTotalAmount(total);

        Booking saved = bookingRepository.save(booking);

        return new BookingResponse(saved.getId(), guest.getId(), room.getId(),
                saved.getCheckInDate(), saved.getCheckOutDate(),
                saved.getBookingStatus(), saved.getTotalAmount());
    }

    public List<BookingResponse> getAllBookings() {
        return bookingRepository.findAll().stream()
                .map(b -> new BookingResponse(b.getId(), b.getGuest().getId(), b.getRoom().getId(),
                        b.getCheckInDate(), b.getCheckOutDate(),
                        b.getBookingStatus(), b.getTotalAmount()))
                .collect(Collectors.toList());
    }
}
