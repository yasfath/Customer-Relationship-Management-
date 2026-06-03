package com.example.demo.service.impl;

import com.example.demo.Configuration.TenantContext;
import com.example.demo.dto.ProfileStatsDTO;
import com.example.demo.repository.CampaignRepository;
import com.example.demo.repository.LeadRepository;
import com.example.demo.repository.StaffRepository;
import org.springframework.stereotype.Service;

@Service
public class ProfileStatsService {

    private final CampaignRepository campaignRepository;
    private final LeadRepository leadRepository;
    private final StaffRepository staffRepository;

    public ProfileStatsService(
            CampaignRepository campaignRepository,
            LeadRepository leadRepository,
            StaffRepository staffRepository) {

        this.campaignRepository = campaignRepository;
        this.leadRepository = leadRepository;
        this.staffRepository = staffRepository;
    }

    public ProfileStatsDTO getStats() {

        String profileId = TenantContext.getCurrentTenant();
        Long campaigns = campaignRepository.countByProfileId(profileId);
        Long leads = leadRepository.countByProfileId(profileId);
        Long team = staffRepository.countByProfileId(profileId);

        return new ProfileStatsDTO(campaigns, leads, team);
    }
}