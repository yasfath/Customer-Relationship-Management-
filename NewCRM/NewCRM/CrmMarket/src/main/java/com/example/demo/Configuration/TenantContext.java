package com.example.demo.Configuration;

public class TenantContext {

    private static final ThreadLocal<String> CURRENT_TENANT = new ThreadLocal<>();
    private static final ThreadLocal<Long> CURRENT_STAFF = new ThreadLocal<>();

    public static void setCurrentTenant(String tenant) {
        CURRENT_TENANT.set(tenant);
    }

    public static String getCurrentTenant() {
        return CURRENT_TENANT.get();
    }

    public static void setCurrentStaffId(Long staffId) {
        CURRENT_STAFF.set(staffId);
    }

    public static Long getCurrentStaffId() {
        return CURRENT_STAFF.get();
    }

    public static void clear() {
        CURRENT_TENANT.remove();
        CURRENT_STAFF.remove();
    }
}