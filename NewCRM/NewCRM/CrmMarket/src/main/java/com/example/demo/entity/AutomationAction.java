package com.example.demo.entity;

import com.example.demo.Configuration.TenantContext;
import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.Filter;

@Entity
@Table(name = "automation_actions")
@Data
//@EntityListeners(TenantEntityListener.class)
//
//@Filter(name = "tenantFilter", condition = "profile_id = :profileId")
public class AutomationAction  {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long actionId;

    @ManyToOne
    @JoinColumn(name = "workflow_id")
    private AutomationWorkflow workflow;

    @Enumerated(EnumType.STRING)
    private AutomationActionType actionType;

    private Integer delayMinutes;

    private String actionValue; 
    // example: emailTemplateId / status / segmentId

	@PrePersist
	public void onCreate() {
		this.profileId = TenantContext.getCurrentTenant();
	}
	@Column(name = "profile_id", nullable = false)
	private String profileId;
	public AutomationAction(Long actionId, AutomationWorkflow workflow, AutomationActionType actionType,
			Integer delayMinutes, String actionValue) {
		super();
		this.actionId = actionId;
		this.workflow = workflow;
		this.actionType = actionType;
		this.delayMinutes = delayMinutes;
		this.actionValue = actionValue;
	}

	public AutomationAction() {
		super();
		// TODO Auto-generated constructor stub
	}

	public Long getActionId() {
		return actionId;
	}

	public void setActionId(Long actionId) {
		this.actionId = actionId;
	}

	public AutomationWorkflow getWorkflow() {
		return workflow;
	}

	public void setWorkflow(AutomationWorkflow workflow) {
		this.workflow = workflow;
	}

	public AutomationActionType getActionType() {
		return actionType;
	}

	public void setActionType(AutomationActionType actionType) {
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
