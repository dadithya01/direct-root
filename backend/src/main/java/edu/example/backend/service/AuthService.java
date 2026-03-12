package edu.example.backend.service;

import edu.example.backend.dto.AuthDTO;
import edu.example.backend.dto.AuthResponseDTO;
import edu.example.backend.dto.RegisterDTO;
import edu.example.backend.entity.User;
import edu.example.backend.repository.UserRepository;
import edu.example.backend.util.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public String register(RegisterDTO dto) {
        if(userRepository.findByUsername(dto.getUsername()).isPresent()) {
            throw new RuntimeException("User already exists");
        }
        User user = User.builder()
                .username(dto.getUsername())
                .password(passwordEncoder.encode(dto.getPassword()))
                .role(dto.getRole())
                .build();
        userRepository.save(user);
        return jwtService.generateToken(user.getUsername());
    }

    public AuthResponseDTO authenticate(AuthDTO dto) {

        User user = userRepository.findByUsername(dto.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (passwordEncoder.matches(dto.getPassword(), user.getPassword())) {
            String token=jwtService.generateToken(user.getUsername());
            AuthResponseDTO authResponseDTO=new AuthResponseDTO(token,user.getRole());
            return authResponseDTO;

        }
        throw new RuntimeException("Invalid credentials");
    }
}
