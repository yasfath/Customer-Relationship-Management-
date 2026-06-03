package com.example.demo.dto;

public class ROIResponseDTO {

    private Long campaignId;
    private double campaignCost;
    private double revenueGenerated;
    private double roiPercentage;

    public ROIResponseDTO() {

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

    public double getRoiPercentage() {
        return roiPercentage;
    }

    public void setRoiPercentage(double roiPercentage) {
        this.roiPercentage = roiPercentage;
    }

    public ROIResponseDTO(Long campaignId, double campaignCost, double revenueGenerated, double roiPercentage) {
        this.campaignId = campaignId;
        this.campaignCost = campaignCost;
        this.revenueGenerated = revenueGenerated;
        this.roiPercentage = roiPercentage;




    }


}
