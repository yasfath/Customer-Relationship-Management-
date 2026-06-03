package com.example.demo.dto;

import java.time.LocalDate;
import java.time.LocalTime;

public class EventResponseDTO {

    private Long id;
    private LocalDate date;
    private LocalTime time;
    private String type;
    private String subject;
    private EventStatus status;


    // Full contact info
    private Long contactId;
    private String contactName;
    private String email;
    private String phone;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
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



    public EventStatus getStatus() {
        return status;
    }

    public void setStatus(EventStatus status) {
        this.status = status;
    }

    public Long getContactId() {
        return contactId;
    }

    public void setContactId(Long contactId) {
        this.contactId = contactId;
    }

    public String getContactName() {
        return contactName;
    }

    public void setContactName(String contactName) {
        this.contactName = contactName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public EventResponseDTO() {
    }

    public EventResponseDTO(Long id, LocalDate date, LocalTime time, String type, String subject, EventStatus status, Long contactId, String contactName, String email, String phone) {
        this.id = id;
        this.date = date;
        this.time = time;
        this.type = type;
        this.subject = subject;
        this.status = status;
        this.contactId = contactId;
        this.contactName = contactName;
        this.email = email;
        this.phone = phone;
    }
}
