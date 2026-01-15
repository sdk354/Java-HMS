package com.nsbm_projects.hotel_management_system.controller;

import com.nsbm_projects.hotel_management_system.dto.MenuItemRequest;
import com.nsbm_projects.hotel_management_system.dto.MenuItemResponse;
import com.nsbm_projects.hotel_management_system.service.ServiceItemService;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
// FIX: Changed to /api/service-items to match your SecurityConfig and Frontend calls
@RequestMapping("/api/service-items")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173", "http://localhost:4173"})
public class ServiceItemController {

    private final ServiceItemService serviceItemService;

    public ServiceItemController(ServiceItemService serviceItemService) {
        this.serviceItemService = serviceItemService;
    }

    // Unlocked for GUEST to allow room service viewing
    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF', 'GUEST', 'MANAGER')")
    public List<MenuItemResponse> getAll() {
        return serviceItemService.getAll();
    }

    @GetMapping("/available")
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF', 'GUEST', 'MANAGER')")
    public List<MenuItemResponse> getAvailableItems() {
        return serviceItemService.getAvailable();
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF', 'MANAGER')")
    public MenuItemResponse create(@RequestBody MenuItemRequest request) {
        return serviceItemService.create(request);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF', 'MANAGER')")
    public MenuItemResponse update(@PathVariable Integer id, @RequestBody MenuItemRequest request) {
        return serviceItemService.update(id, request);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF', 'MANAGER')")
    public void delete(@PathVariable Integer id) {
        serviceItemService.delete(id);
    }
}