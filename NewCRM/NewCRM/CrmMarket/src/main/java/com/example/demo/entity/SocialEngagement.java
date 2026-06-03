package com.example.demo.entity;

import com.example.demo.Configuration.TenantContext;
import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.Filter;

import java.time.LocalDateTime;

@Entity
@Table(name = "social_engagements")
@Data
public class SocialEngagement  {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long engagementId;

    @ManyToOne
    @JoinColumn(name = "post_id")
    private SocialPost post;

    @ManyToOne
    @JoinColumn(name = "contact_id")
    private Contact contact;

    @Enumerated(EnumType.STRING)
    private SocialEngagementType engagementType;

	@Column(name = "profile_id", nullable = false)
	private String profileId;

	@PrePersist
	public void prePersist() {
		this.profileId = TenantContext.getCurrentTenant();
	}
    private LocalDateTime engagedAt = LocalDateTime.now();

	public SocialEngagement(Long engagementId, SocialPost post, Contact contact, SocialEngagementType engagementType,
			LocalDateTime engagedAt) {
		super();
		this.engagementId = engagementId;
		this.post = post;
		this.contact = contact;
		this.engagementType = engagementType;
		this.engagedAt = engagedAt;
	}

	public SocialEngagement() {
		super();
		// TODO Auto-generated constructor stub
	}

	public Long getEngagementId() {
		return engagementId;
	}

	public void setEngagementId(Long engagementId) {
		this.engagementId = engagementId;
	}

	public SocialPost getPost() {
		return post;
	}

	public void setPost(SocialPost post) {
		this.post = post;
	}

	public Contact getContact() {
		return contact;
	}

	public void setContact(Contact contact) {
		this.contact = contact;
	}

	public SocialEngagementType getEngagementType() {
		return engagementType;
	}

	public void setEngagementType(SocialEngagementType engagementType) {
		this.engagementType = engagementType;
	}

	public LocalDateTime getEngagedAt() {
		return engagedAt;
	}

	public void setEngagedAt(LocalDateTime engagedAt) {
		this.engagedAt = engagedAt;
	}

}
