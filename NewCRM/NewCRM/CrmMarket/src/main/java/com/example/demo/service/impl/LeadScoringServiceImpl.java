package com.example.demo.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.dto.LeadScoreRequestDTO;
import com.example.demo.dto.LeadScoreResponseDTO;
import com.example.demo.entity.Lead;
import com.example.demo.entity.LeadScore;
import com.example.demo.entity.LeadStatus;
import com.example.demo.repository.LeadRepository;
import com.example.demo.repository.LeadScoreRepository;
import com.example.demo.service.LeadScoringService;

@Service
public class LeadScoringServiceImpl implements LeadScoringService {

	
    private static final int MQL_THRESHOLD = 50;

    @Autowired
    private  LeadRepository leadRepository;
    @Autowired
    private  LeadScoreRepository leadScoreRepository;


    @Override
    public LeadScoreResponseDTO updateScore(LeadScoreRequestDTO dto) {

        Lead lead = leadRepository.findById(dto.getLeadId())
                .orElseThrow(() -> new RuntimeException("Lead not found"));

        LeadScore leadScore = leadScoreRepository.findByLead(lead)
                .orElseGet(() -> {
                    LeadScore ls = new LeadScore();
                    ls.setLead(lead);
                    ls.setScore(0);
                    ls.setMql(false);
                    return ls;
                });

        int updatedScore = leadScore.getScore() + dto.getScoreChange();
        leadScore.setScore(updatedScore);

        if (updatedScore >= MQL_THRESHOLD) {
            leadScore.setMql(true);
            lead.setStatus(LeadStatus.QUALIFIED);
            leadRepository.save(lead);
        }

        leadScoreRepository.save(leadScore);

        LeadScoreResponseDTO response = new LeadScoreResponseDTO();
        response.setLeadId(lead.getLeadId());
        response.setScore(updatedScore);
        response.setMql(leadScore.getMql());

        return response;
    }

    @Override
    public LeadScoreResponseDTO getScore(Long leadId) {

        Lead lead = leadRepository.findById(leadId)
                .orElseThrow(() -> new RuntimeException("Lead not found"));

        LeadScore leadScore = leadScoreRepository.findByLead(lead)
                .orElseThrow(() -> new RuntimeException("Score not found"));

        LeadScoreResponseDTO response = new LeadScoreResponseDTO();
        response.setLeadId(lead.getLeadId());
        response.setScore(leadScore.getScore());
        response.setMql(leadScore.getMql());

        return response;
    }
}
