package com.example.demo.dto;

public class ContactStatsDTO {
    private Long totalContacts;
    private Long contactsWithActivities;
    private Long linkedLeads;
    private Long recentlyAdded;

    public ContactStatsDTO() {
    }

    public ContactStatsDTO(Long totalContacts, Long contactsWithActivities, Long linkedLeads, Long recentlyAdded) {
        this.totalContacts = totalContacts;
        this.contactsWithActivities = contactsWithActivities;
        this.linkedLeads = linkedLeads;
        this.recentlyAdded = recentlyAdded;
    }

    public Long getTotalContacts() {
        return totalContacts;
    }

    public void setTotalContacts(Long totalContacts) {
        this.totalContacts = totalContacts;
    }

    public Long getContactsWithActivities() {
        return contactsWithActivities;
    }

    public void setContactsWithActivities(Long contactsWithActivities) {
        this.contactsWithActivities = contactsWithActivities;
    }

    public Long getLinkedLeads() {
        return linkedLeads;
    }

    public void setLinkedLeads(Long linkedLeads) {
        this.linkedLeads = linkedLeads;
    }

    public Long getRecentlyAdded() {
        return recentlyAdded;
    }

    public void setRecentlyAdded(Long recentlyAdded) {
        this.recentlyAdded = recentlyAdded;
    }
}
