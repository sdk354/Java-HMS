package com.nsbm_projects.hotel_management_system.repository;

import com.nsbm_projects.hotel_management_system.model.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {
    // We will need this later to see all bookings for a specific guest
    List<Booking> findByGuestId(Long guestId);

    // We will need this to see all bookings for a specific room
    List<Booking> findByRoomId(Long roomId);
}