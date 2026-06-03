package com.example.demo.dto;

import lombok.Data;

@Data
public class ProfileStatsDTO {

    private Long campaignsLed;
    private Long leadsGenerated;
    private Long teamSize;

    public ProfileStatsDTO(Long campaignsLed, Long leadsGenerated, Long teamSize) {
        this.campaignsLed = campaignsLed;
        this.leadsGenerated = leadsGenerated;
        this.teamSize = teamSize;
    }

    public Long getCampaignsLed() {
        return campaignsLed;
    }

    public Long getLeadsGenerated() {
        return leadsGenerated;
    }

    public Long getTeamSize() {
        return teamSize;
    }
}