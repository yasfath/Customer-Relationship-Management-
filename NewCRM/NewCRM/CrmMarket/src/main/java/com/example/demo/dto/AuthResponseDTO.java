package com.example.demo.dto;

public class AuthResponseDTO {

    private String token;
    private String role;
    private String email;
    private String name;
    private String phoneNumber;
    private String location;
    private String bio;
    private String profileImageUrl;
private String userName;

    private String profileId;
private Long id;
    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public AuthResponseDTO(String token,
                           String role,
                           String email,
                           String name,
                           String phoneNumber,
                           String location,
                           String bio,
                           String profileImageUrl) {

        this.token = token;
        this.role = role;
        this.email = email;
        this.name = name;
        this.phoneNumber = phoneNumber;
        this.location = location;
        this.bio = bio;
        this.profileImageUrl = profileImageUrl;
    }

    public AuthResponseDTO(String token, String role, String email, String name, String phoneNumber, String location, String bio, String profileImageUrl, String userName, String profileId, Long id) {
        this.token = token;
        this.role = role;
        this.email = email;
        this.name = name;
        this.phoneNumber = phoneNumber;
        this.location = location;
        this.bio = bio;
        this.profileImageUrl = profileImageUrl;
        this.userName = userName;
        this.profileId = profileId;
        this.id = id;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public AuthResponseDTO(String token, String role, String email, String name, String phoneNumber, String location, String bio, String profileImageUrl, String profileId) {
        this.token = token;
        this.role = role;
        this.email = email;
        this.name = name;
        this.phoneNumber = phoneNumber;
        this.location = location;
        this.bio = bio;
        this.profileImageUrl = profileImageUrl;
        this.profileId = profileId;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public String getBio() {
        return bio;
    }

    public void setBio(String bio) {
        this.bio = bio;
    }

    public String getProfileImageUrl() {
        return profileImageUrl;
    }

    public void setProfileImageUrl(String profileImageUrl) {
        this.profileImageUrl = profileImageUrl;
    }

    public String getProfileId() {
        return profileId;
    }

    public void setProfileId(String profileId) {
        this.profileId = profileId;
    }
}