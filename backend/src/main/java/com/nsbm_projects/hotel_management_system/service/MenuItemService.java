package com.nsbm_projects.hotel_management_system.service;

import com.nsbm_projects.hotel_management_system.dto.MenuItemRequest;
import com.nsbm_projects.hotel_management_system.dto.MenuItemResponse;
import com.nsbm_projects.hotel_management_system.model.MenuItem;
import com.nsbm_projects.hotel_management_system.repository.MenuItemRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class MenuItemService {

    private final MenuItemRepository menuItemRepository;

    public MenuItemService(MenuItemRepository menuItemRepository) {
        this.menuItemRepository = menuItemRepository;
    }

    public MenuItemResponse create(MenuItemRequest request) {
        MenuItem item = new MenuItem(
                null,
                request.getName(),
                request.getCategory(),
                request.getPrice(),
                request.isAvailable()
        );

        MenuItem saved = menuItemRepository.save(item);
        return mapToResponse(saved);
    }

    public MenuItemResponse update(Long id, MenuItemRequest request) {
        MenuItem item = menuItemRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Menu item not found"));

        item.setName(request.getName());
        item.setCategory(request.getCategory());
        item.setPrice(request.getPrice());
        item.setAvailable(request.isAvailable());

        return mapToResponse(menuItemRepository.save(item));
    }

    public void delete(Long id) {
        menuItemRepository.deleteById(id); // Hard delete (you chose A)
    }

    public List<MenuItemResponse> getAll() {
        return menuItemRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public List<MenuItemResponse> getAvailable() {
        return menuItemRepository.findAll()
                .stream()
                .filter(MenuItem::isAvailable)
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    private MenuItemResponse mapToResponse(MenuItem item) {
        return new MenuItemResponse(
                item.getId(),
                item.getName(),
                item.getCategory(),
                item.getPrice(),
                item.isAvailable()
        );
    }
}
