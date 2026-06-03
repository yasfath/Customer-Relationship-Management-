package com.example.demo.entity;

import com.example.demo.Configuration.TenantContext;
import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.Filter;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Entity
@Table(name = "activities")
@Data
//@Filter(name = "tenantFilter", condition = "profile_id = :profileId")
//@EntityListeners(TenantEntityListener.class)
public class Activity{

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long activityId;

    private String activityType;   // CALL, EMAIL, MEETING

    private LocalDate activityDate;
    private LocalTime activityTime;

    private Integer duration; // minutes

    private String description;

    @ManyToOne
    @JoinColumn(name = "lead_id")
    private Lead lead;

    @Enumerated(EnumType.STRING)
    private ActivityStatus status = ActivityStatus.PENDING;

    @ManyToOne
    @JoinColumn(name = "contact_id")
    private Contact contact;
    @PrePersist
    public void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.profileId = TenantContext.getCurrentTenant();
    }
    @Column(name = "profile_id", nullable = false)
    private String profileId;
    private LocalDateTime createdAt = LocalDateTime.now();

    public Activity() {
    }

    public Long getActivityId() {
        return activityId;
    }

    public void setActivityId(Long activityId) {
        this.activityId = activityId;
    }

    public String getActivityType() {
        return activityType;
    }

    public void setActivityType(String activityType) {
        this.activityType = activityType;
    }

    public LocalDate getActivityDate() {
        return activityDate;
    }

    public void setActivityDate(LocalDate activityDate) {
        this.activityDate = activityDate;
    }

    public LocalTime getActivityTime() {
        return activityTime;
    }

    public void setActivityTime(LocalTime activityTime) {
        this.activityTime = activityTime;
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

    public Lead getLead() {
        return lead;
    }

    public void setLead(Lead lead) {
        this.lead = lead;
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

    public Activity(Long activityId, String activityType, LocalDate activityDate, LocalTime activityTime, Integer duration, String description, Lead lead, Contact contact, LocalDateTime createdAt) {
        this.activityId = activityId;
        this.activityType = activityType;
        this.activityDate = activityDate;
        this.activityTime = activityTime;
        this.duration = duration;
        this.description = description;
        this.lead = lead;
        this.contact = contact;
        this.createdAt = createdAt;
    }
}

