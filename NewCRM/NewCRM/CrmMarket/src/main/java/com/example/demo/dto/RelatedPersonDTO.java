package com.example.demo.dto;

public class RelatedPersonDTO {

    private String name;
    private String email;
    private String phone;
    private String stage;

    public RelatedPersonDTO(String name, String email, String phone, String stage) {
        this.name = name;
        this.email = email;
        this.phone = phone;
        this.stage = stage;
    }

    public RelatedPersonDTO() {
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

    public String getStage() {
        return stage;
    }

    public void setStage(String stage) {
        this.stage = stage;
    }
}
