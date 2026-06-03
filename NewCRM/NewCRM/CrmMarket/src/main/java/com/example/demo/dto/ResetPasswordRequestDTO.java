package com.example.demo.dto;

import lombok.Data;

@Data
public class ResetPasswordRequestDTO {

    private String token;
    private String newPassword;

    private String email;
    private String confirmPassword;

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public String getNewPassword() {
        return newPassword;
    }

    public void setNewPassword(String newPassword) {
        this.newPassword = newPassword;
    }
}