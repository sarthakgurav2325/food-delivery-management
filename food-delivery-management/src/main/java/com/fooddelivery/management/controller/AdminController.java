
package com.fooddelivery.management.controller;

import com.fooddelivery.management.entity.Admin;
import com.fooddelivery.management.repository.AdminRepository;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import org.springframework.core.env.Environment;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.context.HttpSessionSecurityContextRepository;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final AuthenticationManager authenticationManager;
    private final AdminRepository adminRepository;
    private final PasswordEncoder passwordEncoder;
    private final Environment environment;

    public AdminController(
            AuthenticationManager authenticationManager,
            AdminRepository adminRepository,
            PasswordEncoder passwordEncoder,
            Environment environment) {

        this.authenticationManager = authenticationManager;
        this.adminRepository = adminRepository;
        this.passwordEncoder = passwordEncoder;
        this.environment = environment;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(
            @Valid @RequestBody RegisterRequest request) {

        String inviteCode = environment.getProperty("ADMIN_INVITE_CODE");

        if (inviteCode == null || inviteCode.isBlank()) {
            return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE)
                    .body(Map.of("message",
                            "Admin registration is not configured"));
        }

        boolean validCode = MessageDigest.isEqual(
                inviteCode.getBytes(StandardCharsets.UTF_8),
                request.invitationCode().getBytes(StandardCharsets.UTF_8)
        );

        if (!validCode) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(Map.of("message", "Invalid invitation code"));
        }

        String email = request.email().trim().toLowerCase();

        if (adminRepository.findByEmail(email).isPresent()) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(Map.of("message",
                            "An admin account with this email already exists"));
        }

        if (!request.password().equals(request.confirmPassword())) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", "Passwords do not match"));
        }

        Admin admin = new Admin(
                email,
                passwordEncoder.encode(request.password()),
                request.fullName().trim()
        );

        adminRepository.save(admin);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(Map.of("message",
                        "Admin account created successfully. Please log in."));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(
            @RequestBody LoginRequest request,
            HttpServletRequest httpRequest,
            HttpServletResponse httpResponse) {

        try {
            Authentication authentication =
                    authenticationManager.authenticate(
                            new UsernamePasswordAuthenticationToken(
                                    request.email().trim().toLowerCase(),
                                    request.password()
                            )
                    );

            SecurityContext context =
                    SecurityContextHolder.createEmptyContext();

            context.setAuthentication(authentication);
            SecurityContextHolder.setContext(context);

            httpRequest.getSession(true);

            new HttpSessionSecurityContextRepository()
                    .saveContext(context, httpRequest, httpResponse);

            return ResponseEntity.ok(Map.of(
                    "message", "Login successful",
                    "email", authentication.getName()
            ));

        } catch (org.springframework.security.core.AuthenticationException ex) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "Invalid email or password"));
        }
    }

    @GetMapping("/me")
    public ResponseEntity<?> currentAdmin(Authentication authentication) {

        if (authentication == null ||
                !authentication.isAuthenticated() ||
                authentication instanceof AnonymousAuthenticationToken) {

            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "Not logged in"));
        }

        return ResponseEntity.ok(Map.of(
                "email", authentication.getName()
        ));
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpServletRequest request) {

        SecurityContextHolder.clearContext();

        if (request.getSession(false) != null) {
            request.getSession(false).invalidate();
        }

        return ResponseEntity.ok(
                Map.of("message", "Logged out successfully")
        );
    }

    public record LoginRequest(
            @NotBlank String email,
            @NotBlank String password) {
    }

    public record RegisterRequest(
            @NotBlank
            @Size(max = 100)
            String fullName,

            @NotBlank
            @Email
            @Size(max = 150)
            String email,

            @NotBlank
            @Size(min = 8, max = 72)
            String password,

            @NotBlank
            String confirmPassword,

            @NotBlank
            String invitationCode) {
    }
}
