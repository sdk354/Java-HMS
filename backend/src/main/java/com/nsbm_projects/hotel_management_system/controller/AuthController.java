package com.nsbm_projects.hotel_management_system.controller;

import com.nsbm_projects.hotel_management_system.dto.AuthResponse;
import com.nsbm_projects.hotel_management_system.dto.LoginRequest;
import com.nsbm_projects.hotel_management_system.dto.RegisterRequest;
import com.nsbm_projects.hotel_management_system.service.AuthService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
// CRITICAL: Allow your React app (port 3000 or 5173) to access these endpoints
@CrossOrigin(origins = {"http://localhost:4173"})
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
        // This now returns the token, role, fullName, and id
        return ResponseEntity.ok(authService.login(request));
    }

    @GetMapping("/me")
    public ResponseEntity<String> me() {
        // Currently returns a string; in the future, we can change this to return
        // the user profile so the frontend stays synced on refresh.
        return ResponseEntity.ok("You are authenticated.");
    }
}