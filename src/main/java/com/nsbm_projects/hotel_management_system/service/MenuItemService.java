package com.nsbm_projects.hotel_management_system.service;

import com.nsbm_projects.hotel_management_system.model.MenuItem;
import com.nsbm_projects.hotel_management_system.repository.MenuItemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class MenuItemService {

    @Autowired
    private MenuItemRepository menuItemRepository;

    // Save a new menu item
    public MenuItem saveMenuItem(MenuItem menuItem) {
        return menuItemRepository.save(menuItem);
    }

    // Get all menu items
    public List<MenuItem> getAllMenuItems() {
        return menuItemRepository.findAll();
    }

    // Get item by ID
    public Optional<MenuItem> getMenuItemById(Long id) {
        return menuItemRepository.findById(id);
    }

    // Update item
    public MenuItem updateMenuItem(Long id, MenuItem menuItemDetails) {
        return menuItemRepository.findById(id).map(item -> {
            item.setName(menuItemDetails.getName());
            item.setDescription(menuItemDetails.getDescription());
            item.setPrice(menuItemDetails.getPrice());
            item.setCategory(menuItemDetails.getCategory());
            item.setAvailable(menuItemDetails.isAvailable());
            return menuItemRepository.save(item);
        }).orElseThrow(() -> new RuntimeException("Menu Item not found"));
    }

    // Delete item
    public void deleteMenuItem(Long id) {
        menuItemRepository.deleteById(id);
    }
}