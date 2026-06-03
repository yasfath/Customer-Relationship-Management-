package com.example.demo.dto;

import jakarta.validation.constraints.NotNull;

public class EmailSendRequestDTO {

    @NotNull(message = "Contact ID is required")
    private Long contactId;

    @NotNull(message = "Template ID is required")
    private Long templateId;

    // Optional – email can be sent without campaign
    private Long campaignId;

    private String outcome;
    private String nextAction;

    public EmailSendRequestDTO(Long contactId, Long templateId, Long campaignId, String outcome, String nextAction) {
        this.contactId = contactId;
        this.templateId = templateId;
        this.campaignId = campaignId;
        this.outcome = outcome;
        this.nextAction = nextAction;
    }

    public String getOutcome() {
        return outcome;
    }

    public void setOutcome(String outcome) {
        this.outcome = outcome;
    }

    public String getNextAction() {
        return nextAction;
    }

    public void setNextAction(String nextAction) {
        this.nextAction = nextAction;
    }

    public EmailSendRequestDTO() {
    }


    public Long getContactId() {
        return contactId;
    }

    public void setContactId(Long contactId) {
        this.contactId = contactId;
    }

    public Long getTemplateId() {
        return templateId;
    }

    public void setTemplateId(Long templateId) {
        this.templateId = templateId;
    }

    public Long getCampaignId() {
        return campaignId;
    }

    public void setCampaignId(Long campaignId) {
        this.campaignId = campaignId;
    }
}
