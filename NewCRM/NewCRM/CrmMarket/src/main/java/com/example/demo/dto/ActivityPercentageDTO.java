package com.example.demo.dto;


public class ActivityPercentageDTO {
    private Long totalActivities;
    private Long completedActivities;
    private Double percentage;

    public ActivityPercentageDTO() {
    }

    public ActivityPercentageDTO(Long totalActivities, Long completedActivities, Double percentage) {
        this.totalActivities = totalActivities;
        this.completedActivities = completedActivities;
        this.percentage = percentage;
    }

    public Long getTotalActivities() {
        return totalActivities;
    }

    public void setTotalActivities(Long totalActivities) {
        this.totalActivities = totalActivities;
    }

    public Long getCompletedActivities() {
        return completedActivities;
    }

    public void setCompletedActivities(Long completedActivities) {
        this.completedActivities = completedActivities;
    }

    public Double getPercentage() {
        return percentage;
    }

    public void setPercentage(Double percentage) {
        this.percentage = percentage;
    }
}
