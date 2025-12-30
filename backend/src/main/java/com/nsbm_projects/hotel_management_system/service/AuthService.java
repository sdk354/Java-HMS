package com.nsbm_projects.hotel_management_system.service;

import com.nsbm_projects.hotel_management_system.dto.AuthResponse;
import com.nsbm_projects.hotel_management_system.dto.LoginRequest;
import com.nsbm_projects.hotel_management_system.dto.RegisterRequest;
import com.nsbm_projects.hotel_management_system.model.Role;
import com.nsbm_projects.hotel_management_system.model.User;
import com.nsbm_projects.hotel_management_system.repository.RoleRepository;
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
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;

    public AuthService(UserRepository userRepository,
                       RoleRepository roleRepository,
                       PasswordEncoder passwordEncoder,
                       AuthenticationManager authenticationManager,
                       JwtService jwtService) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.jwtService = jwtService;
    }

    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new IllegalArgumentException("Username already taken");
        }
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("Email already registered");
        }

        Role userRole = roleRepository.findByName("USER")
                .orElseGet(() -> roleRepository.save(new Role(null, "USER")));

        User user = new User();
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setFullName(request.getFullName());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.getRoles().add(userRole);
        user.setEnabled(true);

        userRepository.save(user);

        var claims = new HashMap<String, Object>();
        claims.put("roles", user.getRoles().stream().map(Role::getName).toArray(String[]::new));

        String token = jwtService.generateToken(user.getUsername(), claims);
        return new AuthResponse(token, "Bearer");
    }

    public AuthResponse login(LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword())
        );

        User user = userRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new IllegalArgumentException("Invalid credentials"));

        var claims = new HashMap<String, Object>();
        claims.put("roles", user.getRoles().stream().map(Role::getName).toArray(String[]::new));

        String token = jwtService.generateToken(user.getUsername(), claims);
        return new AuthResponse(token, "Bearer");
    }
}
