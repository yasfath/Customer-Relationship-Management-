package com.example.demo.service.impl;

import com.example.demo.dto.ROIResponseDTO;
import com.example.demo.entity.ROIReport;
import com.example.demo.repository.ROIRepository;
import com.example.demo.service.ROIService;
import org.springframework.stereotype.Service;

@Service
public class ROIServiceImpl implements ROIService {

    private final ROIRepository roiRepository;

    public ROIServiceImpl(ROIRepository roiRepository) {
        this.roiRepository = roiRepository;
    }

    @Override
    public ROIResponseDTO calculateROI(Long campaignId,
                                       double campaignCost,
                                       double revenueGenerated) {

        double roi =
                ((revenueGenerated - campaignCost) / campaignCost) * 100;

        ROIReport report = new ROIReport();
        report.setCampaignId(campaignId);
        report.setCampaignCost(campaignCost);
        report.setRevenueGenerated(revenueGenerated);
        report.setRoiPercentage(roi);

        roiRepository.save(report);

        ROIResponseDTO response = new ROIResponseDTO();
        response.setCampaignId(campaignId);
        response.setCampaignCost(campaignCost);
        response.setRevenueGenerated(revenueGenerated);
        response.setRoiPercentage(roi);

        return response;
    }
}
