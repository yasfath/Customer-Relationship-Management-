package com.example.demo.service;

import com.example.demo.dto.*;

import java.util.List;

public interface AnalyticsService {

    DashboardStatsDTO getDashboardStats();

    List<LeadFunnelDTO> getLeadFunnel();

    List<CampaignStatusDTO> getCampaignStatus();

    List<LeadsBySourceDTO> getLeadsBySource();

    List<MonthlyLeadsDTO> getMonthlyLeads();

    List<LeadAnalyticsDTO> getLeadsByRange(String range);
}
