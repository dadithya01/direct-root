package edu.example.backend.service;

import edu.example.backend.dto.AuthDTO;
import edu.example.backend.dto.AuthResponseDTO;
import edu.example.backend.dto.RegisterDTO;

public interface AuthService {
    String register(RegisterDTO registerDTO);
    AuthResponseDTO authenticate(AuthDTO authDTO);
    void changePassword(String username, String currentPassword, String newPassword);
    void deleteAccount(String username);
}
