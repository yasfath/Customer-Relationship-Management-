package com.example.demo.dto;

import jakarta.validation.constraints.NotBlank;

public class EmailTemplateRequestDTO {

    @NotBlank(message = "Template name is required")
    private String name;

    @NotBlank(message = "Email subject is required")
    private String subject;

    @NotBlank(message = "Email body is required")
    private String body;

    public EmailTemplateRequestDTO() {
    }

    public EmailTemplateRequestDTO(String name, String subject, String body) {
        this.name = name;
        this.subject = subject;
        this.body = body;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getSubject() {
        return subject;
    }

    public void setSubject(String subject) {
        this.subject = subject;
    }

    public String getBody() {
        return body;
    }

    public void setBody(String body) {
        this.body = body;
    }
}
