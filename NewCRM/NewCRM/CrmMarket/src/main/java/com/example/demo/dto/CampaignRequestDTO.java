package com.example.demo.dto;

import lombok.Data;

import java.time.LocalDate;


public class CampaignRequestDTO {

    private String name;
    private String type;
    private Double budget;
    private LocalDate startDate;
    private LocalDate endDate;
    private String status;
    private Integer leadsGenerated;
    private Double revenueGenerated;

    public CampaignRequestDTO() {
    }

    public String getName() {
        return name;
    }

    public Double getRevenueGenerated() {
        return revenueGenerated;
    }

    public void setRevenueGenerated(Double revenueGenerated) {
        this.revenueGenerated = revenueGenerated;
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

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Integer getLeadsGenerated() {
        return leadsGenerated;
    }

    public void setLeadsGenerated(Integer leadsGenerated) {
        this.leadsGenerated = leadsGenerated;
    }
}