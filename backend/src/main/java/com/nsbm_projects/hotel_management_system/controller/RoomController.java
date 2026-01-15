package com.nsbm_projects.hotel_management_system.controller;

import com.nsbm_projects.hotel_management_system.dto.RoomRequest;
import com.nsbm_projects.hotel_management_system.dto.RoomResponse;
import com.nsbm_projects.hotel_management_system.service.RoomService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/rooms")
// Enable CORS for frontend integration
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173", "http://localhost:4173"})
public class RoomController {

    private final RoomService roomService;

    public RoomController(RoomService roomService) {
        this.roomService = roomService;
    }

    // ================= CREATE ROOM =================
    @PostMapping
    public ResponseEntity<RoomResponse> createRoom(@RequestBody RoomRequest request) {
        return ResponseEntity.ok(roomService.createRoom(request));
    }

    // ================= GET ALL ROOMS =================
    @GetMapping
    public ResponseEntity<List<RoomResponse>> getAllRooms() {
        return ResponseEntity.ok(roomService.getAllRooms());
    }

    // ================= UPDATE ROOM =================
    // Changed id from Long to Integer to match roomNumber (INT)
    @PutMapping("/{id}")
    public ResponseEntity<RoomResponse> updateRoom(@PathVariable Integer id,
                                                   @RequestBody RoomRequest request) {
        return ResponseEntity.ok(roomService.updateRoom(id, request));
    }

    // ================= DELETE ROOM =================
    // Changed id from Long to Integer to match roomNumber (INT)
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteRoom(@PathVariable Integer id) {
        roomService.deleteRoom(id);
        return ResponseEntity.noContent().build();
    }
    // ================= GET AVAILABLE ROOMS (NEW) =================
    @GetMapping("/available")
    public ResponseEntity<List<RoomResponse>> getAvailableRooms() {
        // This calls the service to filter rooms by RoomStatus.AVAILABLE
        return ResponseEntity.ok(roomService.getAvailableRooms());
    }
}