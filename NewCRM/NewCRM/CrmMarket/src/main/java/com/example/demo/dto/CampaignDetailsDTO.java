package com.example.demo.dto;

import com.example.demo.entity.CampaignStatus;
import lombok.Data;

import java.time.LocalDate;

@Data
public class CampaignDetailsDTO {

    private Long id;

    private String name;
    private String type;
    private CampaignStatus status;
    private Double budget;
    private LocalDate startDate;
    private LocalDate endDate;
    private String leads_generated;
    private ROIResponseDTO roiResponse;
    private Double conversionRate;
    private Double revenueGenerated;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getLeads_generated() {
        return leads_generated;
    }

    public void setLeads_generated(String leads_generated) {
        this.leads_generated = leads_generated;
    }

    public CampaignDetailsDTO(Long id, String name, String type, CampaignStatus status, Double budget, LocalDate startDate, LocalDate endDate) {
        this.id = id;
        this.name = name;
        this.type = type;
        this.status = status;
        this.budget = budget;
        this.startDate = startDate;
        this.endDate = endDate;
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

    public CampaignStatus getStatus() {
        return status;
    }

    public void setStatus(CampaignStatus status) {
        this.status = status;
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

    public CampaignDetailsDTO() {
    }

    public ROIResponseDTO getRoiResponse() {
        return roiResponse;
    }

    public void setRoiResponse(ROIResponseDTO roiResponse) {
        this.roiResponse = roiResponse;
    }

    public Double getConversionRate() {
        return conversionRate;
    }

    public void setConversionRate(Double conversionRate) {
        this.conversionRate = conversionRate;
    }
}
