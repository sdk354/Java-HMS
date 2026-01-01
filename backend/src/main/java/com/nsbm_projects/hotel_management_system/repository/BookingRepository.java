  // Review trigger comment
package com.nsbm_projects.hotel_management_system.repository;

import com.nsbm_projects.hotel_management_system.model.Booking;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface BookingRepository extends JpaRepository<Booking, Long> {
    List<Booking> findByRoom_IdAndCheckOutDateAfterAndCheckInDateBefore(
            Long roomId, LocalDate checkIn, LocalDate checkOut);

}
