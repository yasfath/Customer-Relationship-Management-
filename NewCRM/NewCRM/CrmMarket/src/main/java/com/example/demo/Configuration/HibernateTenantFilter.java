//package com.example.demo.Configuration;
//
//import jakarta.persistence.EntityManager;
//import jakarta.persistence.PersistenceContext;
//import org.hibernate.Filter;
//import org.hibernate.Session;
//import org.springframework.stereotype.Component;
//
//@Component
//public class HibernateTenantFilter {
//
//    @PersistenceContext
//    private EntityManager entityManager;
//
//    public void enableTenantFilter() {
//
//        String tenantId = TenantContext.getCurrentTenant();
//
//        if (tenantId == null) {
//            return;
//        }
//
//        System.out.println("TENANT FILTER ENABLED FOR: " + tenantId);
//
//        Session session = entityManager.unwrap(Session.class);
//
//        Filter filter = session.enableFilter("tenantFilter");
//        filter.setParameter("profileId", tenantId);
//    }
//}