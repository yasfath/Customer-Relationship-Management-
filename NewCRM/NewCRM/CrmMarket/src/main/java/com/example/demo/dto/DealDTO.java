package com.example.demo.dto;

import com.example.demo.entity.DealStage;

import java.time.LocalDate;

public class DealDTO {
    private Long id;
    private String dealName;
    private Double amount;
    private DealStage stage;
    private LocalDate closeDate;
    private Long leadId;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public DealDTO(Long id, String dealName, Double amount, DealStage stage, LocalDate closeDate, Long leadId) {
        this.id = id;
        this.dealName = dealName;
        this.amount = amount;
        this.stage = stage;
        this.closeDate = closeDate;
        this.leadId = leadId;
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

    public Long getLeadId() {
        return leadId;
    }

    public void setLeadId(Long leadId) {
        this.leadId = leadId;
    }
}
