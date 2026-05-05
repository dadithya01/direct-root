package edu.example.backend.service.impl;

import edu.example.backend.dto.AuthDTO;
import edu.example.backend.dto.AuthResponseDTO;
import edu.example.backend.dto.RegisterDTO;
import edu.example.backend.entity.ActivityLog;
import edu.example.backend.entity.Product;
import edu.example.backend.entity.Role;
import edu.example.backend.entity.User;
import edu.example.backend.repository.ActivityLogRepository;
import edu.example.backend.repository.OrderItemRepository;
import edu.example.backend.repository.ProductRepository;
import edu.example.backend.repository.UserRepository;
import edu.example.backend.service.AuthService;
import edu.example.backend.util.JwtService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final ActivityLogRepository activityLogRepository;
    private final ProductRepository productRepository;
    private final OrderItemRepository orderItemRepository;  // ← added

    public String register(RegisterDTO dto) {
        if (userRepository.findByUsername(dto.getUsername()).isPresent()) {
            throw new RuntimeException("User already exists");
        }
        User user = User.builder()
                .username(dto.getUsername())
                .password(passwordEncoder.encode(dto.getPassword()))
                .role(dto.getRole())
                .build();
        userRepository.save(user);
        activityLogRepository.save(ActivityLog.builder()
                .username(user.getUsername())
                .action("User Registered")
                .role(user.getRole())
                .performedBy(user.getUsername())
                .timestamp(LocalDateTime.now())
                .build());
        return jwtService.generateToken(user.getUsername());
    }

    public AuthResponseDTO authenticate(AuthDTO dto) {
        User user = userRepository.findByUsername(dto.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));
        if (passwordEncoder.matches(dto.getPassword(), user.getPassword())) {
            String token = jwtService.generateToken(user.getUsername());
            return new AuthResponseDTO(token, user.getRole());
        }
        throw new RuntimeException("Invalid credentials");
    }

    @Override
    public void changePassword(String username, String currentPassword, String newPassword) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        if (!passwordEncoder.matches(currentPassword, user.getPassword())) {
            throw new RuntimeException("Current password is incorrect");
        }
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
    }

    @Override
    @Transactional
    public void deleteAccount(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (user.getRole() == Role.FARMER) {
            List<Product> products = productRepository.findByFarmerUsername(username);
            if (!products.isEmpty()) {
                throw new RuntimeException(
                        "You still have " + products.size() + " product(s) listed. " +
                                "Please remove all your products before deleting your account."
                );
            }

            orderItemRepository.anonymizeFarmerItems(username);
        }

        activityLogRepository.save(ActivityLog.builder()
                .username(user.getUsername())
                .action("Account Deleted")
                .role(user.getRole())
                .performedBy(user.getUsername())
                .timestamp(LocalDateTime.now())
                .build());

        userRepository.delete(user);
    }
}