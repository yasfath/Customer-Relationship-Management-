package com.example.demo.dto;

public class LeadScoreRequestDTO {

    private Long leadId;
    private Integer scoreChange; // +10, +20, etc.
	public LeadScoreRequestDTO(Long leadId, Integer scoreChange) {
		super();
		this.leadId = leadId;
		this.scoreChange = scoreChange;
	}
	public LeadScoreRequestDTO() {
		super();
		// TODO Auto-generated constructor stub
	}
	public Long getLeadId() {
		return leadId;
	}
	public void setLeadId(Long leadId) {
		this.leadId = leadId;
	}
	public Integer getScoreChange() {
		return scoreChange;
	}
	public void setScoreChange(Integer scoreChange) {
		this.scoreChange = scoreChange;
	}
}
