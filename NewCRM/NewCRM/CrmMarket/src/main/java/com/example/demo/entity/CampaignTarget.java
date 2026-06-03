package com.example.demo.entity;

import com.example.demo.Configuration.TenantContext;
import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.Filter;

@Entity
@Table(name = "campaign_targets")
@Data
//@EntityListeners(TenantEntityListener.class)
//@Filter(name = "tenantFilter", condition = "profile_id = :profileId")
public class CampaignTarget  {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "campaign_id")
    private Campaign campaign;

    @ManyToOne
    @JoinColumn(name = "segment_id")
    private Segment segment;

	public CampaignTarget(Long id, Campaign campaign, Segment segment) {
		super();
		this.id = id;
		this.campaign = campaign;
		this.segment = segment;
	}

	public CampaignTarget() {
		super();
		// TODO Auto-generated constructor stub
	}
	@PrePersist
	public void onCreate() {
		this.profileId = TenantContext.getCurrentTenant();
	}
	@Column(name = "profile_id", nullable = false)
	private String profileId;
	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public Campaign getCampaign() {
		return campaign;
	}

	public void setCampaign(Campaign campaign) {
		this.campaign = campaign;
	}

	public Segment getSegment() {
		return segment;
	}

	public void setSegment(Segment segment) {
		this.segment = segment;
	}
}
