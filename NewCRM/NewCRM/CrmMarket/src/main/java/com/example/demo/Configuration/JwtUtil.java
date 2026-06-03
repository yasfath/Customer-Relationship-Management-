package com.example.demo.Configuration;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.Date;

@Component
public class JwtUtil {

    @Value("${jwt.secret}")
    private String SECRET_KEY;

    @Value("${jwt.expirationMs:3600000}")
    private long EXPIRATION_TIME;

    // ================================
    // Generate Token
    // ================================
    public String generateToken(String username, String role, String profileId, Long staffId) {

        return Jwts.builder()
                .setSubject(username)
                .claim("role", role)
                .claim("profileId", profileId)
                .claim("staffId", staffId)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION_TIME))
                .signWith(getSigningKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    public String extractProfileId(String token) {

        return extractAllClaims(token)
                .get("profileId", String.class);
    }

    // ================================
    // Extract Username
    // ================================
    public String extractUsername(String token) {
        return extractAllClaims(token).getSubject();
    }

    // ================================
    // Extract Role
    // ================================
    public String extractRole(String token) {
        return extractAllClaims(token).get("role", String.class);
    }

    // ================================
    // Extract Expiration
    // ================================
    public LocalDateTime extractExpiration(String token) {

        Date expiration = extractAllClaims(token).getExpiration();

        return expiration.toInstant()
                .atZone(ZoneId.systemDefault())
                .toLocalDateTime();
    }

    // ================================
    // Validate Token
    // ================================
    public boolean validateToken(String token) {

        try {
            Jwts.parserBuilder()
                    .setSigningKey(getSigningKey())
                    .build()
                    .parseClaimsJws(token);

            return true;

        } catch (JwtException | IllegalArgumentException e) {
            return false;
        }
    }

    // ================================
    // Extract All Claims
    // ================================
    public Claims extractAllClaims(String token) {
        try {
            return Jwts.parserBuilder()
                    .setSigningKey(getSigningKey())
                    .build()
                    .parseClaimsJws(token)
                    .getBody();
        } catch (ExpiredJwtException e) {
            return e.getClaims();   // Used for refresh token logic
        }
    }
    // ================================
    // Signing Key (FIXED)
    // ================================
    private Key getSigningKey() {

        // Use raw bytes from long secret string (>= 32 chars)
        return Keys.hmacShaKeyFor(SECRET_KEY.getBytes());
    }
}