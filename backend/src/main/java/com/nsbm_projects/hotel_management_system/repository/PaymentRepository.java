package com.nsbm_projects.hotel_management_system.repository;

import com.nsbm_projects.hotel_management_system.model.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Integer> {

    // Matches the 'reservationID' in your Reservation/Booking entity
    Optional<Payment> findByBooking_ReservationID(Integer reservationID);

    // 1. Total Revenue (Mapped to 'grandTotal' column in Bill table)
    @Query("SELECT SUM(p.grandTotal) FROM Payment p")
    Double sumGrandTotal();

    // 2. Room Charges (Mapped to 'roomCharges' column in Bill table)
    @Query("SELECT SUM(p.roomCharges) FROM Payment p")
    Double sumRoomCharges();

    // 3. Tax Amount (Mapped to 'taxAmount' column in Bill table)
    @Query("SELECT SUM(p.taxAmount) FROM Payment p")
    Double sumTaxAmount();
}