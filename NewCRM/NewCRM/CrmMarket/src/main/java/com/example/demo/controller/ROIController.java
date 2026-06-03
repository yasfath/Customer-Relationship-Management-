package com.example.demo.controller;

import com.example.demo.dto.ROIRequestDTO;
import com.example.demo.dto.ROIResponseDTO;
import com.example.demo.service.ROIService;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/roi")
public class ROIController {

    private final ROIService roiService;

    public ROIController(ROIService roiService) {
        this.roiService = roiService;
    }

    @PostMapping("/calculate")
    public ROIResponseDTO calculateROI(
            @RequestBody ROIRequestDTO request) {

        return roiService.calculateROI(
                request.getCampaignId(),
                request.getCampaignCost(),
                request.getRevenueGenerated());
    }
}
