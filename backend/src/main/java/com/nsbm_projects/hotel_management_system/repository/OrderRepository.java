package com.nsbm_projects.hotel_management_system.repository;

import com.nsbm_projects.hotel_management_system.model.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, Integer> {

    List<Order> findByStatus(String status);

    List<Order> findByReservation_ReservationID(Integer reservationID);

    @Query("SELECT SUM(o.totalCost) FROM Order o")
    BigDecimal sumTotalCost();

    long countByStatus(String status);
}