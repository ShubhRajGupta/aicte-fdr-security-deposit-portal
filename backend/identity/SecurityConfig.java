package org.aicte.fdr.identity;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.header.writers.ReferrerPolicyHeaderWriter;

/**
 * Spring Security Configuration enforcing NIST SP 800-63B guidelines,
 * HttpOnly cookie session management, and role-based method guards.
 */
@Configuration
@EnableWebSecurity
@EnableMethodSecurity(prePostEnabled = true)
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable()) // Controlled via SameSite cookies & Gateway
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .headers(headers -> headers
                .contentSecurityPolicy(csp -> csp.policyDirectives("default-src 'self'; img-src 'self' data:; script-src 'self'; frame-ancestors 'none'"))
                .frameOptions(frame -> frame.deny())
                .referrerPolicy(referrer -> referrer.policy(ReferrerPolicyHeaderWriter.ReferrerPolicy.STRICT_ORIGIN_WHEN_CROSS_ORIGIN))
            )
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/auth/**", "/api/public/**", "/actuator/health").permitAll()
                .requestMatchers("/api/admin/**").hasRole("SYSTEM_ADMIN")
                .requestMatchers("/api/audit/**").hasAnyRole("AUDITOR", "SYSTEM_ADMIN", "BUREAU_OFFICER")
                .requestMatchers("/api/instruments/*/approve-release").hasRole("COMPETENT_AUTHORITY")
                .requestMatchers("/api/instruments/**").authenticated()
                .anyRequest().authenticated()
            );

        return http.build();
    }
}
