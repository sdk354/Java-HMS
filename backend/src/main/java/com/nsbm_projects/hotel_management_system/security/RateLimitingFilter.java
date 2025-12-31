package com.nsbm_projects.hotel_management_system.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.time.Instant;
import java.time.ZoneOffset;
import java.time.format.DateTimeFormatter;

@Component
public class RateLimitingFilter extends OncePerRequestFilter {

    private final StringRedisTemplate redis;

    @Value("${app.ratelimit.enabled:true}")
    private boolean enabled;

    @Value("${app.ratelimit.limit-per-minute:60}")
    private int limitPerMinute;

    private static final DateTimeFormatter MINUTE_FMT =
            DateTimeFormatter.ofPattern("yyyyMMddHHmm").withZone(ZoneOffset.UTC);

    public RateLimitingFilter(StringRedisTemplate redis) {
        this.redis = redis;
    }

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) {
        // Rate limit only "public-ish" endpoints (you can adjust)
        String path = request.getRequestURI();
        return !path.startsWith("/api/auth/");
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {

        if (!enabled) {
            filterChain.doFilter(request, response);
            return;
        }

        String ip = getClientIp(request);
        String path = request.getRequestURI();
        String minute = MINUTE_FMT.format(Instant.now());

        String key = "rl:" + ip + ":" + path + ":" + minute;

        try {
            Long count = redis.opsForValue().increment(key);
            if (count != null && count == 1) {
                redis.expire(key, java.time.Duration.ofSeconds(60));
            }

            if (count != null && count > limitPerMinute) {
                response.setStatus(429);
                response.setContentType("application/json");
                response.getWriter().write("{\"error\":\"Too many requests. Please try again later.\"}");
                return;
            }
        } catch (Exception e) {
            // fail-open if Redis is down (do not crash your app)
        }

        filterChain.doFilter(request, response);
    }

    private String getClientIp(HttpServletRequest request) {
        String xf = request.getHeader("X-Forwarded-For");
        if (StringUtils.hasText(xf)) {
            return xf.split(",")[0].trim();
        }
        return request.getRemoteAddr();
    }
}
