package edu.example.backend.controller;

import edu.example.backend.dto.UserDTO;
import edu.example.backend.service.UserService;
import edu.example.backend.util.APIResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("api/v1/admin")
@CrossOrigin
public class UserController {

    private final UserService userService;
    @GetMapping
    public ResponseEntity<APIResponse> getAllUsers() {
        List<UserDTO> users = userService.getAllUsers();

        return ResponseEntity.ok(
                APIResponse.builder()
                        .status(200)
                        .message("User Database Loaded Successfully")
                        .data(users)
                        .build()
        );
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<?> deleteUser(
            @PathVariable Long id,
            Authentication auth) {

        userService.deleteUser(id, auth.getName());

        return ResponseEntity.ok("User deleted");
    }

}
