package com.example.demo.dto;

import java.time.LocalDateTime;

public class ActivityTimelineDTO {

    private String activityType;
    private String description;
    private String personName;
    private String company;
    private LocalDateTime createdAt;

    public ActivityTimelineDTO() {
    }

    public String getActivityType() {
        return activityType;
    }

    public void setActivityType(String activityType) {
        this.activityType = activityType;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getPersonName() {
        return personName;
    }

    public void setPersonName(String personName) {
        this.personName = personName;
    }

    public String getCompany() {
        return company;
    }

    public void setCompany(String company) {
        this.company = company;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public ActivityTimelineDTO(String activityType, String description, String personName, String company, LocalDateTime createdAt) {
        this.activityType = activityType;
        this.description = description;
        this.personName = personName;
        this.company = company;
        this.createdAt = createdAt;
    }
}
