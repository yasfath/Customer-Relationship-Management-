package com.example.demo.dto;


import com.example.demo.entity.LeadStatus;

import java.time.LocalDateTime;

public class LeadTableDTO {

    private Long leadId;
    private String fullName;
    private String email;
    private String phone;
    private String source;
    private LeadStatus status;
    private String assignedTo;
    private String assignedStaff;
    private Integer leadScore;
    private String segment;
    private Boolean automationEnabled;
    private LocalDateTime createdAt;
    private Long campaignId;
    private String campaignName;

    public LeadTableDTO() {
    }

    public String getAssignedStaff() {
        return assignedStaff;
    }

    public void setAssignedStaff(String assignedStaff) {
        this.assignedStaff = assignedStaff;
    }

    public LeadTableDTO(Long leadId, String fullName, String email, String phone, String source, LeadStatus status, String assignedTo, String assignedStaff, Integer leadScore, String segment, Boolean automationEnabled, LocalDateTime createdAt, Long campaignId, String campaignName) {
        this.leadId = leadId;
        this.fullName = fullName;
        this.email = email;
        this.phone = phone;
        this.source = source;
        this.status = status;
        this.assignedTo = assignedTo;
        this.assignedStaff = assignedStaff;
        this.leadScore = leadScore;
        this.segment = segment;
        this.automationEnabled = automationEnabled;
        this.createdAt = createdAt;
        this.campaignId = campaignId;
        this.campaignName = campaignName;
    }

    public LeadTableDTO(Long leadId, String fullName, String email, String phone, String source, LeadStatus status, String assignedTo, Integer leadScore, String segment, Boolean automationEnabled, LocalDateTime createdAt, Long campaignId, String campaignName) {
        this.leadId = leadId;
        this.fullName = fullName;
        this.email = email;
        this.phone = phone;
        this.source = source;
        this.status = status;
        this.assignedTo = assignedTo;
        this.leadScore = leadScore;
        this.segment = segment;
        this.automationEnabled = automationEnabled;
        this.createdAt = createdAt;
        this.campaignId = campaignId;
        this.campaignName = campaignName;
    }

    public LeadTableDTO(Long leadId, String fullName, String email, String phone, String source, LeadStatus status, String assignedTo) {
        this.leadId = leadId;
        this.fullName = fullName;
        this.email = email;
        this.phone = phone;
        this.source = source;
        this.status = status;
        this.assignedTo = assignedTo;
    }

    public Long getLeadId() {
        return leadId;
    }

    public void setLeadId(Long leadId) {
        this.leadId = leadId;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getSource() {
        return source;
    }

    public void setSource(String source) {
        this.source = source;
    }

    public LeadStatus getStatus() {
        return status;
    }

    public void setStatus(LeadStatus status) {
        this.status = status;
    }

    public String getAssignedTo() {
        return assignedTo;
    }

    public void setAssignedTo(String assignedTo) {
        this.assignedTo = assignedTo;
    }

    public Integer getLeadScore() {
        return leadScore;
    }

    public void setLeadScore(Integer leadScore) {
        this.leadScore = leadScore;
    }

    public String getSegment() {
        return segment;
    }

    public void setSegment(String segment) {
        this.segment = segment;
    }

    public Boolean getAutomationEnabled() {
        return automationEnabled;
    }

    public void setAutomationEnabled(Boolean automationEnabled) {
        this.automationEnabled = automationEnabled;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public Long getCampaignId() {
        return campaignId;
    }

    public void setCampaignId(Long campaignId) {
        this.campaignId = campaignId;
    }

    public String getCampaignName() {
        return campaignName;
    }

    public void setCampaignName(String campaignName) {
        this.campaignName = campaignName;
    }
}
