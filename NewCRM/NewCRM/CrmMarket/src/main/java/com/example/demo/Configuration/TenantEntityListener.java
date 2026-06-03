//package com.example.demo.Configuration;
//
//import com.example.demo.entity.Lead;
//import jakarta.persistence.PrePersist;
//import org.springframework.stereotype.Component;
//
//@Component
//public class TenantEntityListener {
//
//    @PrePersist
//    public void setTenant(Object entity) {
//
//        if (entity instanceof BaseTenantEntity tenantEntity) {
//
//            String tenant = TenantContext.getCurrentTenant();
//
//            if (tenant == null) {
//                throw new RuntimeException("Tenant not resolved from JWT");
//            }
//
//            tenantEntity.setProfileId(tenant);
//        }
//    }
//}