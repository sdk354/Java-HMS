package com.nsbm_projects.hotel_management_system.service;

import com.nsbm_projects.hotel_management_system.dto.AuthResponse;
import com.nsbm_projects.hotel_management_system.dto.LoginRequest;
import com.nsbm_projects.hotel_management_system.dto.RegisterRequest;
import com.nsbm_projects.hotel_management_system.model.User;
import com.nsbm_projects.hotel_management_system.repository.UserRepository;
import com.nsbm_projects.hotel_management_system.security.JwtService;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.HashMap;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;

    public AuthService(UserRepository userRepository,
                       PasswordEncoder passwordEncoder,
                       AuthenticationManager authenticationManager,
                       JwtService jwtService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.jwtService = jwtService;
    }

    // ================= REGISTER =================
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new IllegalArgumentException("Username already taken");
        }
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("Email already registered");
        }

        // Simplified User Creation matching your SQL schema
        User user = User.builder()
                .username(request.getUsername())
                .email(request.getEmail())
                .fullName(request.getFullName())
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .role("guest") // Default role as a simple string
                .enabled(true)
                .build();

        userRepository.save(user);

        return generateAuthResponse(user);
    }

    // ================= LOGIN =================
    public AuthResponse login(LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getUsername(),
                        request.getPassword()
                )
        );

        User user = userRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new IllegalArgumentException("Invalid credentials"));

        return generateAuthResponse(user);
    }

    private AuthResponse generateAuthResponse(User user) {
        var claims = new HashMap<String, Object>();

        // We now store the single role string in the JWT claims
        claims.put("role", user.getRole());

        String token = jwtService.generateToken(user.getUsername(), claims);

        // Your React routing logic: Map "admin" to "administration"
        String formattedRole = user.getRole().toLowerCase();
        if (formattedRole.equals("admin")) formattedRole = "administration";

        return AuthResponse.builder()
                .token(token)
                .tokenType("Bearer")
                .role(formattedRole)
                .fullName(user.getFullName())
                .userID(user.getUserID()) // Match your new field name userID
                .build();
    }
}