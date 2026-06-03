package com.example.demo.dto;

public class DashboardStatsDTO {

    private Long totalLeads;
    private Long newLeads;
    private Long qualifiedLeads;
    private Long totalCampaigns;
    private Double totalRevenue;

    public DashboardStatsDTO() {}

    public DashboardStatsDTO(Long totalLeads,
                             Long newLeads,
                             Long qualifiedLeads,
                             Long totalCampaigns,
                             Double totalRevenue) {
        this.totalLeads = totalLeads;
        this.newLeads = newLeads;
        this.qualifiedLeads = qualifiedLeads;
        this.totalCampaigns = totalCampaigns;
        this.totalRevenue = totalRevenue;
    }

    public Long getTotalLeads() {
        return totalLeads;
    }

    public void setTotalLeads(Long totalLeads) {
        this.totalLeads = totalLeads;
    }

    public Long getNewLeads() {
        return newLeads;
    }

    public void setNewLeads(Long newLeads) {
        this.newLeads = newLeads;
    }

    public Long getQualifiedLeads() {
        return qualifiedLeads;
    }

    public void setQualifiedLeads(Long qualifiedLeads) {
        this.qualifiedLeads = qualifiedLeads;
    }

    public Long getTotalCampaigns() {
        return totalCampaigns;
    }

    public void setTotalCampaigns(Long totalCampaigns) {
        this.totalCampaigns = totalCampaigns;
    }

    public Double getTotalRevenue() {
        return totalRevenue;
    }

    public void setTotalRevenue(Double totalRevenue) {
        this.totalRevenue = totalRevenue;
    }
}
