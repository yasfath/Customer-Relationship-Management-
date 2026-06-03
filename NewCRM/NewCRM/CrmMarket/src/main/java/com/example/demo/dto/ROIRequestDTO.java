package com.example.demo.dto;

public class ROIRequestDTO {

    private Long campaignId;
    private double campaignCost;
    private double revenueGenerated;

    public ROIRequestDTO(Long campaignId, double campaignCost, double revenueGenerated) {
        this.campaignId = campaignId;
        this.campaignCost = campaignCost;
        this.revenueGenerated = revenueGenerated;
    }

    public Long getCampaignId() {
        return campaignId;
    }

    public void setCampaignId(Long campaignId) {
        this.campaignId = campaignId;
    }

    public double getCampaignCost() {
        return campaignCost;
    }

    public void setCampaignCost(double campaignCost) {
        this.campaignCost = campaignCost;
    }

    public double getRevenueGenerated() {
        return revenueGenerated;
    }

    public void setRevenueGenerated(double revenueGenerated) {
        this.revenueGenerated = revenueGenerated;
    }
}
