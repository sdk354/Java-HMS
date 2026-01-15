package com.nsbm_projects.hotel_management_system.controller;

import com.nsbm_projects.hotel_management_system.model.CleaningTask;
import com.nsbm_projects.hotel_management_system.repository.CleaningTaskRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/cleaning-tasks")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"})
public class CleaningTaskController {

    private final CleaningTaskRepository repository;

    public CleaningTaskController(CleaningTaskRepository repository) {
        this.repository = repository;
    }

    @GetMapping
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public List<CleaningTask> getAllTasks() {
        return repository.findAll();
    }

    // NEW: Fetch tasks assigned to a specific staff member that are not yet completed
    @GetMapping("/staff/{staffId}")
    @PreAuthorize("hasAnyAuthority('ROLE_HOUSEKEEPING', 'ROLE_ADMIN')")
    public List<CleaningTask> getMyTasks(@PathVariable Integer staffId) {
        // This assumes your CleaningTask model has a relationship field named 'assignedStaff'
        // which contains a 'userID' field.
        return repository.findByAssignedUser_UserIDAndStatusNot(staffId, "Completed");
    }

    @PostMapping
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public CleaningTask createTask(@RequestBody CleaningTask task) {
        return repository.save(task);
    }

    // NEW: Cleaned up status update endpoint
    @PutMapping("/{id}/status")
    @PreAuthorize("hasAnyAuthority('ROLE_HOUSEKEEPING', 'ROLE_ADMIN')")
    public ResponseEntity<CleaningTask> updateStatus(@PathVariable Integer id, @RequestBody String newStatus) {
        return repository.findById(id).map(task -> {
            // Remove quotes if sent as raw string from frontend
            task.setStatus(newStatus.replace("\"", ""));
            return ResponseEntity.ok(repository.save(task));
        }).orElse(ResponseEntity.notFound().build());
    }
}