package com.studyflow.studyflow.services;

import com.studyflow.studyflow.security.AuthenticatedUser;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.time.Duration;
import java.util.Collection;
import java.util.Date;
import java.util.List;
import java.util.UUID;

@Service
public class JwtService {

    private final SecretKey secretKey;

    @Value("jwt.expiration")
    private long expirationTime;

    public JwtService(@Value("${jwt.secret}") String secret) {
        this.secretKey = Keys.hmacShaKeyFor(
                secret.getBytes(StandardCharsets.UTF_8)
        );
    }

    public String generateToken(AuthenticatedUser authUser) {
        Date now = new Date();
        return Jwts.builder()
                .subject(authUser.getEmail())
                .issuedAt(now)
                .expiration(Date.from(now.toInstant().plus(Duration.ofMillis(expirationTime))))
                .claim("Id", authUser.getId())
                .claim(
                        "Roles",
                        authUser.getAuthorities()
                                .stream()
                                .map(GrantedAuthority::getAuthority)
                                .toList()
                )
                .signWith(secretKey)
                .compact();
    }

    public boolean isTokenValid(String token) {
        try {
            Claims claims = getClaims(token);
            return true;
        } catch (JwtException | IllegalArgumentException e) {
            return false;
        }
    }

    public String getToken(HttpServletRequest request) {
        String auth = request.getHeader("Authorization");

        if (auth != null && auth.startsWith("Bearer ")) {
            return auth.substring(7);
        }
        return null;
    }

    public Claims getClaims(String token) {
        return Jwts.parser()
                .verifyWith(secretKey)
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    public AuthenticatedUser getAuthenticatedUser(String token) {
        Claims claims = getClaims(token);

        UUID id = UUID.fromString(claims.get("Id", String.class));
        String email = claims.get("Email", String.class);
        String role = claims.get("Role", String.class);

        Collection<GrantedAuthority> authorities = List.of(new SimpleGrantedAuthority("ROLE_" + role));

        return new AuthenticatedUser(id, email, authorities);
    }
}
