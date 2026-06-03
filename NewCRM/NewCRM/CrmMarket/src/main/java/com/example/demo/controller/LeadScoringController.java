package com.example.demo.controller;

import com.example.demo.dto.*;
import com.example.demo.service.LeadScoringService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/lead-scoring")
public class LeadScoringController {

    private final LeadScoringService leadScoringService;

    public LeadScoringController(LeadScoringService leadScoringService) {
        this.leadScoringService = leadScoringService;
    }

    // 🔹 post  Lead Score
    @PostMapping("/create")
    public ResponseEntity<LeadScoreResponseDTO> updateScore(
            @RequestBody LeadScoreRequestDTO dto) {

        return ResponseEntity.ok(leadScoringService.updateScore(dto));
    }

    // 🔹 Get Lead Score
    @GetMapping("/{leadId}")
    public ResponseEntity<LeadScoreResponseDTO> getScore(
            @PathVariable Long leadId) {

        return ResponseEntity.ok(leadScoringService.getScore(leadId));
    }
}
