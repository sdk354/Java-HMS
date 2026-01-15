package com.nsbm_projects.hotel_management_system.repository;

import com.nsbm_projects.hotel_management_system.model.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, Integer> {

    // Matches the String status in your Order entity and VARCHAR in SQL
    List<Order> findByStatus(String status);

    // Links to Order.reservation.reservationID
    // Note: This matches the 'reservationID' field name in your Booking/Reservation entity
    List<Order> findByReservation_ReservationID(Integer reservationID);

    /**
     * Sums the totalCost field from the Order entity.
     * This corresponds to the 'Service Revenue' card on the Manager Dashboard.
     */
    @Query("SELECT SUM(o.totalCost) FROM Order o")
    BigDecimal sumTotalCost();

    /**
     * Counts orders by status for operational metrics.
     */
    long countByStatus(String status);
}