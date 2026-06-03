package com.example.demo.entity;
import com.example.demo.Configuration.TenantContext;
import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;
import org.hibernate.annotations.Filter;
import org.hibernate.annotations.FilterDef;
import org.hibernate.annotations.ParamDef;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "leads")
@ToString(exclude = "notifications")
public class Lead {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long leadId;

    @OneToOne(cascade = CascadeType.PERSIST)
    @JoinColumn(name = "contact_id")
    private Contact contact;

    // MULTI TENANT FIELD
    @Column(nullable = false)
    private String profileId;

    @Enumerated(EnumType.STRING)
    private LeadStatus status;

    private String assignedTo; // SALES_TEAM / NURTURE
    @JsonFormat(pattern = "HH:mm")
    private LocalDateTime createdAt = LocalDateTime.now();

    // 🔮 FUTURE SCOPE 3 (ADD ONLY)
    private Integer leadScore;        // 0 - 100
    private String segment;           // HOT / WARM / COLD
    private Boolean automationEnabled;

    @ManyToOne
    @JoinColumn(name = "campaign_id")
    private Campaign campaign;

    @PrePersist
    public void onCreate() {
        this.profileId = TenantContext.getCurrentTenant();
    }

    @OneToMany(mappedBy = "lead", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Notification> notifications = new ArrayList<>();


    public Lead(Long leadId, Contact contact, LeadStatus status, String assignedTo, LocalDateTime createdAt, Integer leadScore, String segment, Boolean automationEnabled) {
        this.leadId = leadId;
        this.contact = contact;
        this.status = status;
        this.assignedTo = assignedTo;
        this.createdAt = createdAt;
        this.leadScore = leadScore;
        this.segment = segment;
        this.automationEnabled = automationEnabled;
    }

    public Lead(Long leadId, Contact contact, String profileId, LeadStatus status, String assignedTo, LocalDateTime createdAt, Integer leadScore, String segment, Boolean automationEnabled, Campaign campaign, List<Notification> notifications) {
        this.leadId = leadId;
        this.contact = contact;
        this.profileId = profileId;
        this.status = status;
        this.assignedTo = assignedTo;
        this.createdAt = createdAt;
        this.leadScore = leadScore;
        this.segment = segment;
        this.automationEnabled = automationEnabled;
        this.campaign = campaign;
        this.notifications = notifications;
    }

    public Lead() {

    }

    public Long getLeadId() {
        return leadId;
    }

    public void setLeadId(Long leadId) {
        this.leadId = leadId;
    }

    public Contact getContact() {
        return contact;
    }

    public void setContact(Contact contact) {
        this.contact = contact;
    }

    public String getProfileId() {
        return profileId;
    }

    public void setProfileId(String profileId) {
        this.profileId = profileId;
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

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
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

    public Campaign getCampaign() {
        return campaign;
    }

    public void setCampaign(Campaign campaign) {
        this.campaign = campaign;
    }

    public List<Notification> getNotifications() {
        return notifications;
    }

    public void setNotifications(List<Notification> notifications) {
        this.notifications = notifications;
    }
}
