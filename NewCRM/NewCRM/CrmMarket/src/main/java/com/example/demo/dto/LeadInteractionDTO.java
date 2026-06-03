package com.example.demo.dto;

import java.time.LocalDateTime;

public class LeadInteractionDTO {

    private String interactionType;
    // CALL / EMAIL / SMS

    private String notes;
    private LocalDateTime interactionDate;

    // 🔮 FUTURE SCOPE 1 (NO ENTITY IMPACT)
    private String channel;        // EMAIL / SMS
    private String deliveryStatus; // SENT / FAILED / SCHEDULED

    public String getInteractionType() {
        return interactionType;
    }

    public void setInteractionType(String interactionType) {
        this.interactionType = interactionType;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }

    public LocalDateTime getInteractionDate() {
        return interactionDate;
    }

    public void setInteractionDate(LocalDateTime interactionDate) {
        this.interactionDate = interactionDate;
    }

    public String getChannel() {
        return channel;
    }

    public void setChannel(String channel) {
        this.channel = channel;
    }

    public String getDeliveryStatus() {
        return deliveryStatus;
    }

    public void setDeliveryStatus(String deliveryStatus) {
        this.deliveryStatus = deliveryStatus;
    }
}
