package com.example.demo.dto;

public class SocialEngagementDTO {

    private Long postId;
    private Long contactId;
    private String engagementType;
	public SocialEngagementDTO(Long postId, Long contactId, String engagementType) {
		super();
		this.postId = postId;
		this.contactId = contactId;
		this.engagementType = engagementType;
	}
	public SocialEngagementDTO() {
		super();
		// TODO Auto-generated constructor stub
	}
	public Long getPostId() {
		return postId;
	}
	public void setPostId(Long postId) {
		this.postId = postId;
	}
	public Long getContactId() {
		return contactId;
	}
	public void setContactId(Long contactId) {
		this.contactId = contactId;
	}
	public String getEngagementType() {
		return engagementType;
	}
	public void setEngagementType(String engagementType) {
		this.engagementType = engagementType;
	}
}
