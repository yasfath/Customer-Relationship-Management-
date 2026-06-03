package com.example.demo.dto;


import java.time.LocalDate;
import java.time.LocalTime;

public class ActivityRequestDTO {

    private String activityType;
    private LocalDate date;
    private LocalTime time;
    private Integer duration;
    private String description;

    private Long leadId;
    private Long contactId;

    public String getActivityType() {
        return activityType;
    }

    public void setActivityType(String activityType) {
        this.activityType = activityType;
    }

    public LocalDate getDate() {
        return date;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }

    public LocalTime getTime() {
        return time;
    }

    public void setTime(LocalTime time) {
        this.time = time;
    }

    public Integer getDuration() {
        return duration;
    }

    public void setDuration(Integer duration) {
        this.duration = duration;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Long getLeadId() {
        return leadId;
    }

    public void setLeadId(Long leadId) {
        this.leadId = leadId;
    }

    public Long getContactId() {
        return contactId;
    }

    public void setContactId(Long contactId) {
        this.contactId = contactId;
    }

    public ActivityRequestDTO() {
    }

    public ActivityRequestDTO(String activityType, LocalDate date, LocalTime time, Integer duration, String description, Long leadId, Long contactId) {
        this.activityType = activityType;
        this.date = date;
        this.time = time;
        this.duration = duration;
        this.description = description;
        this.leadId = leadId;
        this.contactId = contactId;
    }
}
