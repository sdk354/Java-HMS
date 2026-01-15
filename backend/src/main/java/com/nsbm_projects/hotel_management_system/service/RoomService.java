package com.nsbm_projects.hotel_management_system.service;

import com.nsbm_projects.hotel_management_system.dto.RoomRequest;
import com.nsbm_projects.hotel_management_system.dto.RoomResponse;
import com.nsbm_projects.hotel_management_system.model.Pricing;
import com.nsbm_projects.hotel_management_system.model.Room;
import com.nsbm_projects.hotel_management_system.model.RoomStatus;
import com.nsbm_projects.hotel_management_system.model.RoomType;
import com.nsbm_projects.hotel_management_system.realtime.RoomStatusPublisher;
import com.nsbm_projects.hotel_management_system.repository.PricingRepository;
import com.nsbm_projects.hotel_management_system.repository.RoomRepository;
import com.nsbm_projects.hotel_management_system.repository.RoomTypeRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class RoomService {

    private final RoomRepository roomRepository;
    private final RoomTypeRepository roomTypeRepository;
    private final PricingRepository pricingRepository;
    private final RoomStatusPublisher roomStatusPublisher;

    public RoomService(RoomRepository roomRepository,
                       RoomTypeRepository roomTypeRepository,
                       PricingRepository pricingRepository,
                       RoomStatusPublisher roomStatusPublisher) {
        this.roomRepository = roomRepository;
        this.roomTypeRepository = roomTypeRepository;
        this.pricingRepository = pricingRepository;
        this.roomStatusPublisher = roomStatusPublisher;
    }

    // ================= NEW: FOR GUEST BROWSE ROOMS =================
    /**
     * Filters rooms that are specifically set to AVAILABLE.
     */
    public List<RoomResponse> getAvailableRooms() {
        return roomRepository.findAll().stream()
                .filter(room -> room.getStatus() == RoomStatus.AVAILABLE)
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public RoomResponse createRoom(RoomRequest request) {
        RoomType type = roomTypeRepository.findById(request.getRoomTypeId())
                .orElseThrow(() -> new IllegalArgumentException("Invalid Room Type ID"));

        Room room = new Room();
        room.setRoomNumber(request.getRoomNumber());
        room.setRoomType(type);
        room.setFloorNumber(request.getFloorNumber());
        room.setStatus(request.isAvailable() ? RoomStatus.AVAILABLE : RoomStatus.MAINTENANCE);

        Room saved = roomRepository.save(room);
        roomStatusPublisher.publish(saved);

        return mapToResponse(saved);
    }

    public List<RoomResponse> getAllRooms() {
        return roomRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public RoomResponse updateRoom(Integer id, RoomRequest request) {
        Room room = roomRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Room not found"));

        if (request.getRoomTypeId() != null) {
            RoomType type = roomTypeRepository.findById(request.getRoomTypeId())
                    .orElseThrow(() -> new IllegalArgumentException("Invalid Room Type ID"));
            room.setRoomType(type);
        } else if (request.getType() != null) {
            RoomType type = roomTypeRepository.findByTypeName(request.getType())
                    .orElseThrow(() -> new IllegalArgumentException("Room Type not found: " + request.getType()));
            room.setRoomType(type);
        }

        if (request.getFloorNumber() != null) {
            room.setFloorNumber(request.getFloorNumber());
        }

        room.setStatus(request.isAvailable() ? RoomStatus.AVAILABLE : RoomStatus.OCCUPIED);
        Room updated = roomRepository.save(room);
        roomStatusPublisher.publish(updated);

        return mapToResponse(updated);
    }

    public void deleteRoom(Integer id) {
        if (!roomRepository.existsById(id)) {
            throw new IllegalArgumentException("Room not found");
        }
        roomRepository.deleteById(id);
    }

    /**
     * Maps Entity to DTO with Dynamic Pricing and Room Type Info
     */
    private RoomResponse mapToResponse(Room room) {
        RoomType type = room.getRoomType();
        BigDecimal finalPrice = (type != null) ? type.getBasePrice() : BigDecimal.ZERO;

        // Fallback capacity if not defined in RoomType
        Integer capacity = (type != null && type.getCapacity() != null) ? type.getCapacity() : 2;

        if (type != null && finalPrice != null) {
            // Apply Dynamic Pricing Multiplier for TODAY
            List<Pricing> activeRules = pricingRepository.findActiveRulesForRoomType(
                    type.getTypeID(),
                    LocalDate.now()
            );

            if (!activeRules.isEmpty()) {
                BigDecimal multiplier = activeRules.get(0).getPricingMultiplier();
                finalPrice = finalPrice.multiply(multiplier);
            }
        }

        return new RoomResponse(
                room.getRoomNumber(),        // id (using roomNumber as ID)
                room.getRoomNumber(),        // roomNumber
                type != null ? type.getTypeName() : "N/A", // type
                finalPrice,                  // price
                room.getStatus() == RoomStatus.AVAILABLE, // available
                capacity                     // capacity
        );
    }
}