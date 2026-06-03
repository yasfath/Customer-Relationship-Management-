package com.example.demo.dto;

public class RecommendationDTO {

    private String bestChannel;
    private String bestTime;
    private String engagementLevel;

    public RecommendationDTO(String bestChannel, String bestTime, String engagementLevel) {
        this.bestChannel = bestChannel;
        this.bestTime = bestTime;
        this.engagementLevel = engagementLevel;
    }

    public RecommendationDTO() {

    }

    public String getBestChannel() {
        return bestChannel;
    }

    public void setBestChannel(String bestChannel) {
        this.bestChannel = bestChannel;
    }

    public String getBestTime() {
        return bestTime;
    }

    public void setBestTime(String bestTime) {
        this.bestTime = bestTime;
    }

    public String getEngagementLevel() {
        return engagementLevel;
    }

    public void setEngagementLevel(String engagementLevel) {
        this.engagementLevel = engagementLevel;
    }
}
