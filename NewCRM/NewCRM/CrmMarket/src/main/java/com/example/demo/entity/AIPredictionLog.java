package com.example.demo.entity;

import com.example.demo.Configuration.TenantContext;
import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.Filter;

import java.time.LocalDateTime;

@Entity
@Table(name = "ai_prediction_log")
@Data
//@Filter(name = "tenantFilter", condition = "profile_id = :profileId")
//@EntityListeners(TenantEntityListener.class)
public class AIPredictionLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long leadId;
    private int leadScore;
    private double conversionProbability;
    private String recommendation;

    private LocalDateTime createdAt;

    public AIPredictionLog() {

    }
    @PrePersist
    public void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.profileId = TenantContext.getCurrentTenant();
    }
    @Column(name = "profile_id", nullable = false)
    private String profileId;


    public AIPredictionLog(Long id, Long leadId, int leadScore, double conversionProbability, String recommendation, LocalDateTime createdAt) {
        this.id = id;
        this.leadId = leadId;
        this.leadScore = leadScore;
        this.conversionProbability = conversionProbability;
        this.recommendation = recommendation;
        this.createdAt = createdAt;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getLeadId() {
        return leadId;
    }

    public void setLeadId(Long leadId) {
        this.leadId = leadId;
    }

    public int getLeadScore() {
        return leadScore;
    }

    public void setLeadScore(int leadScore) {
        this.leadScore = leadScore;
    }

    public double getConversionProbability() {
        return conversionProbability;
    }

    public void setConversionProbability(double conversionProbability) {
        this.conversionProbability = conversionProbability;
    }

    public String getRecommendation() {
        return recommendation;
    }

    public void setRecommendation(String recommendation) {
        this.recommendation = recommendation;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
