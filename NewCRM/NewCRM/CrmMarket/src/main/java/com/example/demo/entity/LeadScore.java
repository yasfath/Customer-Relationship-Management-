package com.example.demo.entity;

import com.example.demo.Configuration.TenantContext;
import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.Filter;

import java.time.LocalDateTime;

@Entity
@Table(name = "lead_scores")
@Data
//@Filter(name = "tenantFilter", condition = "profile_id = :profileId")
//@EntityListeners(TenantEntityListener.class)
public class LeadScore  {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long scoreId;

    @OneToOne
    @JoinColumn(name = "lead_id")
    private Lead lead;

    private Integer score;

    private Boolean mql; // Marketing Qualified Lead

    private LocalDateTime lastUpdated = LocalDateTime.now();
	@PrePersist
	public void onCreate() {
		this.profileId = TenantContext.getCurrentTenant();
	}
	@Column(name = "profile_id", nullable = false)
	private String profileId;
	public LeadScore(Long scoreId, Lead lead, Integer score, Boolean mql, LocalDateTime lastUpdated) {
		super();
		this.scoreId = scoreId;
		this.lead = lead;
		this.score = score;
		this.mql = mql;
		this.lastUpdated = lastUpdated;
	}

	public LeadScore() {
		super();
		// TODO Auto-generated constructor stub
	}

	public Long getScoreId() {
		return scoreId;
	}

	public void setScoreId(Long scoreId) {
		this.scoreId = scoreId;
	}

	public Lead getLead() {
		return lead;
	}

	public void setLead(Lead lead) {
		this.lead = lead;
	}

	public Integer getScore() {
		return score;
	}

	public void setScore(Integer score) {
		this.score = score;
	}

	public Boolean getMql() {
		return mql;
	}

	public void setMql(Boolean mql) {
		this.mql = mql;
	}

	public LocalDateTime getLastUpdated() {
		return lastUpdated;
	}

	public void setLastUpdated(LocalDateTime lastUpdated) {
		this.lastUpdated = lastUpdated;
	}    
}
