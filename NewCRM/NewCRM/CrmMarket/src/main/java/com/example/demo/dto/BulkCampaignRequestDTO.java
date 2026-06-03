package com.example.demo.dto;

public class BulkCampaignRequestDTO {

    private String channel;   // EMAIL / SMS
    private String subject;   // Email only
    private String message;   // Email/SMS content

    private String target;
    // ALL / SALES_TEAM / NURTURE / NEW / CONVERTED

    private String templateName;


    public BulkCampaignRequestDTO() {}

    public BulkCampaignRequestDTO(String channel, String subject, String message, String target, String templateName) {
        this.channel = channel;
        this.subject = subject;
        this.message = message;
        this.target = target;
        this.templateName = templateName;
    }


    public String getChannel() {
        return channel;
    }

    public void setChannel(String channel) {
        this.channel = channel;
    }

    public String getSubject() {
        return subject;
    }

    public void setSubject(String subject) {
        this.subject = subject;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getTarget() {
        return target;
    }

    public void setTarget(String target) {
        this.target = target;
    }

    public String getTemplateName() {
        return templateName;
    }

    public void setTemplateName(String templateName) {
        this.templateName = templateName;
    }
}
