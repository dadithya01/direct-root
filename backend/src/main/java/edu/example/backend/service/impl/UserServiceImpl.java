package edu.example.backend.service.impl;

import edu.example.backend.dto.UserDTO;
import edu.example.backend.entity.Role;
import edu.example.backend.entity.User;
import edu.example.backend.repository.UserRepository;
import edu.example.backend.service.UserService;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final ModelMapper modelMapper;
    @Override
    public List<UserDTO> getAllUsers() {
        List<User> users = userRepository.findAll();

        return users.stream()
                .map(user -> modelMapper.map(user, UserDTO.class))
                .toList();
    }

    @Override
    public void deleteUser(Long id, String currentUsername) {
        User targetUser = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Block deleting another admin
        if (targetUser.getRole() == Role.ADMIN &&
                !targetUser.getUsername().equals(currentUsername)) {

            throw new RuntimeException("Admins cannot delete other admins");
        }

        userRepository.delete(targetUser);
    }
}
