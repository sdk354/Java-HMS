package com.nsbm_projects.hotel_management_system.service;

import com.nsbm_projects.hotel_management_system.model.Room;
import com.nsbm_projects.hotel_management_system.repository.RoomRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class RoomService {

    @Autowired
    private RoomRepository roomRepository;

    // Save a new room
    public Room saveRoom(Room room) {
        return roomRepository.save(room);
    }

    // Get all rooms
    public List<Room> getAllRooms() {
        return roomRepository.findAll();
    }

    // Get a specific room by ID
    public Optional<Room> getRoomById(Long id) {
        return roomRepository.findById(id);
    }

    // Update an existing room
    public Room updateRoom(Long id, Room roomDetails) {
        return roomRepository.findById(id).map(room -> {
            room.setRoomNumber(roomDetails.getRoomNumber());
            room.setType(roomDetails.getType());
            room.setPricePerNight(roomDetails.getPricePerNight());
            room.setAvailable(roomDetails.isAvailable());
            return roomRepository.save(room);
        }).orElseThrow(() -> new RuntimeException("Room not found"));
    }

    // Delete a room
    public void deleteRoom(Long id) {
        roomRepository.deleteById(id);
    }
}