package com.example.demo.controller;

import com.example.demo.dto.LogRequestDTO;
import com.example.demo.dto.LogTableDTO;
import com.example.demo.service.LogService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/logs")
@CrossOrigin(origins = "*") // allow frontend access
public class LogController {

    private final LogService logService;

    public LogController(LogService logService) {
        this.logService = logService;
    }

    // =====================================================
    // CREATE ACTIVITY LOG
    // =====================================================
    @PostMapping("/activity")
    public ResponseEntity<String> createLog(
            @RequestBody LogRequestDTO dto) {

        logService.logActivity(dto);

        return ResponseEntity.ok("Activity logged successfully");
    }

    // =====================================================
    // GET DASHBOARD ACTIVITIES
    // =====================================================
    @GetMapping("/dashboard")
    public ResponseEntity<List<LogTableDTO>> getDashboardLogs() {

        List<LogTableDTO> logs =
                logService.getDashboardActivities();

        return ResponseEntity.ok(logs);
    }
}