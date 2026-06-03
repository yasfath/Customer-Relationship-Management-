package com.example.demo.dto;

public class AutomationWorkflowRequestDTO {

    private String name;
    private String triggerEvent;
	public AutomationWorkflowRequestDTO() {
		super();
		// TODO Auto-generated constructor stub
	}
	public AutomationWorkflowRequestDTO(String name, String triggerEvent) {
		super();
		this.name = name;
		this.triggerEvent = triggerEvent;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public String getTriggerEvent() {
		return triggerEvent;
	}
	public void setTriggerEvent(String triggerEvent) {
		this.triggerEvent = triggerEvent;
	}
}
