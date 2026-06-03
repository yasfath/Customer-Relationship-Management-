package com.example.demo.dto;

import com.example.demo.entity.EmailStatus;

import java.time.LocalDate;


public class EmailLogResponseDTO {

    private Long emailId;
    private String email;
    private EmailStatus status;
    private LocalDate date;
    private String Lead;
    private String outcome;
    private String Nextaction;

    public EmailLogResponseDTO(Long emailId, String email, EmailStatus status, LocalDate date, String lead, String outcome, String nextaction) {
        this.emailId = emailId;
        this.email = email;
        this.status = status;
        this.date = date;
        Lead = lead;
        this.outcome = outcome;
        Nextaction = nextaction;
    }

    public Long getEmailId() {
        return emailId;
    }

    public void setEmailId(Long emailId) {
        this.emailId = emailId;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public EmailStatus getStatus() {
        return status;
    }

    public void setStatus(EmailStatus status) {
        this.status = status;
    }

    public LocalDate getDate() {
        return date;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }

    public String getLead() {
        return Lead;
    }

    public void setLead(String lead) {
        Lead = lead;
    }

    public String getOutcome() {
        return outcome;
    }

    public void setOutcome(String outcome) {
        this.outcome = outcome;
    }

    public String getNextaction() {
        return Nextaction;
    }

    public void setNextaction(String nextaction) {
        Nextaction = nextaction;
    }

    public EmailLogResponseDTO() {
    }


}
