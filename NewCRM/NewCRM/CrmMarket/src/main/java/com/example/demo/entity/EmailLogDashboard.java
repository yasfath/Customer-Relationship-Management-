package com.example.demo.entity;

import com.example.demo.Configuration.TenantContext;
import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.Filter;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Entity
@Table(name = "email_log_dashboard")
@Data
//@Filter(name = "tenantFilter", condition = "profile_id = :profileId")
//@EntityListeners(TenantEntityListener.class)
public class EmailLogDashboard {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long logId;

    private String outcome;
    private String notes;

    private String nextAction;

    private String activityType;

    private String nextActionType;
    private LocalDate nextActionDate;
    private LocalTime nextActionTime;

    private String status;

    @ManyToOne
    private Lead lead;

    private String personName;
    @PrePersist
    public void onCreate() {
        this.profileId = TenantContext.getCurrentTenant();
    }
    @Column(name = "profile_id", nullable = false)
    private String profileId;
    @ManyToOne
    private Contact contact;

    private LocalDateTime createdAt = LocalDateTime.now();

    public EmailLogDashboard() {}

    // getters & setters

    public Long getLogId() {
        return logId;
    }

    public void setLogId(Long logId) {
        this.logId = logId;
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

    public String getNextAction() {
        return nextAction;
    }

    public void setNextAction(String nextAction) {
        this.nextAction = nextAction;
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

    public Lead getLead() {
        return lead;
    }

    public void setLead(Lead lead) {
        this.lead = lead;
    }

    public String getPersonName() {
        return personName;
    }

    public void setPersonName(String personName) {
        this.personName = personName;
    }

    public Contact getContact() {
        return contact;
    }

    public void setContact(Contact contact) {
        this.contact = contact;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}