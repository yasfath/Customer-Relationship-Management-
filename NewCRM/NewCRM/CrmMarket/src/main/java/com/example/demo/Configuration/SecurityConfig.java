package com.example.demo.Configuration;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

@Configuration
public class SecurityConfig {

    private static final List<String> LOCAL_ALLOWED_ORIGIN_PATTERNS = List.of(
            "http://localhost",
            "http://localhost:*",
            "https://localhost",
            "https://localhost:*",
            "http://127.0.0.1",
            "http://127.0.0.1:*",
            "https://127.0.0.1",
            "https://127.0.0.1:*",
            "http://10.0.2.2",
            "http://10.0.2.2:*",
            "http://10.0.3.2",
            "http://10.0.3.2:*",
            "http://192.168.*",
            "http://192.168.*:*",
            "https://192.168.*",
            "https://192.168.*:*",
            "http://10.*",
            "http://10.*:*",
            "https://10.*",
            "https://10.*:*",
            "capacitor://localhost",
            "ionic://localhost",
            "https://videzebra.in"
    );

    @Autowired
    private Jwtfilter jwtFilter;

    // Password Encoder
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    // Security Configuration
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {

        http
                // Enable CORS
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))

                // Disable CSRF for APIs
                .csrf(csrf -> csrf.disable())

                // Authorization Rules
                .authorizeHttpRequests(auth -> auth

                        // Allow preflight requests
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()

                        // Public APIs
                        .requestMatchers(
                                "/api/auth/login",
                                "/api/auth/forgot-password",
                                "/api/auth/reset-password",
                                "/api/profile/create"
                        ).permitAll()

                        // Everything else allowed for now
                        .anyRequest().permitAll()
                );

        // JWT Filter (enable when authentication is implemented)
        // http.addFilterBefore(jwtFilter,
        //         UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    // CORS Configuration
   @Bean
public CorsConfigurationSource corsConfigurationSource() {

    CorsConfiguration configuration = new CorsConfiguration();

    configuration.setAllowedOriginPatterns(LOCAL_ALLOWED_ORIGIN_PATTERNS);

    configuration.setAllowedMethods(List.of(
            "GET",
            "POST",
            "PUT",
            "DELETE",
            "OPTIONS"
    ));

    configuration.setAllowedHeaders(List.of("*"));
    configuration.setAllowCredentials(true);
    configuration.setMaxAge(3600L);

    UrlBasedCorsConfigurationSource source =
            new UrlBasedCorsConfigurationSource();

    source.registerCorsConfiguration("/**", configuration);

    return source;
}
}
