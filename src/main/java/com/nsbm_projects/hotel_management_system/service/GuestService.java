package com.nsbm_projects.hotel_management_system.service;

import com.nsbm_projects.hotel_management_system.model.Guest;
import com.nsbm_projects.hotel_management_system.repository.GuestRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class GuestService {

    @Autowired
    private GuestRepository guestRepository;

    // Register a new Guest
    public Guest saveGuest(Guest guest) {
        // In a real app, we might check if email exists first
        return guestRepository.save(guest);
    }

    // Get all guests (for Admin use)
    public List<Guest> getAllGuests() {
        return guestRepository.findAll();
    }

    // Get Guest by ID
    public Optional<Guest> getGuestById(Long id) {
        return guestRepository.findById(id);
    }

    // Update Guest Profile
    public Guest updateGuest(Long id, Guest guestDetails) {
        return guestRepository.findById(id).map(guest -> {
            guest.setFirstName(guestDetails.getFirstName());
            guest.setLastName(guestDetails.getLastName());
            guest.setEmail(guestDetails.getEmail());
            guest.setPhoneNumber(guestDetails.getPhoneNumber());
            return guestRepository.save(guest);
        }).orElseThrow(() -> new RuntimeException("Guest not found"));
    }
}