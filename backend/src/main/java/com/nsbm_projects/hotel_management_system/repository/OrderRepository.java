package com.nsbm_projects.hotel_management_system.repository;

import com.nsbm_projects.hotel_management_system.model.Order;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrderRepository extends JpaRepository<Order, Long> {}
