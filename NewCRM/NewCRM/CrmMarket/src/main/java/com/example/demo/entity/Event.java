package com.example.demo.entity;

import com.example.demo.Configuration.TenantContext;
import com.example.demo.dto.EventStatus;
import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.Filter;

import java.time.LocalDate;
import java.time.LocalTime;

@Entity
@Table(name = "events")
@Data
//@EntityListeners(TenantEntityListener.class)
//
//@Filter(name = "tenantFilter", condition = "profile_id = :profileId")
public class Event {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long eventId;

    private LocalDate date;
    @JsonFormat(timezone = "HH:MM")
    private LocalTime time;

    private String type;   // Meeting / Demo / Call

    private String subject;

    @ManyToOne
    @JoinColumn(name = "contact_id")
    private Contact contact;

    @Enumerated(EnumType.STRING)
    private EventStatus status;


    @PrePersist
    public void onCreate() {
        this.profileId = TenantContext.getCurrentTenant();
    }
    @Column(name = "profile_id", nullable = false)
    private String profileId;
    public Event() {
    }

    public Long getEventId() {
        return eventId;
    }

    public void setEventId(Long eventId) {
        this.eventId = eventId;
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


    public Contact getContact() {
        return contact;
    }

    public void setContact(Contact contact) {
        this.contact = contact;
    }

    public EventStatus getStatus() {
        return status;
    }

    public void setStatus(EventStatus status) {
        this.status = status;
    }

    public Event(Long eventId, LocalDate date, LocalTime time, String type, String subject, Contact contact, EventStatus status) {
        this.eventId = eventId;
        this.date = date;
        this.time = time;
        this.type = type;
        this.subject = subject;
        this.contact = contact;
        this.status = status;
    }
}
