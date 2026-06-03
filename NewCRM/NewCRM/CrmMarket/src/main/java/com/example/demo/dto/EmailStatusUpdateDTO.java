package com.example.demo.dto;

import com.example.demo.entity.EmailStatus;

public class EmailStatusUpdateDTO {

    private EmailStatus status;

    public EmailStatus getStatus() {
        return status;
    }

    public void setStatus(EmailStatus status) {
        this.status = status;
    }
}