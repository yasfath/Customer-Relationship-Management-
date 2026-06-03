package com.example.demo.dto;

import java.time.LocalDate;
import java.time.LocalTime;

public class LogRequestDTO {

    private String outcome;
    private String notes;
    private String activityType;
    private Long emailLogId;

    public Long getEmailLogId() {
        return emailLogId;
    }

    public void setEmailLogId(Long emailLogId) {
        this.emailLogId = emailLogId;
    }

    private String nextActionType;
    private LocalDate nextActionDate;
    private LocalTime nextActionTime;

    private String status;

    private Long leadId;
    private Long contactId;

    public LogRequestDTO() {
    }

    public LogRequestDTO(String outcome, String notes, String activityType, Long emailLogId, String nextActionType, LocalDate nextActionDate, LocalTime nextActionTime, String status, Long leadId, Long contactId) {
        this.outcome = outcome;
        this.notes = notes;
        this.activityType = activityType;
        this.emailLogId = emailLogId;
        this.nextActionType = nextActionType;
        this.nextActionDate = nextActionDate;
        this.nextActionTime = nextActionTime;
        this.status = status;
        this.leadId = leadId;
        this.contactId = contactId;
    }

    public String getOutcome() {
        return outcome;
    }

    public void setOutcome(String outcome) {
        this.outcome = outcome;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }

    public String getActivityType() {
        return activityType;
    }

    public void setActivityType(String activityType) {
        this.activityType = activityType;
    }

    public String getNextActionType() {
        return nextActionType;
    }

    public void setNextActionType(String nextActionType) {
        this.nextActionType = nextActionType;
    }

    public LocalDate getNextActionDate() {
        return nextActionDate;
    }

    public void setNextActionDate(LocalDate nextActionDate) {
        this.nextActionDate = nextActionDate;
    }

    public LocalTime getNextActionTime() {
        return nextActionTime;
    }

    public void setNextActionTime(LocalTime nextActionTime) {
        this.nextActionTime = nextActionTime;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
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
}
