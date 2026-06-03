package com.example.demo.dto;

public class ContactResponseDTO {

    private ContactResponseDTO contact;
    private ContactStatsDTO stats;
    private Long id;
    private String name;
    private String email;
    private String phone;
    private String company;
    private String assignedStaff;


    public ContactResponseDTO() {

    }

    public ContactResponseDTO(ContactResponseDTO contactResponse, ContactStatsDTO stats) {

    }

    public ContactResponseDTO getContact() {
        return contact;
    }

    public void setContact(ContactResponseDTO contact) {
        this.contact = contact;
    }

    public ContactStatsDTO getStats() {
        return stats;
    }

    public void setStats(ContactStatsDTO stats) {
        this.stats = stats;
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

    public String getAssignedStaff() {
        return assignedStaff;
    }

    public void setAssignedStaff(String assignedStaff) {
        this.assignedStaff = assignedStaff;
    }

    public ContactResponseDTO(ContactResponseDTO contact, ContactStatsDTO stats, Long id, String name, String email, String phone, String company, String assignedStaff) {
        this.contact = contact;
        this.stats = stats;
        this.id = id;
        this.name = name;
        this.email = email;
        this.phone = phone;
        this.company = company;
        this.assignedStaff = assignedStaff;
    }
}