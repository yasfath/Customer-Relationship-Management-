package com.example.demo.entity;

import com.example.demo.Configuration.TenantContext;
import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.Filter;

@Entity
@Table(name = "automation_rules")
@Data
//@EntityListeners(TenantEntityListener.class)
//@Filter(name = "tenantFilter", condition = "profile_id = :profileId")

public class AutomationRule {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String triggerEvent;
    // LEAD_CREATED, LEAD_HOT, CAMPAIGN_LAUNCHED

    private String channel;
    // EMAIL, SMS

    private String templateName;

    private Boolean active = true;
    @PrePersist
    public void onCreate() {
        this.profileId = TenantContext.getCurrentTenant();
    }
    @Column(name = "profile_id", nullable = false)
    private String profileId;

    public AutomationRule(Long id, String triggerEvent, String channel, String templateName, Boolean active) {
        this.id = id;
        this.triggerEvent = triggerEvent;
        this.channel = channel;
        this.templateName = templateName;
        this.active = active;
    }

    public AutomationRule() {}

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTriggerEvent() {
        return triggerEvent;
    }

    public void setTriggerEvent(String triggerEvent) {
        this.triggerEvent = triggerEvent;
    }

    public String getChannel() {
        return channel;
    }

    public void setChannel(String channel) {
        this.channel = channel;
    }

    public String getTemplateName() {
        return templateName;
    }

    public void setTemplateName(String templateName) {
        this.templateName = templateName;
    }

    public Boolean getActive() {
        return active;
    }

    public void setActive(Boolean active) {
        this.active = active;
    }
}
