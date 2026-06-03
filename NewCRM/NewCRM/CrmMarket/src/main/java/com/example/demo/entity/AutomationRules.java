package com.example.demo.entity;

import com.example.demo.Configuration.TenantContext;
import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.Filter;

import java.time.LocalDateTime;

@Entity
@Data
@Table(name = "automation_new_rules")

//@EntityListeners(TenantEntityListener.class)
//
//@Filter(name = "tenantFilter", condition = "profile_id = :profileId")
public class AutomationRules  {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String objectType;   // LEAD, CONTACT, DEAL
    private String eventType;    // CREATED, UPDATED, STATUS_CHANGED

    @ManyToOne
    @JoinColumn(name = "template_id")
    private EmailTemplate template;
    @PrePersist
    public void onCreate() {
        this.profileId = TenantContext.getCurrentTenant();
    }
    @Column(name = "profile_id", nullable = false)
    private String profileId;
    private boolean enabled;

    public AutomationRules() {
    }

    public AutomationRules(Long id, String objectType, String eventType, EmailTemplate template, boolean enabled) {
        this.id = id;
        this.objectType = objectType;
        this.eventType = eventType;
        this.template = template;
        this.enabled = enabled;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getObjectType() {
        return objectType;
    }

    public void setObjectType(String objectType) {
        this.objectType = objectType;
    }

    public String getEventType() {
        return eventType;
    }

    public void setEventType(String eventType) {
        this.eventType = eventType;
    }

    public EmailTemplate getTemplate() {
        return template;
    }

    public void setTemplate(EmailTemplate template) {
        this.template = template;
    }

    public boolean isEnabled() {
        return enabled;
    }

    public void setEnabled(boolean enabled) {
        this.enabled = enabled;
    }
}
