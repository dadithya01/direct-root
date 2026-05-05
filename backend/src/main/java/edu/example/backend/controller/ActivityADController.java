package edu.example.backend.controller;

import edu.example.backend.entity.ActivityLog;
import edu.example.backend.repository.ActivityLogRepository;
import edu.example.backend.util.APIResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/activity")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ActivityADController {
    private final ActivityLogRepository activityLogRepository;

    @GetMapping
    public List<ActivityLog> getActivities() {
        return activityLogRepository.findAll();
    }

    @DeleteMapping("/clear")
    public ResponseEntity<APIResponse> clearLogs() {
        activityLogRepository.deleteAll();
        return ResponseEntity.ok(
                APIResponse.builder()
                        .status(200)
                        .message("Activity logs cleared successfully")
                        .build()
        );
    }
}
