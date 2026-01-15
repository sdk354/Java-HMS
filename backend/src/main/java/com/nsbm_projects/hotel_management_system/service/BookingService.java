package com.nsbm_projects.hotel_management_system.service;

import com.nsbm_projects.hotel_management_system.dto.BookingRequest;
import com.nsbm_projects.hotel_management_system.dto.BookingResponse;
import com.nsbm_projects.hotel_management_system.model.*;
import com.nsbm_projects.hotel_management_system.realtime.RoomStatusPublisher;
import com.nsbm_projects.hotel_management_system.repository.*;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class BookingService {

    private final BookingRepository bookingRepository;
    private final RoomRepository roomRepository;
    private final UserRepository userRepository;
    private final GuestRepository guestRepository;
    private final PricingRepository pricingRepository;
    private final RoomStatusPublisher roomStatusPublisher;

    public BookingService(
            BookingRepository bookingRepository,
            RoomRepository roomRepository,
            UserRepository userRepository,
            GuestRepository guestRepository,
            PricingRepository pricingRepository,
            RoomStatusPublisher roomStatusPublisher
    ) {
        this.bookingRepository = bookingRepository;
        this.roomRepository = roomRepository;
        this.userRepository = userRepository;
        this.guestRepository = guestRepository;
        this.pricingRepository = pricingRepository;
        this.roomStatusPublisher = roomStatusPublisher;
    }

    /**
     * NEW: Fetches all bookings for a specific Guest based on their User ID.
     * This handles the React call: api.get("/bookings/guest/2")
     */
    public List<BookingResponse> getBookingsByGuestId(Long userId) {
        // 1. Find the guest profile associated with this User ID
        Guest guest = guestRepository.findByUser_UserID(userId.intValue())
                .orElseThrow(() -> new IllegalArgumentException("Guest profile not found for User ID: " + userId));

        // 2. Fetch all bookings for that guest and map to responses
        return bookingRepository.findAll().stream()
                .filter(b -> b.getGuest() != null && b.getGuest().getGuestID().equals(guest.getGuestID()))
                .sorted((b1, b2) -> b2.getCheckInDate().compareTo(b1.getCheckInDate())) // Newest first
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    /**
     * Finds the most relevant active booking for a guest based on their username.
     * Matches the Guest Dashboard requirements.
     */
    public Optional<BookingResponse> findActiveBookingByUsername(String username) {
        return bookingRepository.findAll().stream()
                .filter(b -> b.getGuest() != null &&
                        b.getGuest().getUser() != null &&
                        b.getGuest().getUser().getUsername().equals(username))
                .filter(b -> b.getBookingStatus() == BookingStatus.CONFIRMED ||
                        b.getBookingStatus() == BookingStatus.CHECKED_IN)
                .sorted((b1, b2) -> b2.getCheckInDate().compareTo(b1.getCheckInDate()))
                .map(this::mapToResponse)
                .findFirst();
    }

    @Transactional
    public BookingResponse createBooking(BookingRequest request) {
        Room room = roomRepository.findById(request.getRoomId())
                .orElseThrow(() -> new IllegalArgumentException("Room not found"));

        User user = userRepository.findById(request.getGuestId())
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        Guest guest = guestRepository.findByUser_UserID(user.getUserID())
                .orElseThrow(() -> new IllegalArgumentException("User does not have a Guest profile"));

        validateDates(request);
        checkAvailability(room.getRoomNumber(), request, null);

        BigDecimal totalAmount = calculateTotal(room, request);

        Booking booking = new Booking();
        booking.setGuest(guest);
        booking.setRoom(room);
        booking.setCheckInDate(request.getCheckInDate());
        booking.setCheckOutDate(request.getCheckOutDate());
        booking.setBookingStatus(BookingStatus.CONFIRMED);
        booking.setTotalAmount(totalAmount);

        return mapToResponse(bookingRepository.save(booking));
    }

    @Transactional
    public BookingResponse updateBooking(Integer id, BookingRequest request) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Booking not found with ID: " + id));

        Room room = roomRepository.findById(request.getRoomId())
                .orElseThrow(() -> new IllegalArgumentException("Room not found"));

        validateDates(request);
        checkAvailability(room.getRoomNumber(), request, id);

        booking.setRoom(room);
        booking.setCheckInDate(request.getCheckInDate());
        booking.setCheckOutDate(request.getCheckOutDate());
        booking.setBookingStatus(request.getBookingStatus());

        if (request.getTotalAmount() != null) {
            booking.setTotalAmount(request.getTotalAmount());
        } else {
            booking.setTotalAmount(calculateTotal(room, request));
        }

        return mapToResponse(bookingRepository.save(booking));
    }

    @Transactional
    public void deleteBooking(Integer id) {
        if (!bookingRepository.existsById(id)) {
            throw new RuntimeException("Cannot delete. Booking not found: " + id);
        }
        bookingRepository.deleteById(id);
    }

    public List<BookingResponse> getAllBookings() {
        return bookingRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public void checkIn(Integer bookingId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        booking.setBookingStatus(BookingStatus.CHECKED_IN);
        Room room = booking.getRoom();
        room.setStatus(RoomStatus.OCCUPIED);
        roomRepository.save(room);
        bookingRepository.save(booking);
        roomStatusPublisher.publish(room);
    }

    @Transactional
    public void checkOut(Integer bookingId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        booking.setBookingStatus(BookingStatus.CHECKED_OUT);
        Room room = booking.getRoom();
        room.setStatus(RoomStatus.CLEANING);
        roomRepository.save(room);
        bookingRepository.save(booking);
        roomStatusPublisher.publish(room);
    }

    // ================= HELPERS =================

    private void validateDates(BookingRequest request) {
        if (!request.getCheckOutDate().isAfter(request.getCheckInDate())) {
            throw new IllegalArgumentException("Check-out date must be after check-in date");
        }
    }

    private void checkAvailability(Integer roomNumber, BookingRequest request, Integer currentBookingId) {
        List<Booking> overlapping = bookingRepository.findByRoom_RoomNumberAndCheckOutDateAfterAndCheckInDateBefore(
                roomNumber,
                request.getCheckInDate(),
                request.getCheckOutDate()
        );

        if (currentBookingId != null) {
            overlapping.removeIf(b -> b.getReservationID().equals(currentBookingId));
        }

        if (!overlapping.isEmpty()) {
            throw new IllegalStateException("Room already booked for these dates");
        }
    }

    private BigDecimal calculateTotal(Room room, BookingRequest request) {
        RoomType type = room.getRoomType();
        BigDecimal basePrice = type.getBasePrice();
        BigDecimal total = BigDecimal.ZERO;

        LocalDate startDate = request.getCheckInDate();
        LocalDate endDate = request.getCheckOutDate();

        for (LocalDate date = startDate; date.isBefore(endDate); date = date.plusDays(1)) {
            BigDecimal nightlyPrice = basePrice;
            List<Pricing> activeRules = pricingRepository.findActiveRulesForRoomType(
                    type.getTypeID(),
                    date
            );

            if (!activeRules.isEmpty()) {
                BigDecimal multiplier = activeRules.get(0).getPricingMultiplier();
                nightlyPrice = basePrice.multiply(multiplier);
            }
            total = total.add(nightlyPrice);
        }
        return total;
    }

    private BookingResponse mapToResponse(Booking booking) {
        String fullName = (booking.getGuest() != null && booking.getGuest().getUser() != null)
                ? booking.getGuest().getUser().getFullName()
                : "Unknown Guest";

        BookingResponse response = new BookingResponse(
                booking.getReservationID(),
                booking.getGuest() != null ? booking.getGuest().getUser().getUserID() : null,
                fullName,
                booking.getRoom().getRoomNumber(),
                booking.getCheckInDate(),
                booking.getCheckOutDate(),
                booking.getBookingStatus(),
                booking.getTotalAmount()
        );

        response.setRoomNumber(String.valueOf(booking.getRoom().getRoomNumber()));

        return response;
    }
}