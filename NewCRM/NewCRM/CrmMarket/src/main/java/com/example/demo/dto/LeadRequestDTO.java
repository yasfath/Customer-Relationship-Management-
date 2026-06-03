package com.example.demo.dto;

import lombok.Data;

@Data
public class LeadRequestDTO {

    private String firstName;
    private String lastName;
    private String email;
    private String phone;
    private String source;
    private Long campaign_id;
	private String status;
	// MULTI TENANT
	private String profileId;

	public LeadRequestDTO(String firstName, String lastName, String email, String phone, String source, Long campaign_id, String status, String assignedStaff) {
		this.firstName = firstName;
		this.lastName = lastName;
		this.email = email;
		this.phone = phone;
		this.source = source;
		this.campaign_id = campaign_id;
		this.status = status;
		this.assignedStaff = assignedStaff;
	}

	public String getStatus() {
		return status;
	}

	public void setStatus(String status) {
		this.status = status;
	}

	private String assignedStaff;

	public String getAssignedStaff() {
		return assignedStaff;
	}

	public void setAssignedStaff(String assignedStaff) {
		this.assignedStaff = assignedStaff;
	}

	public LeadRequestDTO(String firstName, String lastName, String email, String phone, String source, Long campaign_id, String assignedStaff) {
		this.firstName = firstName;
		this.lastName = lastName;
		this.email = email;
		this.phone = phone;
		this.source = source;
		this.campaign_id = campaign_id;
		this.assignedStaff = assignedStaff;
	}

	public LeadRequestDTO(String firstName, String lastName, String email, String phone, String source) {
		super();
		this.firstName = firstName;
		this.lastName = lastName;
		this.email = email;
		this.phone = phone;
		this.source = source;
	}

    public LeadRequestDTO(String firstName, String lastName, String email, String phone, String source, Long campaign_id) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.phone = phone;
        this.source = source;
        this.campaign_id = campaign_id;
    }

    public Long getCampaign_id() {
        return campaign_id;
    }

    public void setCampaign_id(Long campaign_id) {
        this.campaign_id = campaign_id;
    }

    public LeadRequestDTO() {
		super();
		// TODO Auto-generated constructor stub
	}
	public String getFirstName() {
		return firstName;
	}
	public void setFirstName(String firstName) {
		this.firstName = firstName;
	}
	public String getLastName() {
		return lastName;
	}
	public void setLastName(String lastName) {
		this.lastName = lastName;
	}
	public String getEmail() {
		return email;
	}
	public void setEmail(String email) {
		this.email = email;
	}
	public String getPhone() {
		return phone;
	}
	public void setPhone(String phone) {
		this.phone = phone;
	}
	public String getSource() {
		return source;
	}
	public void setSource(String source) {
		this.source = source;
	}
}
