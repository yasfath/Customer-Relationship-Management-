package com.example.demo.entity;

import com.example.demo.Configuration.TenantContext;
import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.Filter;

import java.time.LocalDateTime;

@Entity
@Table(name = "social_posts")
@Data
//@Filter(name = "tenantFilter", condition = "profile_id = :profileId")
//@EntityListeners(TenantEntityListener.class)
public class SocialPost  {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long postId;

    @Enumerated(EnumType.STRING)
    private SocialPlatform platform;

    @Column(columnDefinition = "TEXT")
    private String content;

    private LocalDateTime scheduledAt;

    private Boolean published = false;

	@Column(name = "profile_id", nullable = false)
	private String profileId;

	@PrePersist
	public void prePersist() {
		this.profileId = TenantContext.getCurrentTenant();
	}
	public SocialPost(Long postId, SocialPlatform platform, String content, LocalDateTime scheduledAt,
			Boolean published) {
		super();
		this.postId = postId;
		this.platform = platform;
		this.content = content;
		this.scheduledAt = scheduledAt;
		this.published = published;
	}

	public SocialPost() {
		super();
		// TODO Auto-generated constructor stub
	}

	public Long getPostId() {
		return postId;
	}

	public void setPostId(Long postId) {
		this.postId = postId;
	}

	public SocialPlatform getPlatform() {
		return platform;
	}

	public void setPlatform(SocialPlatform platform) {
		this.platform = platform;
	}

	public String getContent() {
		return content;
	}

	public void setContent(String content) {
		this.content = content;
	}

	public LocalDateTime getScheduledAt() {
		return scheduledAt;
	}

	public void setScheduledAt(LocalDateTime scheduledAt) {
		this.scheduledAt = scheduledAt;
	}

	public Boolean getPublished() {
		return published;
	}

	public void setPublished(Boolean published) {
		this.published = published;
	}
}
