package com.example.demo.dto;

public class MessageTemplateDTO {

    private String templateName;
    private String channel;   // EMAIL / SMS
    private String content;

    public MessageTemplateDTO(String templateName, String channel, String content) {
        this.templateName = templateName;
        this.channel = channel;
        this.content = content;
    }


    public MessageTemplateDTO() {}


    public String getTemplateName() {
        return templateName;
    }

    public void setTemplateName(String templateName) {
        this.templateName = templateName;
    }

    public String getChannel() {
        return channel;
    }

    public void setChannel(String channel) {
        this.channel = channel;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }
}
