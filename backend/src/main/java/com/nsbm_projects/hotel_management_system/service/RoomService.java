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

        // Use explicit status if provided, otherwise fallback to availability boolean
        if (request.getStatus() != null) {
            room.setStatus(RoomStatus.valueOf(request.getStatus().toUpperCase()));
        } else {
            room.setStatus(request.isAvailable() ? RoomStatus.AVAILABLE : RoomStatus.MAINTENANCE);
        }

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

        // Handle Room Type Updates
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

        // ================= FIX: STATUS LOGIC =================
        // Instead of hardcoding OCCUPIED if !available, we check the request's status string.
        if (request.getStatus() != null) {
            try {
                RoomStatus newStatus = RoomStatus.valueOf(request.getStatus().toUpperCase());
                room.setStatus(newStatus);
            } catch (IllegalArgumentException e) {
                // Fallback if status string is invalid
                room.setStatus(request.isAvailable() ? RoomStatus.AVAILABLE : RoomStatus.OCCUPIED);
            }
        } else {
            // Backward compatibility for requests only sending 'available' boolean
            room.setStatus(request.isAvailable() ? RoomStatus.AVAILABLE : RoomStatus.OCCUPIED);
        }

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

        Integer capacity = (type != null && type.getCapacity() != null) ? type.getCapacity() : 2;

        if (type != null && finalPrice != null) {
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
                room.getRoomNumber(),                      // id
                room.getRoomNumber(),                      // roomNumber
                type != null ? type.getTypeName() : "N/A", // type name
                finalPrice,                                // calculated price
                room.getStatus() == RoomStatus.AVAILABLE,  // boolean available
                capacity,                                  // capacity
                room.getStatus().name()                    // actual status string (CLEANING, etc)
        );
    }
}