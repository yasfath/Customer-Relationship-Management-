package com.example.demo.entity;

import com.example.demo.Configuration.TenantContext;
import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.Filter;

import java.time.LocalDate;

@Entity
@Table(name = "deals")
@Data
//@EntityListeners(TenantEntityListener.class)
//@Filter(name = "tenantFilter", condition = "profile_id = :profileId")
public class Deal {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long dealId;

    private String dealName;

    private Double amount;

    @Enumerated(EnumType.STRING)
    private DealStage stage;

    private LocalDate closeDate;
    @PrePersist
    public void onCreate() {
        this.profileId = TenantContext.getCurrentTenant();
    }
    @Column(name = "profile_id", nullable = false)
    private String profileId;
    @ManyToOne
    @JoinColumn(name = "lead_id")
    private Lead lead;

    public Deal() {}

    public Deal(String dealName, Double amount, DealStage stage, LocalDate closeDate, Lead lead) {
        this.dealName = dealName;
        this.amount = amount;
        this.stage = stage;
        this.closeDate = closeDate;
        this.lead = lead;
    }

    public Long getDealId() {
        return dealId;
    }

    public String getDealName() {
        return dealName;
    }

    public void setDealName(String dealName) {
        this.dealName = dealName;
    }

    public Double getAmount() {
        return amount;
    }

    public void setAmount(Double amount) {
        this.amount = amount;
    }

    public DealStage getStage() {
        return stage;
    }

    public void setStage(DealStage stage) {
        this.stage = stage;
    }

    public LocalDate getCloseDate() {
        return closeDate;
    }

    public void setCloseDate(LocalDate closeDate) {
        this.closeDate = closeDate;
    }

    public Lead getLead() {
        return lead;
    }

    public void setLead(Lead lead) {
        this.lead = lead;
    }
}
