package com.example.demo.controller;

import com.example.demo.dto.*;
import com.example.demo.service.AnalyticsService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/analytics")
@CrossOrigin
public class AnalyticsController {

    private final AnalyticsService analyticsService;

    public AnalyticsController(AnalyticsService analyticsService) {
        this.analyticsService = analyticsService;
    }

    // Dashboard KPIs
    @GetMapping("/dashboard")
    public DashboardStatsDTO getDashboardStats() {
        return analyticsService.getDashboardStats();
    }

    //  Lead Funnel
    @GetMapping("/funnel")
    public List<LeadFunnelDTO> getLeadFunnel() {
        return analyticsService.getLeadFunnel();
    }

    //  Campaign Status Pie
    @GetMapping("/campaign-status")
    public List<CampaignStatusDTO> getCampaignStatus() {
        return analyticsService.getCampaignStatus();
    }

    //  Leads By Source Line Chart
    @GetMapping("/leads-by-source")
    public List<LeadsBySourceDTO> getLeadsBySource() {
        return analyticsService.getLeadsBySource();
    }

    //  Monthly Leads Overview Bar Chart
    @GetMapping("/monthly-leads")
    public List<MonthlyLeadsDTO> getMonthlyLeads() {
        return analyticsService.getMonthlyLeads();
    }


    // =============================
    // LEADS BY TIME RANGE
    // =============================
    @GetMapping("/leads")
    public ResponseEntity<?> getLeadsByRange(
            @RequestParam(defaultValue = "1D") String range) {

        return ResponseEntity.ok(
                analyticsService.getLeadsByRange(range)
        );
    }

}
