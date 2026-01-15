package com.nsbm_projects.hotel_management_system.controller;

import com.nsbm_projects.hotel_management_system.dto.AuthResponse;
import com.nsbm_projects.hotel_management_system.dto.LoginRequest;
import com.nsbm_projects.hotel_management_system.dto.RegisterRequest;
import com.nsbm_projects.hotel_management_system.service.AuthService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
// Updated to include common React (3000) and Vite (5173) dev ports alongside preview (4173)
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173", "http://localhost:4173"})
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@RequestBody RegisterRequest request) {
        return ResponseEntity.ok(authService.register(request));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest request) {
        // Returns AuthResponse containing token, role, fullName, and Integer id
        return ResponseEntity.ok(authService.login(request));
    }

    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser() {
        // Updated to provide a hook for returning the full AuthResponse/Profile
        // This is vital for the frontend to persist login state after a refresh.
        return ResponseEntity.ok(authService.getCurrentUserInfo());
    }
}