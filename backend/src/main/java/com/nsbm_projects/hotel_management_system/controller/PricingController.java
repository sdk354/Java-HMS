package com.nsbm_projects.hotel_management_system.controller;

import com.nsbm_projects.hotel_management_system.model.Pricing;
import com.nsbm_projects.hotel_management_system.repository.PricingRepository;
import com.nsbm_projects.hotel_management_system.repository.RoomTypeRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/pricing")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173", "http://localhost:4173"})
public class PricingController {

    private final PricingRepository repository;
    private final RoomTypeRepository roomTypeRepository;

    public PricingController(PricingRepository repository, RoomTypeRepository roomTypeRepository) {
        this.repository = repository;
        this.roomTypeRepository = roomTypeRepository;
    }

    @GetMapping
    public List<Pricing> getAllRules() {
        return repository.findAll();
    }

    @PostMapping
    public Pricing createRule(@RequestBody Pricing pricing) {
        // If frontend sends roomTypeID as a flat field, map it to the object
        if (pricing.getRoomType() == null && pricing.getRoomTypeID() != null) {
            roomTypeRepository.findById(pricing.getRoomTypeID())
                    .ifPresent(pricing::setRoomType);
        }
        return repository.save(pricing);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Pricing> updateRule(@PathVariable Integer id, @RequestBody Pricing updatedDetails) {
        return repository.findById(id)
                .map(existingRule -> {
                    existingRule.setSeasonName(updatedDetails.getSeasonName());
                    existingRule.setStartDate(updatedDetails.getStartDate());
                    existingRule.setEndDate(updatedDetails.getEndDate());
                    existingRule.setPricingMultiplier(updatedDetails.getPricingMultiplier());

                    // Handle Relationship Mapping
                    if (updatedDetails.getRoomType() != null) {
                        existingRule.setRoomType(updatedDetails.getRoomType());
                    } else if (updatedDetails.getRoomTypeID() != null) {
                        roomTypeRepository.findById(updatedDetails.getRoomTypeID())
                                .ifPresent(existingRule::setRoomType);
                    }

                    return ResponseEntity.ok(repository.save(existingRule));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteRule(@PathVariable Integer id) {
        if (repository.existsById(id)) {
            repository.deleteById(id);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }
}