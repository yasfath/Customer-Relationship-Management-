package com.example.demo.dto;

public class ContactTableDTO {

    private Long id;
    private String name;
    private String email;
    private String phone;
    private String company;
    private Long linkedLead;
    private String assignedStaff;

    public ContactTableDTO() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
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

    public String getCompany() {
        return company;
    }

    public void setCompany(String company) {
        this.company = company;
    }

    public Long getLinkedLead() {
        return linkedLead;
    }

    public void setLinkedLead(Long linkedLead) {
        this.linkedLead = linkedLead;
    }

    public String getAssignedStaff() {
        return assignedStaff;
    }

    public void setAssignedStaff(String assignedStaff) {
        this.assignedStaff = assignedStaff;
    }

    public ContactTableDTO(Long id, String name, String email,
                           String phone, String company,
                           Long linkedLead, String assignedStaff) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.phone = phone;
        this.company = company;
        this.linkedLead = linkedLead;
        this.assignedStaff = assignedStaff;
    }
}
