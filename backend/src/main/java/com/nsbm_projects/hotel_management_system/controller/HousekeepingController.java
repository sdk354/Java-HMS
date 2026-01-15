package com.nsbm_projects.hotel_management_system.controller;

import com.nsbm_projects.hotel_management_system.dto.HousekeepingStatsDTO;
import com.nsbm_projects.hotel_management_system.model.RoomStatus;
import com.nsbm_projects.hotel_management_system.repository.CleaningTaskRepository;
import com.nsbm_projects.hotel_management_system.repository.RoomRepository;
import com.nsbm_projects.hotel_management_system.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/housekeeping")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000", "http://localhost:4173"})
public class HousekeepingController {

    @Autowired
    private CleaningTaskRepository cleaningTaskRepository;

    @Autowired
    private RoomRepository roomRepository;

    @Autowired
    private UserRepository userRepository;

    @GetMapping("/stats")
    @PreAuthorize("hasAnyAuthority('ROLE_HOUSEKEEPING', 'housekeeping', 'ROLE_ADMIN', 'admin')")
    public ResponseEntity<HousekeepingStatsDTO> getDashboardStats() {

        // 1. Tasks use Strings (e.g., "Pending", "Completed")
        long pending = cleaningTaskRepository.countByStatus("Pending");
        long completed = cleaningTaskRepository.countByStatus("Completed");

        // 2. Rooms use the RoomStatus Enum
        // This will now compile because RoomRepository.countByStatus accepts RoomStatus
        long maintenance = roomRepository.countByStatus(RoomStatus.MAINTENANCE);

        // 3. Staff count
        long staff = userRepository.countByRole("housekeeping");

        // 4. Progress calculation
        long totalTasks = pending + completed;
        int progress = (totalTasks > 0) ? (int) ((completed * 100) / totalTasks) : 0;

        HousekeepingStatsDTO stats = new HousekeepingStatsDTO(
                pending,
                maintenance,
                staff,
                progress
        );

        return ResponseEntity.ok(stats);
    }
}