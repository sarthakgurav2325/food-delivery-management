
package com.fooddelivery.management.config;

import com.fooddelivery.management.entity.Admin;
import com.fooddelivery.management.repository.AdminRepository;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.core.env.Environment;

@Configuration
public class AdminInitializer {

    @Bean
    public CommandLineRunner createInitialAdmin(
            AdminRepository adminRepository,
            PasswordEncoder passwordEncoder,
            Environment environment) {

        return args -> {

            String email = environment.getProperty("ADMIN_EMAIL");
            String password = environment.getProperty("ADMIN_PASSWORD");

            if (email == null || email.isBlank()
                    || password == null || password.isBlank()) {

                System.out.println(
                    "Initial admin not created. Set ADMIN_EMAIL and ADMIN_PASSWORD."
                );
                return;
            }

            if (adminRepository.findByEmail(email).isEmpty()) {

                Admin admin = new Admin(
                    email,
                    passwordEncoder.encode(password),
                    "Administrator"
                );

                adminRepository.save(admin);

                System.out.println("Initial admin account created.");
            } else {
                System.out.println("Admin account already exists.");
            }
        };
    }
}
