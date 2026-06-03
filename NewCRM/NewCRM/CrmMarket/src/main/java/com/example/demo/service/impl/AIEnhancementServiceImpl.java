package com.example.demo.service.impl;

import com.example.demo.dto.PredictionResponseDTO;
import com.example.demo.dto.RecommendationDTO;
import com.example.demo.entity.AIPredictionLog;
import com.example.demo.repository.AIPredictionLogRepository;
import com.example.demo.service.AIEnhancementService;
import org.springframework.stereotype.Service;

@Service
public class AIEnhancementServiceImpl implements AIEnhancementService {

    private final AIPredictionLogRepository predictionRepo;

    public AIEnhancementServiceImpl(
            AIPredictionLogRepository predictionRepo) {
        this.predictionRepo = predictionRepo;
    }

    @Override
    public PredictionResponseDTO predictLead(Long leadId) {

        // later fetch from LeadScoringService
        int score = 60;

        double probability = score / 100.0;

        String action;
        if (score > 70) {
            action = "Sales Follow-up";
        } else if (score > 40) {
            action = "Nurture Campaign";
        } else {
            action = "Re-engagement Campaign";
        }

        // Save prediction log
        AIPredictionLog log = new AIPredictionLog();
        log.setLeadId(leadId);
        log.setLeadScore(score);
        log.setConversionProbability(probability);
        log.setRecommendation(action);

        predictionRepo.save(log);

        return new PredictionResponseDTO(score, probability, action);
    }

    @Override
    public RecommendationDTO recommendCampaign(Long leadId) {

        RecommendationDTO dto = new RecommendationDTO();
        dto.setBestChannel("Email");
        dto.setBestTime("7 PM");
        dto.setEngagementLevel("High");

        return dto;
    }
}
