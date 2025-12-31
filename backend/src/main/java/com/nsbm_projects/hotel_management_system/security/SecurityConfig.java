package com.nsbm_projects.hotel_management_system.security;

import com.nsbm_projects.hotel_management_system.repository.UserRepository;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableMethodSecurity
public class SecurityConfig {

    private final JwtService jwtService;
    private final UserRepository userRepository;
    private final RateLimitingFilter rateLimitingFilter;

    public SecurityConfig(JwtService jwtService,
                          UserRepository userRepository,
                          RateLimitingFilter rateLimitingFilter) {
        this.jwtService = jwtService;
        this.userRepository = userRepository;
        this.rateLimitingFilter = rateLimitingFilter;
    }

    // -------------------------
    // UserDetailsService
    // -------------------------
    @Bean
    public UserDetailsService userDetailsService() {
        return username -> userRepository.findByUsername(username)
                .map(user -> (UserDetails) org.springframework.security.core.userdetails.User
                        .withUsername(user.getUsername())
                        .password(user.getPassword())
                        .authorities(user.getRoles().stream()
                                .map(role -> "ROLE_" + role.getName())
                                .toArray(String[]::new))
                        .disabled(!user.isEnabled())
                        .build())
                .orElseThrow(() ->
                        new UsernameNotFoundException("User not found: " + username));
    }

    // -------------------------
    // Authentication Provider
    // -------------------------
    @Bean
    public AuthenticationProvider authenticationProvider(
            PasswordEncoder encoder,
            UserDetailsService userDetailsService) {

        DaoAuthenticationProvider provider = new DaoAuthenticationProvider();
        provider.setPasswordEncoder(encoder);
        provider.setUserDetailsService(userDetailsService);
        return provider;
    }

    // -------------------------
    // Password Encoder
    // -------------------------
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    // -------------------------
    // Authentication Manager
    // -------------------------
    @Bean
    public AuthenticationManager authenticationManager(
            AuthenticationConfiguration configuration) throws Exception {
        return configuration.getAuthenticationManager();
    }

    // -------------------------
    // JWT Filter
    // -------------------------
    @Bean
    public JwtAuthenticationFilter jwtAuthenticationFilter() {
        return new JwtAuthenticationFilter(jwtService, userRepository);
    }

    // -------------------------
    // Security Filter Chain
    // -------------------------
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http,
                                           AuthenticationProvider authenticationProvider)
            throws Exception {

        http
                .csrf(csrf -> csrf.disable())
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(
                                "/api/auth/**",
                                "/actuator/health",
                                "/actuator/info"
                        ).permitAll()
                        .anyRequest().authenticated()
                )
                .authenticationProvider(authenticationProvider)

                // 🔹 Rate limiting FIRST (Task 15)
                .addFilterBefore(rateLimitingFilter, UsernamePasswordAuthenticationFilter.class)

                // 🔹 JWT authentication SECOND
                .addFilterBefore(jwtAuthenticationFilter(), UsernamePasswordAuthenticationFilter.class)

                .httpBasic(Customizer.withDefaults());

        return http.build();
    }
}
