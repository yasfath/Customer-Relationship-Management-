package com.example.demo.service;

import com.example.demo.dto.*;


import java.util.List;

public interface LeadService {

    LeadResponseDTO createLead(LeadRequestDTO request);

    void updateLeadStatus(Long leadId, String status);

    void addInteraction(Long leadId, LeadInteractionDTO dto);

    LeadStatsDTO getLeadStats();

    List<LeadTableDTO> getAllLeads();

    List<LeadTableDTO> filterLeads(
            String status,
            String assignedTo,
            String search
    );

    LeadResponseDTO updateLead(Long id, LeadRequestDTO request);
    // 🔮 Future Scope 3
    void autoSegmentLead(Long leadId);

    void deleteLead(Long id);

    void sendBulkCampaign(BulkCampaignRequestDTO dto);

}
