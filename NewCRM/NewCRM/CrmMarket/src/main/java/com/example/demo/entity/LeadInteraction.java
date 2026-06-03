package com.example.demo.entity;

import com.example.demo.Configuration.TenantContext;
import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.Filter;

import java.time.LocalDateTime;

@Entity
@Data
//@Filter(name = "tenantFilter", condition = "profile_id = :profileId")
@Table(name = "lead_interactions")
//@EntityListeners(TenantEntityListener.class)
public class LeadInteraction  {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long interactionId;

    @ManyToOne
    @JoinColumn(name = "lead_id")
    private Lead lead;

    private String interactionType; // CALL, EMAIL, NOTE

    @Column(columnDefinition = "TEXT")
    private String notes;

    private LocalDateTime interactionDate = LocalDateTime.now();

	@PrePersist
	public void onCreate() {
		this.profileId = TenantContext.getCurrentTenant();
	}
	@Column(name = "profile_id", nullable = false)
	private String profileId;
	public LeadInteraction(Long interactionId, Lead lead, String interactionType, String notes,
			LocalDateTime interactionDate) {
		super();
		this.interactionId = interactionId;
		this.lead = lead;
		this.interactionType = interactionType;
		this.notes = notes;
		this.interactionDate = interactionDate;
	}

	public LeadInteraction() {
		super();
		// TODO Auto-generated constructor stub
	}

	public Long getInteractionId() {
		return interactionId;
	}

	public void setInteractionId(Long interactionId) {
		this.interactionId = interactionId;
	}

	public Lead getLead() {
		return lead;
	}

	public void setLead(Lead lead) {
		this.lead = lead;
	}

	public String getInteractionType() {
		return interactionType;
	}

	public void setInteractionType(String interactionType) {
		this.interactionType = interactionType;
	}

	public String getNotes() {
		return notes;
	}

	public void setNotes(String notes) {
		this.notes = notes;
	}

	public LocalDateTime getInteractionDate() {
		return interactionDate;
	}

	public void setInteractionDate(LocalDateTime interactionDate) {
		this.interactionDate = interactionDate;
	}
}
