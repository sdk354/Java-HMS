  // Review trigger comment
package com.nsbm_projects.hotel_management_system.service;

import com.nsbm_projects.hotel_management_system.dto.RoomRequest;
import com.nsbm_projects.hotel_management_system.dto.RoomResponse;
import com.nsbm_projects.hotel_management_system.model.Room;
import com.nsbm_projects.hotel_management_system.repository.RoomRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class RoomService {

    private final RoomRepository roomRepository;

    public RoomService(RoomRepository roomRepository) {
        this.roomRepository = roomRepository;
    }

    public RoomResponse createRoom(RoomRequest request) {
        Room room = new Room();
        room.setRoomNumber(request.getRoomNumber());
        room.setType(request.getType());
        room.setPricePerNight(request.getPricePerNight());
        room.setAvailable(request.isAvailable());

        Room saved = roomRepository.save(room);
        return new RoomResponse(saved.getId(), saved.getRoomNumber(), saved.getType(),
                saved.getPricePerNight(), saved.isAvailable());
    }

    public List<RoomResponse> getAllRooms() {
        return roomRepository.findAll().stream()
                .map(r -> new RoomResponse(r.getId(), r.getRoomNumber(), r.getType(),
                        r.getPricePerNight(), r.isAvailable()))
                .collect(Collectors.toList());
    }

    public RoomResponse updateRoom(Long id, RoomRequest request) {
        Room room = roomRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Room not found"));

        room.setRoomNumber(request.getRoomNumber());
        room.setType(request.getType());
        room.setPricePerNight(request.getPricePerNight());
        room.setAvailable(request.isAvailable());

        Room updated = roomRepository.save(room);
        return new RoomResponse(updated.getId(), updated.getRoomNumber(), updated.getType(),
                updated.getPricePerNight(), updated.isAvailable());
    }

    public void deleteRoom(Long id) {
        roomRepository.deleteById(id);
    }
}
