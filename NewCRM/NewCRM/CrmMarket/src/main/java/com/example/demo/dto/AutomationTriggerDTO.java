package com.example.demo.dto;

public class AutomationTriggerDTO {

    private String triggerEvent;
    private Long leadId;
	public AutomationTriggerDTO(String triggerEvent, Long leadId) {
		super();
		this.triggerEvent = triggerEvent;
		this.leadId = leadId;
	}
	public AutomationTriggerDTO() {
		super();
		// TODO Auto-generated constructor stub
	}
	public String getTriggerEvent() {
		return triggerEvent;
	}
	public void setTriggerEvent(String triggerEvent) {
		this.triggerEvent = triggerEvent;
	}
	public Long getLeadId() {
		return leadId;
	}
	public void setLeadId(Long leadId) {
		this.leadId = leadId;
	}
}
