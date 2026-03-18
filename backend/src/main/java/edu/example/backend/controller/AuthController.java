package edu.example.backend.controller;

import edu.example.backend.dto.AuthDTO;
import edu.example.backend.dto.AuthResponseDTO;
import edu.example.backend.dto.ChangePasswordDTO;
import edu.example.backend.dto.RegisterDTO;
import edu.example.backend.entity.User;
import edu.example.backend.repository.UserRepository;
import edu.example.backend.service.AuthService;
import edu.example.backend.service.impl.AuthServiceImpl;
import edu.example.backend.util.APIResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class AuthController {
    private final AuthServiceImpl authServiceImpl;
    private final UserRepository userRepository;

    @PostMapping("/register")
    public ResponseEntity<APIResponse> register(@RequestBody RegisterDTO registerDTO) {
        String token = authServiceImpl.register(registerDTO);
        return ResponseEntity.ok(
                APIResponse.builder()
                        .status(201)
                        .message("User Registered")
                        .data(AuthResponseDTO.builder().token(token).build())
                        .build()
        );
    }

    @PostMapping("/signin")
    public ResponseEntity<APIResponse> signIn(@RequestBody AuthDTO authDTO) {
        AuthResponseDTO token = authServiceImpl.authenticate(authDTO);
        return ResponseEntity.ok(
                APIResponse.builder()
                        .status(200)
                        .message("Login Successful")
                        .data(AuthResponseDTO.builder().token(token.getToken()).role(token.getRole()).build())
                        .build()
        );
    }

    @PutMapping("/change-password")
    public ResponseEntity<?> changePassword(
            @RequestBody ChangePasswordDTO dto,
            Authentication auth) {
        authServiceImpl.changePassword(auth.getName(), dto.getCurrentPassword(), dto.getNewPassword());
        return ResponseEntity.ok("Password changed successfully");
    }

    @DeleteMapping("/delete-account")
    public ResponseEntity<?> deleteAccount(Authentication auth) {
        authServiceImpl.deleteAccount(auth.getName());
        return ResponseEntity.ok(
                APIResponse.builder()
                        .status(200)
                        .message("Account deleted successfully")
                        .data(null)
                        .build()
        );
    }
}
