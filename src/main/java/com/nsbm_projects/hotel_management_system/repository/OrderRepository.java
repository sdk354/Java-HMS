package com.nsbm_projects.hotel_management_system.repository;

import com.nsbm_projects.hotel_management_system.model.FoodOrders;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<FoodOrders, Long> {
    // This allows the kitchen to say "Give me all NEW orders"
    List<FoodOrders> findByStatus(String status);
}