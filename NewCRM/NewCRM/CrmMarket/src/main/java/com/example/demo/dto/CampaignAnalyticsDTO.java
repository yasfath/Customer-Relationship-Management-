package com.example.demo.dto;

public class CampaignAnalyticsDTO {

    private Long campaignId;
    private String campaignName;
    private Long emailsSent;
    private Long conversions;
    private Double revenue;
	public CampaignAnalyticsDTO(Long campaignId, String campaignName, Long emailsSent, Long conversions,
			Double revenue) {
		super();
		this.campaignId = campaignId;
		this.campaignName = campaignName;
		this.emailsSent = emailsSent;
		this.conversions = conversions;
		this.revenue = revenue;
	}
	public CampaignAnalyticsDTO() {
		super();
		// TODO Auto-generated constructor stub
	}
	public Long getCampaignId() {
		return campaignId;
	}
	public void setCampaignId(Long campaignId) {
		this.campaignId = campaignId;
	}
	public String getCampaignName() {
		return campaignName;
	}
	public void setCampaignName(String campaignName) {
		this.campaignName = campaignName;
	}
	public Long getEmailsSent() {
		return emailsSent;
	}
	public void setEmailsSent(Long emailsSent) {
		this.emailsSent = emailsSent;
	}
	public Long getConversions() {
		return conversions;
	}
	public void setConversions(Long conversions) {
		this.conversions = conversions;
	}
	public Double getRevenue() {
		return revenue;
	}
	public void setRevenue(Double revenue) {
		this.revenue = revenue;
	}
}
