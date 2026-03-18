package edu.example.backend.service.impl;

import edu.example.backend.dto.UserDTO;
import edu.example.backend.entity.ActivityLog;
import edu.example.backend.entity.Product;
import edu.example.backend.entity.Role;
import edu.example.backend.entity.User;
import edu.example.backend.repository.ActivityLogRepository;
import edu.example.backend.repository.ProductRepository;
import edu.example.backend.repository.UserRepository;
import edu.example.backend.service.UserService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final ModelMapper modelMapper;
    private final ActivityLogRepository activityLogRepository;
    private final ProductRepository productRepository;
    @Override
    public List<UserDTO> getAllUsers() {
        List<User> users = userRepository.findAll();

        return users.stream()
                .map(user -> modelMapper.map(user, UserDTO.class))
                .toList();
    }

    @Override
    @Transactional
    public void deleteUser(Long id, String currentUsername) {
        User targetUser = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (targetUser.getRole() == Role.ADMIN &&
                !targetUser.getUsername().equals(currentUsername)) {
            throw new RuntimeException("Admins cannot delete other admins");
        }

        // Save log BEFORE delete
        activityLogRepository.save(ActivityLog.builder()
                .username(targetUser.getUsername())
                .action("User Deleted")
                .role(targetUser.getRole())
                .performedBy(currentUsername)
                .timestamp(LocalDateTime.now())
                .build());

        // Delete AFTER log
        userRepository.delete(targetUser);
    }
}
