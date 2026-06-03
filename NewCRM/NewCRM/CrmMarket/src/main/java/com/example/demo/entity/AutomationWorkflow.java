package com.example.demo.entity;

import com.example.demo.Configuration.TenantContext;
import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.Filter;

@Entity
@Table(name = "automation_workflows")
@Data
//@EntityListeners(TenantEntityListener.class)
//
//@Filter(name = "tenantFilter", condition = "profile_id = :profileId")
public class AutomationWorkflow {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long workflowId;

    private String name;

    @Enumerated(EnumType.STRING)
    private AutomationTrigger triggerEvent;

    private Boolean active;

	public AutomationWorkflow(Long workflowId, String name, AutomationTrigger triggerEvent, Boolean active) {
		super();
		this.workflowId = workflowId;
		this.name = name;
		this.triggerEvent = triggerEvent;
		this.active = active;
	}
	@PrePersist
	public void onCreate() {
		this.profileId = TenantContext.getCurrentTenant();
	}
	@Column(name = "profile_id", nullable = false)
	private String profileId;

	public AutomationWorkflow() {
		super();
		// TODO Auto-generated constructor stub
	}

	public Long getWorkflowId() {
		return workflowId;
	}

	public void setWorkflowId(Long workflowId) {
		this.workflowId = workflowId;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public AutomationTrigger getTriggerEvent() {
		return triggerEvent;
	}

	public void setTriggerEvent(AutomationTrigger triggerEvent) {
		this.triggerEvent = triggerEvent;
	}

	public Boolean getActive() {
		return active;
	}

	public void setActive(Boolean active) {
		this.active = active;
	}
}
