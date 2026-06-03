package com.example.demo.dto;

public class SocialPostRequestDTO {

    private String platform;
    private String content;
    private String scheduledAt; // ISO date-time
	public SocialPostRequestDTO() {
		super();
		// TODO Auto-generated constructor stub
	}
	public SocialPostRequestDTO(String platform, String content, String scheduledAt) {
		super();
		this.platform = platform;
		this.content = content;
		this.scheduledAt = scheduledAt;
	}
	public String getPlatform() {
		return platform;
	}
	public void setPlatform(String platform) {
		this.platform = platform;
	}
	public String getContent() {
		return content;
	}
	public void setContent(String content) {
		this.content = content;
	}
	public String getScheduledAt() {
		return scheduledAt;
	}
	public void setScheduledAt(String scheduledAt) {
		this.scheduledAt = scheduledAt;
	}

    
}
