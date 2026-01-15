package com.nsbm_projects.hotel_management_system.service;

import com.nsbm_projects.hotel_management_system.dto.AuthResponse;
import com.nsbm_projects.hotel_management_system.dto.LoginRequest;
import com.nsbm_projects.hotel_management_system.dto.RegisterRequest;
import com.nsbm_projects.hotel_management_system.model.User;
import com.nsbm_projects.hotel_management_system.repository.UserRepository;
import com.nsbm_projects.hotel_management_system.security.JwtService;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
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

        User user = User.builder()
                .username(request.getUsername())
                .email(request.getEmail())
                .fullName(request.getFullName())
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .role("guest")
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

    // ================= GET CURRENT USER =================
    public AuthResponse getCurrentUserInfo() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return generateAuthResponse(user);
    }

    /**
     * Internal helper to build the response with JWT and Role mapping.
     */
    private AuthResponse generateAuthResponse(User user) {
        // 1. Prepare JWT Claims for the backend filter
        var claims = new HashMap<String, Object>();
        claims.put("role", user.getRole()); // Value: "housekeeping"

        // 2. Generate token
        String token = jwtService.generateToken(user.getUsername(), claims);

        // 3. Format Role for Frontend routing
        String formattedRole = user.getRole().toLowerCase();

        // Maps 'admin' to 'administration' for React paths,
        // leaves 'housekeeping' as is.
        if (formattedRole.equals("admin")) {
            formattedRole = "administration";
        }

        return AuthResponse.builder()
                .token(token)
                .tokenType("Bearer")
                .role(formattedRole)
                .fullName(user.getFullName())
                .userID(user.getUserID()) // Mapped to "id" in JSON
                .build();
    }
}