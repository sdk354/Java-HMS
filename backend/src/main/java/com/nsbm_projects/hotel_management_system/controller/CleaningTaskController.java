package com.nsbm_projects.hotel_management_system.controller;

import com.nsbm_projects.hotel_management_system.model.CleaningTask;
import com.nsbm_projects.hotel_management_system.repository.CleaningTaskRepository;
import com.nsbm_projects.hotel_management_system.repository.RoomRepository;
import com.nsbm_projects.hotel_management_system.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/cleaning-tasks")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000", "http://localhost:4173"})
public class CleaningTaskController {

    private final CleaningTaskRepository repository;
    private final UserRepository userRepository;
    private final RoomRepository roomRepository;

    public CleaningTaskController(CleaningTaskRepository repository,
                                  UserRepository userRepository,
                                  RoomRepository roomRepository) {
        this.repository = repository;
        this.userRepository = userRepository;
        this.roomRepository = roomRepository;
    }

    @GetMapping
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'admin', 'ROLE_MANAGER', 'manager')")
    public List<CleaningTask> getAllTasks() {
        return repository.findAll();
    }

    @GetMapping("/staff/{staffId}")
    @PreAuthorize("hasAnyAuthority('ROLE_HOUSEKEEPING', 'housekeeping', 'ROLE_ADMIN', 'admin', 'ROLE_MANAGER', 'manager')")
    public List<CleaningTask> getMyTasks(@PathVariable Integer staffId) {
        return repository.findByAssignedUser_UserIDAndStatusNot(staffId, "Completed");
    }

    @PostMapping
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'admin', 'ROLE_MANAGER', 'manager')")
    public ResponseEntity<?> createTask(@RequestBody CleaningTask task) {
        // Find existing room and user to avoid detached entity errors
        if (task.getRoom() != null && task.getRoom().getRoomNumber() != null) {
            roomRepository.findById(task.getRoom().getRoomNumber()).ifPresent(task::setRoom);
        }
        if (task.getAssignedUser() != null && task.getAssignedUser().getUserID() != null) {
            userRepository.findById(task.getAssignedUser().getUserID()).ifPresent(task::setAssignedUser);
        }
        return ResponseEntity.ok(repository.save(task));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'admin', 'ROLE_MANAGER', 'manager')")
    public ResponseEntity<CleaningTask> updateTask(@PathVariable Integer id, @RequestBody CleaningTask taskDetails) {
        return repository.findById(id).map(task -> {
            task.setStatus(taskDetails.getStatus());
            task.setAssignedDate(taskDetails.getAssignedDate());
            task.setNotes(taskDetails.getNotes());
            return ResponseEntity.ok(repository.save(task));
        }).orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}/status")
    @PreAuthorize("hasAnyAuthority('ROLE_HOUSEKEEPING', 'housekeeping', 'ROLE_ADMIN', 'admin', 'ROLE_MANAGER', 'manager')")
    public ResponseEntity<CleaningTask> updateStatus(@PathVariable Integer id, @RequestBody String newStatus) {
        return repository.findById(id).map(task -> {
            task.setStatus(newStatus.replace("\"", ""));
            return ResponseEntity.ok(repository.save(task));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'admin', 'ROLE_MANAGER', 'manager')")
    public ResponseEntity<Void> deleteTask(@PathVariable Integer id) {
        return repository.findById(id).map(task -> {
            repository.delete(task);
            return ResponseEntity.ok().<Void>build();
        }).orElse(ResponseEntity.notFound().build());
    }
}