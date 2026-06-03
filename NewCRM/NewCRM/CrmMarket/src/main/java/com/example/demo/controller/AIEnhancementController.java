package com.example.demo.controller;

import com.example.demo.dto.PredictionResponseDTO;
import com.example.demo.dto.RecommendationDTO;
import com.example.demo.service.AIEnhancementService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/ai")
public class AIEnhancementController {

    private final AIEnhancementService aiService;

    public AIEnhancementController(AIEnhancementService aiService) {
        this.aiService = aiService;
    }

    @GetMapping("/predict/{leadId}")
    public PredictionResponseDTO predict(
            @PathVariable Long leadId) {

        return aiService.predictLead(leadId);
    }

    @GetMapping("/recommend/{leadId}")
    public RecommendationDTO recommend(
            @PathVariable Long leadId) {

        return aiService.recommendCampaign(leadId);
    }
}
