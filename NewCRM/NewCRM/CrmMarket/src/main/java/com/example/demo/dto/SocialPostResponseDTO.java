package com.example.demo.dto;

public class SocialPostResponseDTO {

    private Long postId;
    private String platform;
    private Boolean published;
	public SocialPostResponseDTO(Long postId, String platform, Boolean published) {
		super();
		this.postId = postId;
		this.platform = platform;
		this.published = published;
	}
	public SocialPostResponseDTO() {
		super();
		// TODO Auto-generated constructor stub
	}
	public Long getPostId() {
		return postId;
	}
	public void setPostId(Long postId) {
		this.postId = postId;
	}
	public String getPlatform() {
		return platform;
	}
	public void setPlatform(String platform) {
		this.platform = platform;
	}
	public Boolean getPublished() {
		return published;
	}
	public void setPublished(Boolean published) {
		this.published = published;
	}
}
