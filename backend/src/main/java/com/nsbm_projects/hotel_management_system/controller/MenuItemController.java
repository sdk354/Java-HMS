package com.nsbm_projects.hotel_management_system.controller;

import com.nsbm_projects.hotel_management_system.dto.MenuItemRequest;
import com.nsbm_projects.hotel_management_system.dto.MenuItemResponse;
import com.nsbm_projects.hotel_management_system.service.MenuItemService;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/menu")
public class MenuItemController {

    private final MenuItemService menuItemService;

    public MenuItemController(MenuItemService menuItemService) {
        this.menuItemService = menuItemService;
    }

    // ADMIN + STAFF CRUD

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN','STAFF')")
    public MenuItemResponse create(@RequestBody MenuItemRequest request) {
        return menuItemService.create(request);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','STAFF')")
    public MenuItemResponse update(@PathVariable Long id,
                                   @RequestBody MenuItemRequest request) {
        return menuItemService.update(id, request);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','STAFF')")
    public void delete(@PathVariable Long id) {
        menuItemService.delete(id);
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN','STAFF')")
    public List<MenuItemResponse> getAll() {
        return menuItemService.getAll();
    }

    // GUEST PUBLIC API
    @GetMapping("/public")
    public List<MenuItemResponse> getAvailableMenu() {
        return menuItemService.getAvailable();
    }
}
