package com.nsbm_projects.hotel_management_system.service;

import com.nsbm_projects.hotel_management_system.dto.BookingRequest;
import com.nsbm_projects.hotel_management_system.dto.BookingResponse;
import com.nsbm_projects.hotel_management_system.model.*;
import com.nsbm_projects.hotel_management_system.realtime.RoomStatusPublisher;
import com.nsbm_projects.hotel_management_system.repository.BookingRepository;
import com.nsbm_projects.hotel_management_system.repository.RoomRepository;
import com.nsbm_projects.hotel_management_system.repository.UserRepository;
import jakarta.transaction.Transactional;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class BookingService {

    private final BookingRepository bookingRepository;
    private final RoomRepository roomRepository;
    private final UserRepository userRepository;
    private final SimpMessagingTemplate messagingTemplate;
    private final RoomStatusPublisher roomStatusPublisher;


    public BookingService(
            BookingRepository bookingRepository,
            RoomRepository roomRepository,
            UserRepository userRepository, SimpMessagingTemplate messagingTemplate, RoomStatusPublisher roomStatusPublisher
    ) {
        this.bookingRepository = bookingRepository;
        this.roomRepository = roomRepository;
        this.userRepository = userRepository;
        this.messagingTemplate = messagingTemplate;
        this.roomStatusPublisher = roomStatusPublisher;
    }

    public BookingResponse createBooking(BookingRequest request) {

        Room room = roomRepository.findById(request.getRoomId())
                .orElseThrow(() -> new IllegalArgumentException("Room not found"));

        User guest = userRepository.findById(request.getGuestId())
                .orElseThrow(() -> new IllegalArgumentException("Guest not found"));

        if (!request.getCheckOutDate().isAfter(request.getCheckInDate())) {
            throw new IllegalArgumentException("Check-out date must be after check-in date");
        }

        List<Booking> overlapping =
                bookingRepository.findByRoom_IdAndCheckOutDateAfterAndCheckInDateBefore(
                        room.getId(),
                        request.getCheckInDate(),
                        request.getCheckOutDate()
                );

        if (!overlapping.isEmpty()) {
            throw new IllegalStateException("Room already booked for these dates");
        }

        long nights = ChronoUnit.DAYS.between(
                request.getCheckInDate(),
                request.getCheckOutDate()
        );

        BigDecimal totalAmount =
                room.getPricePerNight().multiply(BigDecimal.valueOf(nights));

        Booking booking = new Booking();
        booking.setGuest(guest);
        booking.setRoom(room);
        booking.setCheckInDate(request.getCheckInDate());
        booking.setCheckOutDate(request.getCheckOutDate());
        booking.setBookingStatus(BookingStatus.NEW);
        booking.setTotalAmount(totalAmount);

        return mapToResponse(bookingRepository.save(booking));
    }

    public List<BookingResponse> getAllBookings() {
        return bookingRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }
    @Transactional
    public void checkIn(Long bookingId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        Room room = booking.getRoom();
        room.setStatus(RoomStatus.OCCUPIED);
        roomRepository.save(room);

        roomStatusPublisher.publish(room);
    }

    @Transactional
    public void checkOut(Long bookingId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        Room room = booking.getRoom();
        room.setStatus(RoomStatus.AVAILABLE);
        roomRepository.save(room);

        roomStatusPublisher.publish(room);
    }




    private BookingResponse mapToResponse(Booking booking) {
        return new BookingResponse(
                booking.getId(),
                booking.getGuest().getId(),
                booking.getRoom().getId(),
                booking.getCheckInDate(),
                booking.getCheckOutDate(),
                booking.getBookingStatus(),
                booking.getTotalAmount()
        );
    }
}
