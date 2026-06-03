//package com.example.demo.Configuration;
//
//import jakarta.persistence.EntityManager;
//import jakarta.persistence.PersistenceContext;
//import org.aspectj.lang.annotation.Aspect;
//import org.aspectj.lang.annotation.Before;
//import org.hibernate.Filter;
//import org.hibernate.Session;
//import org.springframework.stereotype.Component;
//
//@Aspect
//@Component
//public class TenantFilterAspect {
//
//    @PersistenceContext
//    private EntityManager entityManager;
//
//    @Before("execution(* com.example.demo.service..*(..))")
//    public void enableTenantFilter() {
//
//        String tenant = TenantContext.getCurrentTenant();
//
//        if (tenant == null) {
//            return;
//        }
//
//        Session session = entityManager.unwrap(Session.class);
//
//        if (session.getEnabledFilter("tenantFilter") == null) {
//            Filter filter = session.enableFilter("tenantFilter");
//            filter.setParameter("profileId", tenant);
//        }
//
//        System.out.println("TENANT FILTER ENABLED FOR: " + tenant);
//    }
//}