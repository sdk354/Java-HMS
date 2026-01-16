package com.nsbm_projects.hotel_management_system.repository;

import com.nsbm_projects.hotel_management_system.model.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Integer> {

    Optional<Payment> findByBooking_ReservationID(Integer reservationID);

    @Query("SELECT SUM(p.grandTotal) FROM Payment p")
    Double sumGrandTotal();

    @Query("SELECT SUM(p.roomCharges) FROM Payment p")
    Double sumRoomCharges();

    @Query("SELECT SUM(p.taxAmount) FROM Payment p")
    Double sumTaxAmount();
}