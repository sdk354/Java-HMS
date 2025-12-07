package com.nsbm_projects.hotel_management_system.controller;

import com.nsbm_projects.hotel_management_system.model.Guest;
import com.nsbm_projects.hotel_management_system.service.GuestService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/guests")
@CrossOrigin("*")
public class GuestController {

    @Autowired
    private GuestService guestService;

    // Create / Register Guest
    @PostMapping
    public Guest createGuest(@RequestBody Guest guest) {
        return guestService.saveGuest(guest);
    }

    // Get All Guests
    @GetMapping
    public List<Guest> getAllGuests() {
        return guestService.getAllGuests();
    }

    // Get Guest by ID
    @GetMapping("/{id}")
    public ResponseEntity<Guest> getGuestById(@PathVariable Long id) {
        return guestService.getGuestById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Update Guest Profile
    @PutMapping("/{id}")
    public ResponseEntity<Guest> updateGuest(@PathVariable Long id, @RequestBody Guest guestDetails) {
        try {
            return ResponseEntity.ok(guestService.updateGuest(id, guestDetails));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
}