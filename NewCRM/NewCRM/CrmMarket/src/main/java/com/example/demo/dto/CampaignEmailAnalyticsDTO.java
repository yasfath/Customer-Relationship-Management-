package com.example.demo.dto;

public class CampaignEmailAnalyticsDTO {

    private Long campaignId;
    private long totalSent;
    private long opened;
    private long clicked;
    private double openRate;
    private double clickRate;

    public CampaignEmailAnalyticsDTO(Long campaignId, long totalSent, long opened, long clicked, double openRate, double clickRate) {
        this.campaignId = campaignId;
        this.totalSent = totalSent;
        this.opened = opened;
        this.clicked = clicked;
        this.openRate = openRate;
        this.clickRate = clickRate;
    }

    public CampaignEmailAnalyticsDTO() {}

    public Long getCampaignId() {
        return campaignId;
    }

    public void setCampaignId(Long campaignId) {
        this.campaignId = campaignId;
    }

    public long getTotalSent() {
        return totalSent;
    }

    public void setTotalSent(long totalSent) {
        this.totalSent = totalSent;
    }

    public long getOpened() {
        return opened;
    }

    public void setOpened(long opened) {
        this.opened = opened;
    }

    public long getClicked() {
        return clicked;
    }

    public void setClicked(long clicked) {
        this.clicked = clicked;
    }

    public double getOpenRate() {
        return openRate;
    }

    public void setOpenRate(double openRate) {
        this.openRate = openRate;
    }

    public double getClickRate() {
        return clickRate;
    }

    public void setClickRate(double clickRate) {
        this.clickRate = clickRate;
    }
}
