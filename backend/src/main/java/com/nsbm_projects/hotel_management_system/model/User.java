package com.nsbm_projects.hotel_management_system.model;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;

@Entity
@Table(name = "`User` ") // Backticks required because 'User' is a reserved keyword
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class User implements UserDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "userID") // Matches your SQL PRIMARY KEY
    private Long id;

    @Column(unique = true, nullable = false, length = 100)
    private String username;

    @Column(unique = true, nullable = false, length = 150)
    private String email;

    @Column(name = "passwordHash", nullable = false, length = 255) // Matches your SQL column
    private String password;

    @Column(name = "fullName", length = 150) // Matches your camelCase SQL column
    private String fullName;

    @Column(nullable = false)
    private String role; // Changed from Set<Role> to String to match your schema

    // 🔹 UserDetails Implementation
    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        // Converts your single string role (e.g., "admin") into "ROLE_ADMIN"
        return List.of(new SimpleGrantedAuthority("ROLE_" + role.toUpperCase()));
    }

    @Override
    public String getPassword() {
        return this.password;
    }

    @Override
    public String getUsername() {
        return this.username;
    }

    @Override
    public boolean isAccountNonExpired() { return true; }

    @Override
    public boolean isAccountNonLocked() { return true; }

    @Override
    public boolean isCredentialsNonExpired() { return true; }

    @Override
    public boolean isEnabled() { return true; }
}