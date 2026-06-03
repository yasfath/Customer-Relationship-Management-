package com.example.demo.dto;

import com.example.demo.entity.CampaignStatus;

public class CampaignResponseDTO {

    private Long campaignId;
    private String name;
    private String type;
    private CampaignStatus status;
    private Integer leadsGenerated;
    private Double conversionRate;
    private Double roi;

    public CampaignResponseDTO(
            Long campaignId,
            String name,
            String type,
            CampaignStatus status,
            Integer leadsGenerated,
            Double conversionRate,
            Double roi) {

        this.campaignId = campaignId;
        this.name = name;
        this.type = type;
        this.status = status;
        this.leadsGenerated = leadsGenerated;
        this.conversionRate = conversionRate;
        this.roi = roi;
    }

    public Long getCampaignId() { return campaignId; }
    public String getName() { return name; }
    public String getType() { return type; }
    public CampaignStatus getStatus() { return status; }
    public Integer getLeadsGenerated() { return leadsGenerated; }
    public Double getConversionRate() { return conversionRate; }
    public Double getRoi() { return roi; }

    public void setCampaignId(Long campaignId) { this.campaignId = campaignId; }
    public void setName(String name) { this.name = name; }
    public void setType(String type) { this.type = type; }
    public void setStatus(CampaignStatus status) { this.status = status; }
    public void setLeadsGenerated(Integer leadsGenerated) { this.leadsGenerated = leadsGenerated; }
    public void setConversionRate(Double conversionRate) { this.conversionRate = conversionRate; }
    public void setRoi(Double roi) { this.roi = roi; }
}