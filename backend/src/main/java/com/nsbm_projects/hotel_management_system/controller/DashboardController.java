package com.nsbm_projects.hotel_management_system.controller;

import com.nsbm_projects.hotel_management_system.dto.RoomResponse;
import com.nsbm_projects.hotel_management_system.repository.*;
import com.nsbm_projects.hotel_management_system.service.RoomService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.*;

@RestController
@RequestMapping("/api/admin/stats")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173", "http://localhost:4173"})
public class DashboardController {

    private final RoomService roomService;
    private final BookingRepository bookingRepository;
    private final UserRepository userRepository;
    private final CleaningTaskRepository cleaningTaskRepository;
    private final PaymentRepository paymentRepository;
    private final OrderRepository orderRepository;

    public DashboardController(RoomService roomService, BookingRepository bookingRepository, UserRepository userRepository, CleaningTaskRepository cleaningTaskRepository, PaymentRepository paymentRepository, OrderRepository orderRepository) {
        this.roomService = roomService;
        this.bookingRepository = bookingRepository;
        this.userRepository = userRepository;
        this.cleaningTaskRepository = cleaningTaskRepository;
        this.paymentRepository = paymentRepository;
        this.orderRepository = orderRepository;
    }

    @GetMapping("/summary")
    public ResponseEntity<Map<String, Object>> getDashboardStats() {
        Map<String, Object> stats = new HashMap<>();

        try {
            List<RoomResponse> rooms = roomService.getAllRooms();
            long totalRooms = (rooms != null) ? rooms.size() : 0;
            long occupiedRooms = (rooms != null) ? rooms.stream().filter(r -> r != null && !r.isAvailable()).count() : 0;
            double occupancy = totalRooms > 0 ? ((double) occupiedRooms / totalRooms) * 100 : 0;

            Double totalRevenue = paymentRepository.sumGrandTotal();
            Double roomCharges = paymentRepository.sumRoomCharges();
            Double taxAmount = paymentRepository.sumTaxAmount();
            BigDecimal serviceRevenue = orderRepository.sumTotalCost();

            stats.put("totalRevenue", totalRevenue != null ? totalRevenue : 0.0);
            stats.put("roomCharges", roomCharges != null ? roomCharges : 0.0);
            stats.put("taxAmount", taxAmount != null ? taxAmount : 0.0);
            stats.put("serviceRevenue", serviceRevenue != null ? serviceRevenue : 0.0);

            List<String> staffRoles = Arrays.asList("housekeeping", "admin", "manager");
            stats.put("activeStaff", userRepository.countByRoleIn(staffRoles));
            stats.put("pendingTasks", cleaningTaskRepository.countByStatus("Pending"));
            stats.put("occupancyRate", String.format("%.0f%%", occupancy));

            return ResponseEntity.ok(stats);

        } catch (Exception e) {
            System.err.println("DashboardController Error: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }
}