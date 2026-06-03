package com.example.demo.dto;

public class LeadScoreResponseDTO {

    private Long leadId;
    private Integer score;
    private Boolean mql;
	public LeadScoreResponseDTO(Long leadId, Integer score, Boolean mql) {
		super();
		this.leadId = leadId;
		this.score = score;
		this.mql = mql;
	}
	public LeadScoreResponseDTO() {
		super();
		// TODO Auto-generated constructor stub
	}
	public Long getLeadId() {
		return leadId;
	}
	public void setLeadId(Long leadId) {
		this.leadId = leadId;
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
}
