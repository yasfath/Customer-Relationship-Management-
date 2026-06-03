package com.example.demo.dto;


public class LeadStatsDTO {
    private long totalLeads;
    private long newLeads;
    private long convertedLeads;
    private long lostLeads;


    // 🔮 FUTURE SCOPE 6 (derived analytics)
    private long salesAssignedLeads;
    private long nurtureAssignedLeads;

    public LeadStatsDTO() {}

    public LeadStatsDTO(long totalLeads, long newLeads, long convertedLeads, long lostLeads, long salesAssignedLeads, long nurtureAssignedLeads) {
        this.totalLeads = totalLeads;
        this.newLeads = newLeads;
        this.convertedLeads = convertedLeads;
        this.lostLeads = lostLeads;
        this.salesAssignedLeads = salesAssignedLeads;
        this.nurtureAssignedLeads = nurtureAssignedLeads;
    }

    public long getTotalLeads() {
        return totalLeads;
    }

    public void setTotalLeads(long totalLeads) {
        this.totalLeads = totalLeads;
    }

    public long getNewLeads() {
        return newLeads;
    }

    public void setNewLeads(long newLeads) {
        this.newLeads = newLeads;
    }

    public long getConvertedLeads() {
        return convertedLeads;
    }

    public void setConvertedLeads(long convertedLeads) {
        this.convertedLeads = convertedLeads;
    }

    public long getLostLeads() {
        return lostLeads;
    }

    public void setLostLeads(long lostLeads) {
        this.lostLeads = lostLeads;
    }

    public long getSalesAssignedLeads() {
        return salesAssignedLeads;
    }

    public void setSalesAssignedLeads(long salesAssignedLeads) {
        this.salesAssignedLeads = salesAssignedLeads;
    }

    public long getNurtureAssignedLeads() {
        return nurtureAssignedLeads;
    }

    public void setNurtureAssignedLeads(long nurtureAssignedLeads) {
        this.nurtureAssignedLeads = nurtureAssignedLeads;
    }
}
