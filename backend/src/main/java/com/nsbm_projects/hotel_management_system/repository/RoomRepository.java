package com.nsbm_projects.hotel_management_system.repository;

import com.nsbm_projects.hotel_management_system.model.Room;
import com.nsbm_projects.hotel_management_system.model.RoomStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RoomRepository extends JpaRepository<Room, Integer> {

    long countByStatus(RoomStatus status);

    List<Room> findByStatus(RoomStatus status);
}