package com.example.demo.service;

import com.example.demo.dto.*;
import com.example.demo.entity.CampaignStatus;

import java.util.List;

public interface CampaignService {

    CampaignResponseDTO createCampaign(CampaignRequestDTO request);

    void addSegmentToCampaign(Long campaignId, Long segmentId);

    void launchCampaign(Long campaignId);


    List<CampaignDetailsDTO> getAllCampaigns(CampaignStatus status, String type);

    CampaignDetailsDTO getCampaignDetails(Long id);

    CampaignResponseDTO updateCampaign(Long id, CampaignRequestDTO dto);

    void deleteCampaign(Long id);

    void pauseCampaign(Long id);

    CampaignSummaryDTO getCampaignSummary();

    // to find how many email opend , clicked like this
    CampaignEmailAnalyticsDTO getCampaignEmailAnalytics(Long campaignId);
}
