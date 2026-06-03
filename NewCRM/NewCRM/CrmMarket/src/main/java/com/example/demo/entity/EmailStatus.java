package com.example.demo.entity;

public enum EmailStatus {

    PENDING,        // Email created but not yet sent
    SENT,           // Successfully sent
    OPENED,         // User opened email
    CLICKED,        // User clicked a link
    BOUNCED,        // Email bounced
    FAILED,         // Sending failed (SMTP error, etc.)
    UNSUBSCRIBED    // User unsubscribed
}
