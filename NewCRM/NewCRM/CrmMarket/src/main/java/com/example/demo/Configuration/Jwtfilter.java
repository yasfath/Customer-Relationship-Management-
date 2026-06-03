package com.example.demo.Configuration;

import com.example.demo.repository.BlacklistedTokenRepository;
import io.jsonwebtoken.Claims;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

@Component
public class Jwtfilter extends OncePerRequestFilter {

    private final BlacklistedTokenRepository blacklistRepository;
    private final JwtUtil jwtUtil;


    public Jwtfilter(BlacklistedTokenRepository blacklistRepository, JwtUtil jwtUtil) {
        this.blacklistRepository = blacklistRepository;
        this.jwtUtil = jwtUtil;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain)
            throws ServletException, IOException {

        try {

            String authHeader = request.getHeader("Authorization");

            if (authHeader != null && authHeader.startsWith("Bearer ")) {

                String token = authHeader.substring(7);

                // Check if token is blacklisted
                if (!blacklistRepository.existsByToken(token)
                        && jwtUtil.validateToken(token)) {

                    Claims claims = jwtUtil.extractAllClaims(token);

                    String username = claims.getSubject();
                    String role = claims.get("role", String.class);
                    String profileId = claims.get("profileId", String.class);
                    Long staffId = claims.get("staffId", Long.class);
                    // MULTI TENANT CONTEXT
                    TenantContext.setCurrentTenant(profileId);
                    TenantContext.setCurrentStaffId(staffId);
                    System.out.println(profileId);
                    System.out.println(staffId);
// ENABLE HIBERNATE FILTER HERE
//                    tenantFilter.enableTenantFilter();

                    SimpleGrantedAuthority authority =
                            new SimpleGrantedAuthority("ROLE_" + role);

                    User user = new User(username, "", List.of(authority));

                    UsernamePasswordAuthenticationToken authentication =
                            new UsernamePasswordAuthenticationToken(
                                    user,
                                    null,
                                    user.getAuthorities()
                            );

                    authentication.setDetails(
                            new WebAuthenticationDetailsSource()
                                    .buildDetails(request)
                    );

                    SecurityContextHolder.getContext()
                            .setAuthentication(authentication);
                }
            }

            filterChain.doFilter(request, response);

        } finally {
            // IMPORTANT: clear tenant after request
            TenantContext.clear();
        }
    }
}