package com.example.demo.service.impl;

import com.example.demo.Configuration.TenantContext;
import com.example.demo.dto.*;
import com.example.demo.repository.AnalyticsDao;
import com.example.demo.repository.LeadRepository;
import com.example.demo.service.AnalyticsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.Month;
import java.time.format.TextStyle;
import java.util.List;
import java.util.Locale;

@Service
public class AnalyticsServiceImpl implements AnalyticsService {

    private final AnalyticsDao analyticsDao;

    @Autowired
    private LeadRepository leadRepository;

    public AnalyticsServiceImpl(AnalyticsDao analyticsDao) {
        this.analyticsDao = analyticsDao;
    }

    @Override
    public DashboardStatsDTO getDashboardStats() {

        String profileId = TenantContext.getCurrentTenant();

        return new DashboardStatsDTO(
                analyticsDao.countTotalLeads(profileId),
                analyticsDao.countNewLeads(profileId),
                analyticsDao.countQualifiedLeads(profileId),
                analyticsDao.countCampaigns(profileId),
                analyticsDao.totalRevenue(profileId)
        );
    }

    @Override
    public List<LeadFunnelDTO> getLeadFunnel() {
        String profileId = TenantContext.getCurrentTenant();

        return analyticsDao.getLeadFunnel(profileId);
    }

    @Override
    public List<CampaignStatusDTO> getCampaignStatus() {
        String profileId = TenantContext.getCurrentTenant();

        return analyticsDao.getCampaignStatus(profileId);
    }

    @Override
    public List<LeadsBySourceDTO> getLeadsBySource() {
        String profileId = TenantContext.getCurrentTenant();

        return analyticsDao.getLeadsBySource(profileId);
    }

    @Override
    public List<MonthlyLeadsDTO> getMonthlyLeads() {
        String profileId = TenantContext.getCurrentTenant();

        List<MonthlyLeadsDTO> list = analyticsDao.getMonthlyLeads(profileId);

        list.forEach(dto -> {
            String name = Month.of(dto.getMonth()).getDisplayName(
                    TextStyle.SHORT, Locale.ENGLISH);   // Jan, Feb
            dto.setMonthName(name);
        });

        return list;
    }

    @Override
    public List<LeadAnalyticsDTO> getLeadsByRange(String range) {
        String profileId = TenantContext.getCurrentTenant();
        LocalDateTime startDate;

        switch (range) {

            case "1D":
                startDate = LocalDateTime.now().minusDays(1);
                break;

            case "1M":
                startDate = LocalDateTime.now().minusMonths(1);
                break;

            case "1Y":
                startDate = LocalDateTime.now().minusYears(1);
                break;

            case "Max":
            default:
                startDate = LocalDateTime.of(2000,1,1,0,0);
        }

        return leadRepository.getLeadsAnalytics(startDate,profileId);
    }

}
