//package com.example.demo.Configuration;
//
//import jakarta.persistence.Column;
//import jakarta.persistence.MappedSuperclass;
//import org.hibernate.annotations.Filter;
//import org.hibernate.annotations.FilterDef;
//import org.hibernate.annotations.ParamDef;
//
//
//@MappedSuperclass
//@FilterDef(
//        name = "tenantFilter",
//        parameters = @ParamDef(name = "profileId", type = String.class)
//)
//public abstract class BaseTenantEntity {
//
//    @Column(name = "profile_id", nullable = false, updatable = false)
//    private String profileId;
//
//    public String getProfileId() {
//        return profileId;
//    }
//
//    public void setProfileId(String profileId) {
//        this.profileId = profileId;
//    }
//}