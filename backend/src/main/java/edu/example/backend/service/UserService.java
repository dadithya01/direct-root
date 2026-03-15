package edu.example.backend.service;

import edu.example.backend.dto.UserDTO;

import java.util.List;

public interface UserService {
    List<UserDTO> getAllUsers();
    void deleteUser(Long id, String currentUsername);

}
