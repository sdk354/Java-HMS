package com.nsbm_projects.hotel_management_system.repository;
import com.nsbm_projects.hotel_management_system.model.Room;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RoomRepository extends JpaRepository<Room, Long> {
    //searching up is easier here guys

}