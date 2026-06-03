package com.example.demo.dto;

import com.example.demo.entity.LeadStatus;

public class LeadResponseDTO {

    private Long leadId;
    private String fullName;
    private String email;
    private LeadStatus status;
    private String assignedTo;

    // 🔮 FUTURE SCOPE 3
    private Integer leadScore;
    private String segment;


    public LeadResponseDTO(Long leadId, String fullName, String email, LeadStatus status, String assignedTo, Integer leadScore, String segment) {
        this.leadId = leadId;
        this.fullName = fullName;
        this.email = email;
        this.status = status;
        this.assignedTo = assignedTo;
        this.leadScore = leadScore;
        this.segment = segment;
    }

    public LeadResponseDTO() {}

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
}
