package com.nsbm_projects.hotel_management_system.service;

import com.nsbm_projects.hotel_management_system.dto.MenuItemRequest;
import com.nsbm_projects.hotel_management_system.dto.MenuItemResponse;
import com.nsbm_projects.hotel_management_system.model.ServiceItem;
import com.nsbm_projects.hotel_management_system.repository.ServiceItemRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ServiceItemService {

    private final ServiceItemRepository serviceItemRepository;

    public ServiceItemService(ServiceItemRepository serviceItemRepository) {
        this.serviceItemRepository = serviceItemRepository;
    }

    // ================= CREATE =================
    public MenuItemResponse create(MenuItemRequest request) {
        ServiceItem item = ServiceItem.builder()
                .itemName(request.getName())
                .category(request.getCategory())
                .unitPrice(request.getPrice())
                .availability(request.isAvailable() ? "Available" : "OutOfStock")
                .build();

        ServiceItem saved = serviceItemRepository.save(item);
        return mapToResponse(saved);
    }

    // ================= UPDATE =================
    public MenuItemResponse update(Integer id, MenuItemRequest request) {
        ServiceItem item = serviceItemRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Service item not found"));

        item.setItemName(request.getName());
        item.setCategory(request.getCategory());
        item.setUnitPrice(request.getPrice());
        item.setAvailability(request.isAvailable() ? "Available" : "OutOfStock");

        return mapToResponse(serviceItemRepository.save(item));
    }

    // ================= DELETE =================
    public void delete(Integer id) {
        if (!serviceItemRepository.existsById(id)) {
            throw new RuntimeException("Cannot delete: Service item not found");
        }
        serviceItemRepository.deleteById(id);
    }

    // ================= GET ALL =================
    public List<MenuItemResponse> getAll() {
        return serviceItemRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    // ================= GET AVAILABLE =================
    public List<MenuItemResponse> getAvailable() {
        return serviceItemRepository.findByAvailabilityTrue()
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    private MenuItemResponse mapToResponse(ServiceItem item) {
        return new MenuItemResponse(
                item.getItemID(),
                item.getItemName(),
                item.getCategory(),
                item.getUnitPrice(),
                "Available".equalsIgnoreCase(item.getAvailability())
        );
    }
}