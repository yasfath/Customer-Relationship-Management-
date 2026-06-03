package com.example.demo.dto;

import java.time.LocalDate;
import java.time.LocalTime;

public class EventRequestDTO {

    private LocalDate date;
    private LocalTime time;
    private String type;
    private String subject;
    private Long contactId;
    private EventStatus status;

    public EventRequestDTO() {
    }

    public LocalDate getDate() {
        return date;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }

    public LocalTime getTime() {
        return time;
    }

    public void setTime(LocalTime time) {
        this.time = time;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getSubject() {
        return subject;
    }

    public void setSubject(String subject) {
        this.subject = subject;
    }

    public Long getContactId() {
        return contactId;
    }

    public void setContactId(Long contactId) {
        this.contactId = contactId;
    }

    public EventStatus getStatus() {
        return status;
    }

    public void setStatus(EventStatus status) {
        this.status = status;
    }

    public EventRequestDTO(LocalDate date, LocalTime time, String type, String subject, Long contactId, EventStatus status) {
        this.date = date;
        this.time = time;
        this.type = type;
        this.subject = subject;
        this.contactId = contactId;
        this.status = status;
    }
}
