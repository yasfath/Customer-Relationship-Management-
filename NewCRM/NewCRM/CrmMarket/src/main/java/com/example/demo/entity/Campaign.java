package com.example.demo.entity;

import com.example.demo.Configuration.TenantContext;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.Filter;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "campaigns")
@AllArgsConstructor
@Data
//@EntityListeners(TenantEntityListener.class)
//
//@Filter(name = "tenantFilter", condition = "profile_id = :profileId")
public class Campaign  {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long campaignId;

    private String name;
    private String type;        // EMAIL, SMS, SOCIAL, EVENT
    private Double budget;
    private Double revenueGenerated;
    private LocalDate startDate;
    private LocalDate endDate;

    //
    private Integer leadsGenerated;

    private Double conversionRate;

    @Column(nullable = false)
    private String profileId;
    @PrePersist
    public void onCreate() {
        this.profileId = TenantContext.getCurrentTenant();
    }
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private CampaignStatus status;

    private Double roi;

    public Campaign(Long campaignId, String name, String type, Double budget, LocalDate startDate, LocalDate endDate, Integer leadsGenerated, Double conversionRate, CampaignStatus status) {
        this.campaignId = campaignId;
        this.name = name;
        this.type = type;
        this.budget = budget;
        this.startDate = startDate;
        this.endDate = endDate;
        this.leadsGenerated = leadsGenerated;
        this.conversionRate = conversionRate;
        this.status = status;
    }

    public Campaign() {

    }


    @OneToMany(
            mappedBy = "campaign",
            cascade = CascadeType.ALL,
            orphanRemoval = true
    )
    @JsonIgnore
    private List<Lead> leads = new ArrayList<>();

    public Long getCampaignId() {
        return campaignId;
    }

    public void setCampaignId(Long campaignId) {
        this.campaignId = campaignId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public Double getBudget() {
        return budget;
    }

    public void setBudget(Double budget) {
        this.budget = budget;
    }

    public LocalDate getStartDate() {
        return startDate;
    }

    public void setStartDate(LocalDate startDate) {
        this.startDate = startDate;
    }

    public LocalDate getEndDate() {
        return endDate;
    }

    public void setEndDate(LocalDate endDate) {
        this.endDate = endDate;
    }

    public Integer getLeadsGenerated() {
        return leadsGenerated;
    }

    public void setLeadsGenerated(Integer leadsGenerated) {
        this.leadsGenerated = leadsGenerated;
    }

    public Double getConversionRate() {
        return conversionRate;
    }

    public void setConversionRate(Double conversionRate) {
        this.conversionRate = conversionRate;
    }

    public CampaignStatus getStatus() {
        return status;
    }

    public void setStatus(CampaignStatus status) {
        this.status = status;
    }



    public Double getRoi() {
        return roi;
    }

    public void setRoi(Double roi) {
        this.roi = roi;
    }
}
