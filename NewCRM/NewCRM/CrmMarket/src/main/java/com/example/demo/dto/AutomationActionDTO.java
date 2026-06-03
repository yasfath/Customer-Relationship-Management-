package com.example.demo.dto;

public class AutomationActionDTO {

    private String actionType;
    private Integer delayMinutes;
    private String actionValue;
	public AutomationActionDTO(String actionType, Integer delayMinutes, String actionValue) {
		super();
		this.actionType = actionType;
		this.delayMinutes = delayMinutes;
		this.actionValue = actionValue;
	}
	public AutomationActionDTO() {
		super();
		// TODO Auto-generated constructor stub
	}
	public String getActionType() {
		return actionType;
	}
	public void setActionType(String actionType) {
		this.actionType = actionType;
	}
	public Integer getDelayMinutes() {
		return delayMinutes;
	}
	public void setDelayMinutes(Integer delayMinutes) {
		this.delayMinutes = delayMinutes;
	}
	public String getActionValue() {
		return actionValue;
	}
	public void setActionValue(String actionValue) {
		this.actionValue = actionValue;
	}
}
