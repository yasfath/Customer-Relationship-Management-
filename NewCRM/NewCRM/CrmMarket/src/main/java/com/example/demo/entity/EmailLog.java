package com.example.demo.entity;

import com.example.demo.Configuration.TenantContext;
import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.Filter;

import java.time.LocalDateTime;

@Entity
@Table(name = "email_logs")
@Data
//@EntityListeners(TenantEntityListener.class)
//
//@Filter(name = "tenantFilter", condition = "profile_id = :profileId")
public class EmailLog  {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long emailId;

    private String email;

    private String channel;

    @Column(columnDefinition = "TEXT")
    private String message;

    //
    private String outcome;

    @Column(columnDefinition = "TEXT")
    private String nextAction;

    @ManyToOne
    @JoinColumn(name = "contact_id")
    private Contact contact;

    @ManyToOne
    @JoinColumn(name = "campaign_id")
    private Campaign campaign;

    @Enumerated(EnumType.STRING)
    private EmailStatus status;

    private Boolean opened = false;
    private Boolean clicked = false;

    @Column(columnDefinition = "TEXT")
    private String errorMessage;

    private LocalDateTime sentAt = LocalDateTime.now();

    private Integer retryCount = 0;

    @PrePersist
    public void onCreate() {
        this.profileId = TenantContext.getCurrentTenant();
    }
    @Column(name = "profile_id", nullable = false)
    private String profileId;

    public EmailLog() {}

    // ===== GETTERS & SETTERS =====

    public Long getEmailId() { return emailId; }
    public void setEmailId(Long emailId) { this.emailId = emailId; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getChannel() { return channel; }
    public void setChannel(String channel) { this.channel = channel; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public String getOutcome() { return outcome; }
    public void setOutcome(String outcome) { this.outcome = outcome; }

    public String getNextAction() { return nextAction; }
    public void setNextAction(String nextAction) { this.nextAction = nextAction; }

    public Contact getContact() { return contact; }
    public void setContact(Contact contact) { this.contact = contact; }

    public Campaign getCampaign() { return campaign; }
    public void setCampaign(Campaign campaign) { this.campaign = campaign; }

    public EmailStatus getStatus() { return status; }
    public void setStatus(EmailStatus status) { this.status = status; }

    public Boolean getOpened() { return opened; }
    public void setOpened(Boolean opened) { this.opened = opened; }

    public Boolean getClicked() { return clicked; }
    public void setClicked(Boolean clicked) { this.clicked = clicked; }

    public String getErrorMessage() { return errorMessage; }
    public void setErrorMessage(String errorMessage) { this.errorMessage = errorMessage; }

    public LocalDateTime getSentAt() { return sentAt; }
    public void setSentAt(LocalDateTime sentAt) { this.sentAt = sentAt; }

    public Integer getRetryCount() { return retryCount; }
    public void setRetryCount(Integer retryCount) { this.retryCount = retryCount; }
}