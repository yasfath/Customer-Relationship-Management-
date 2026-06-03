package com.example.demo.service;

import com.example.demo.dto.ROIResponseDTO;

public interface ROIService {

    ROIResponseDTO calculateROI(Long campaignId,
                                double campaignCost,
                                double revenueGenerated);
}
