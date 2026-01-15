package com.nsbm_projects.hotel_management_system.repository;

import com.nsbm_projects.hotel_management_system.model.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Integer> {

    List<Booking> findByRoom_RoomNumberAndCheckOutDateAfterAndCheckInDateBefore(
            Integer roomNumber, LocalDate checkIn, LocalDate checkOut);

    Optional<Booking> findTopByGuest_User_UserIDOrderByCheckInDateDesc(Integer userID);

    /**
     * DASHBOARD REVENUE QUERY
     * Updated to match the SQL Schema:
     * - check_in_date -> checkInDate
     * - total_amount  -> totalAmount
     */
    @Query(value = "SELECT DATE_FORMAT(checkInDate, '%b') as month, " +
            "SUM(totalAmount) as revenue " +
            "FROM Reservation " +
            "GROUP BY MONTH(checkInDate), DATE_FORMAT(checkInDate, '%b') " +
            "ORDER BY MONTH(checkInDate)", nativeQuery = true)
    List<Map<String, Object>> getMonthlyRevenue();
}