package com.example.demo.entity;

import com.example.demo.Configuration.TenantContext;
import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.Filter;

import java.time.LocalDateTime;

@Entity
@Table(name = "roi_report")
@Data
//@Filter(name = "tenantFilter", condition = "profile_id = :profileId")
//@EntityListeners(TenantEntityListener.class)
public class ROIReport  {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long campaignId;
    private double campaignCost;
    private double revenueGenerated;
    private double roiPercentage;
    private LocalDateTime createdAt;

    public ROIReport() {

    }
    @PrePersist
    public void onCreate() {
        this.profileId = TenantContext.getCurrentTenant();

        createdAt = LocalDateTime.now();
    }
    @Column(name = "profile_id", nullable = false)
    private String profileId;


    public ROIReport(Long id, Long campaignId, double campaignCost, double revenueGenerated, double roiPercentage, LocalDateTime createdAt) {
        this.id = id;
        this.campaignId = campaignId;
        this.campaignCost = campaignCost;
        this.revenueGenerated = revenueGenerated;
        this.roiPercentage = roiPercentage;
        this.createdAt = createdAt;
    }


    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getCampaignId() {
        return campaignId;
    }

    public void setCampaignId(Long campaignId) {
        this.campaignId = campaignId;
    }

    public double getCampaignCost() {
        return campaignCost;
    }

    public void setCampaignCost(double campaignCost) {
        this.campaignCost = campaignCost;
    }

    public double getRevenueGenerated() {
        return revenueGenerated;
    }

    public void setRevenueGenerated(double revenueGenerated) {
        this.revenueGenerated = revenueGenerated;
    }

    public double getRoiPercentage() {
        return roiPercentage;
    }

    public void setRoiPercentage(double roiPercentage) {
        this.roiPercentage = roiPercentage;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
