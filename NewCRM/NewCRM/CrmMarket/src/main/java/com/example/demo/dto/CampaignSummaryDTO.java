package com.example.demo.dto;

public class CampaignSummaryDTO {
    private long totalCampaigns;
    private long activeCampaigns;
    private long totalLeadsGenerated;
    private Double avgConversionRate;

    public CampaignSummaryDTO(long totalCampaigns, long activeCampaigns, long totalLeadsGenerated, Double avgConversionRate) {
        this.totalCampaigns = totalCampaigns;
        this.activeCampaigns = activeCampaigns;
        this.totalLeadsGenerated = totalLeadsGenerated;
        this.avgConversionRate = avgConversionRate;
    }

    public long getTotalLeadsGenerated() {
        return totalLeadsGenerated;
    }

    public void setTotalLeadsGenerated(long totalLeadsGenerated) {
        this.totalLeadsGenerated = totalLeadsGenerated;
    }

    public Double getAvgConversionRate() {
        return avgConversionRate;
    }

    public void setAvgConversionRate(Double avgConversionRate) {
        this.avgConversionRate = avgConversionRate;
    }

    public CampaignSummaryDTO() {
    }

    public CampaignSummaryDTO(long totalCampaigns, long activeCampaigns) {
        this.totalCampaigns = totalCampaigns;
        this.activeCampaigns = activeCampaigns;
    }

    public long getTotalCampaigns() {
        return totalCampaigns;
    }

    public void setTotalCampaigns(long totalCampaigns) {
        this.totalCampaigns = totalCampaigns;
    }

    public long getActiveCampaigns() {
        return activeCampaigns;
    }

    public void setActiveCampaigns(long activeCampaigns) {
        this.activeCampaigns = activeCampaigns;
    }
}
