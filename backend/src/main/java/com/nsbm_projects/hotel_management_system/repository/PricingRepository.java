package com.nsbm_projects.hotel_management_system.repository;

import com.nsbm_projects.hotel_management_system.model.Pricing;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface PricingRepository extends JpaRepository<Pricing, Integer> {

    @Query("SELECT p FROM Pricing p WHERE p.roomType.typeID = :roomTypeId " + "AND :checkDate BETWEEN p.startDate AND p.endDate")
    List<Pricing> findActiveRulesForRoomType(@Param("roomTypeId") Integer roomTypeId, @Param("checkDate") LocalDate checkDate);

    List<Pricing> findBySeasonNameContainingIgnoreCase(String seasonName);
}