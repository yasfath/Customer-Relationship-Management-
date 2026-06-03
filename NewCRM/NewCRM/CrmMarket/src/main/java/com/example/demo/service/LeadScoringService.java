package com.example.demo.service;

import com.example.demo.dto.LeadScoreRequestDTO;
import com.example.demo.dto.LeadScoreResponseDTO;

public interface LeadScoringService {

    LeadScoreResponseDTO updateScore(LeadScoreRequestDTO dto);

    LeadScoreResponseDTO getScore(Long leadId);
}
