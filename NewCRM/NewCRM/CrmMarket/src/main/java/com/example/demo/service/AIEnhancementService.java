package com.example.demo.service;

import com.example.demo.dto.PredictionResponseDTO;
import com.example.demo.dto.RecommendationDTO;
import org.springframework.beans.factory.annotation.Autowired;

public interface AIEnhancementService {

    PredictionResponseDTO predictLead(Long leadId);

    RecommendationDTO recommendCampaign(Long leadId);
}
