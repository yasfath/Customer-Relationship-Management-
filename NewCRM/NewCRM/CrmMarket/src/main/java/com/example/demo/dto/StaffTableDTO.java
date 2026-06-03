package com.example.demo.dto;

import com.example.demo.entity.StaffRole;
import com.example.demo.entity.StaffStatus;

public class StaffTableDTO {

    private Long id;
    private String name;
    private String email;
    private StaffRole role;
    private StaffStatus status;

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

    public StaffRole getRole() {
        return role;
    }

    public void setRole(StaffRole role) {
        this.role = role;
    }

    public StaffStatus getStatus() {
        return status;
    }

    public void setStatus(StaffStatus status) {
        this.status = status;
    }

    public StaffTableDTO() {
    }

    public StaffTableDTO(Long id, String name, String email, StaffRole role, StaffStatus status) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.role = role;
        this.status = status;
    }
}

