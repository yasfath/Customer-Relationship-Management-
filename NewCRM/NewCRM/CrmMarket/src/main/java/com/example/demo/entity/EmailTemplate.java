package com.example.demo.entity;

import com.example.demo.Configuration.TenantContext;
import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.Filter;

import java.time.LocalDateTime;

@Entity
@Table(name = "email_templates")
@Data
//@EntityListeners(TenantEntityListener.class)
//
//@Filter(name = "tenantFilter", condition = "profile_id = :profileId")
public class EmailTemplate {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long templateId;

    @Column(nullable = false, unique = true)
    private String name;

    @Column(nullable = false)
    private String subject;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String body;

    // 🔹 Template status (ACTIVE / INACTIVE)
    private Boolean active = true;

    // 🔹 Audit fields
    private LocalDateTime createdAt = LocalDateTime.now();
    private LocalDateTime updatedAt;
    @PrePersist
    public void onCreate() {
        this.profileId = TenantContext.getCurrentTenant();
    }
    @Column(name = "profile_id", nullable = false)
    private String profileId;
    // ---------- Constructors ----------

    public EmailTemplate() {
    }

    public EmailTemplate(Long templateId, String name, String subject, String body) {
        this.templateId = templateId;
        this.name = name;
        this.subject = subject;
        this.body = body;
    }

    // ---------- Getters & Setters ----------

    public Long getTemplateId() {
        return templateId;
    }

    public void setTemplateId(Long templateId) {
        this.templateId = templateId;
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

    public Boolean getActive() {
        return active;
    }

    public void setActive(Boolean active) {
        this.active = active;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}
