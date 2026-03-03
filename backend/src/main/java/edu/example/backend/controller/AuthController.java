package edu.example.backend.controller;

import edu.example.backend.dto.AuthDTO;
import edu.example.backend.dto.AuthResponseDTO;
import edu.example.backend.dto.RegisterDTO;
import edu.example.backend.service.AuthService;
import edu.example.backend.util.APIResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
@CrossOrigin
public class AuthController {
    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<APIResponse> register(@RequestBody RegisterDTO registerDTO) {
        String token = authService.register(registerDTO);
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
        String token = authService.authenticate(authDTO);
        return ResponseEntity.ok(
                APIResponse.builder()
                        .status(200)
                        .message("Login Successful")
                        .data(AuthResponseDTO.builder().token(token).build())
                        .build()
        );
    }
}
