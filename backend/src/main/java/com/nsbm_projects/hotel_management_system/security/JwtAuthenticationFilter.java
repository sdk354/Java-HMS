package com.nsbm_projects.hotel_management_system.security;

import com.nsbm_projects.hotel_management_system.repository.UserRepository;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpHeaders;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final UserRepository userRepository;

    public JwtAuthenticationFilter(JwtService jwtService, UserRepository userRepository) {
        this.jwtService = jwtService;
        this.userRepository = userRepository;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain chain)
            throws ServletException, IOException {

        // 1. Skip CORS preflight
        if ("OPTIONS".equalsIgnoreCase(request.getMethod())) {
            chain.doFilter(request, response);
            return;
        }

        final String header = request.getHeader(HttpHeaders.AUTHORIZATION);

        if (StringUtils.hasText(header) && header.startsWith("Bearer ")) {
            final String token = header.substring(7);
            try {
                final String username = jwtService.extractUsername(token);

                // Safely extract the role from the token
                final String roleFromToken = jwtService.extractClaim(token, claims -> claims.get("role", String.class));

                if (username != null && roleFromToken != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                    if (jwtService.isTokenValid(token, username)) {

                        // We create a list of authorities to match both styles
                        List<SimpleGrantedAuthority> authorities = new ArrayList<>();

                        // 1. The Standard Spring Role (ROLE_ADMIN)
                        authorities.add(new SimpleGrantedAuthority("ROLE_" + roleFromToken.toUpperCase()));

                        // 2. The Raw Role (admin) - matches your current SecurityConfig
                        authorities.add(new SimpleGrantedAuthority(roleFromToken.toLowerCase()));

                        UsernamePasswordAuthenticationToken auth = new UsernamePasswordAuthenticationToken(
                                username,
                                null,
                                authorities
                        );

                        auth.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                        SecurityContextHolder.getContext().setAuthentication(auth);

                        // Helpful for debugging in the console
                        System.out.println("Authenticated: " + username + " with authorities: " + authorities);
                    }
                }
            } catch (Exception e) {
                // Clear context if token is malformed or expired
                SecurityContextHolder.clearContext();
                System.err.println("JWT Authentication failed: " + e.getMessage());
            }
        }
        chain.doFilter(request, response);
    }
}