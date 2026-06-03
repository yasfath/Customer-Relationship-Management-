package com.example.demo.service.impl;

import com.example.demo.Configuration.TenantContext;
import com.example.demo.dto.*;
import com.example.demo.entity.*;
import com.example.demo.repository.*;
import com.example.demo.service.CampaignService;
import com.example.demo.service.ROIService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CampaignServiceImpl implements CampaignService {

    private final CampaignRepository campaignRepository;
    private final CampaignTargetRepository campaignTargetRepository;
    private final SegmentRepository segmentRepository;
    private final ROIRepository roiRepository;
    private final LeadRepository leadRepository;


    public CampaignServiceImpl(CampaignRepository campaignRepository,
                               CampaignTargetRepository campaignTargetRepository,
                               SegmentRepository segmentRepository,ROIRepository roiRepository,LeadRepository leadRepository) {
        this.campaignRepository = campaignRepository;
        this.campaignTargetRepository = campaignTargetRepository;
        this.segmentRepository = segmentRepository;
        this.roiRepository = roiRepository;
        this.leadRepository = leadRepository;
    }

    @Autowired
    private EmailLogRepository emailLogRepository;

    @Autowired
    private AutomationService automationService;

    @Autowired
    private ROIService roi;




    @Override
    public CampaignResponseDTO createCampaign(CampaignRequestDTO request) {

        Campaign campaign = new Campaign();

        campaign.setName(request.getName());
        campaign.setType(request.getType());
        campaign.setBudget(request.getBudget());
        campaign.setStartDate(request.getStartDate());
        campaign.setEndDate(request.getEndDate());

        //  Status from request
        if (request.getStatus() != null) {
            campaign.setStatus(
                    CampaignStatus.valueOf(request.getStatus().toUpperCase())
            );
        } else {
            campaign.setStatus(CampaignStatus.DRAFT);
        }

        //  Leads Generated
        campaign.setLeadsGenerated(
                request.getLeadsGenerated() != null
                        ? request.getLeadsGenerated()
                        : 0
        );

        campaign.setConversionRate(0.0);
        campaign.setRoi(0.0);


        Campaign saved = campaignRepository.save(campaign);

        Double revenue = request.getRevenueGenerated() != null
                ? request.getRevenueGenerated()
                : 0.0;


        ROIResponseDTO savedRoi = roi.calculateROI(saved.getCampaignId(), saved.getBudget(), revenue);
        return new CampaignResponseDTO(
                saved.getCampaignId(),
                saved.getName(),
                saved.getType(),
                saved.getStatus(),
                saved.getLeadsGenerated(),
                saved.getConversionRate(),
                savedRoi.getRoiPercentage()
        );
    }
    @Override
    public void addSegmentToCampaign(Long campaignId, Long segmentId) {

        Campaign campaign = campaignRepository.findById(campaignId)
                .orElseThrow(() -> new RuntimeException("Campaign not found"));

        Segment segment = segmentRepository.findById(segmentId)
                .orElseThrow(() -> new RuntimeException("Segment not found"));

        CampaignTarget target = new CampaignTarget();
        target.setCampaign(campaign);
        target.setSegment(segment);

        campaignTargetRepository.save(target);
    }

    @Override
    public void launchCampaign(Long campaignId) {

        Campaign campaign = campaignRepository.findById(campaignId)
                .orElseThrow(() -> new RuntimeException("Campaign not found"));

        campaign.setStatus(CampaignStatus.ACTIVE);
        campaignRepository.save(campaign);

        // SCOPE 4 – AUTOMATION TRIGGER
        automationService.handleEvent("CAMPAIGN_LAUNCHED", null);
    }


    @Override
    public List<CampaignDetailsDTO> getAllCampaigns(CampaignStatus status, String type) {

        List<Campaign> campaigns;


        String profileId = TenantContext.getCurrentTenant();


        if (status != null && type != null)
            campaigns = campaignRepository.findByProfileIdAndStatusAndType(profileId, status, type);
        else if (status != null)
            campaigns = campaignRepository.findByProfileIdAndStatus(profileId, status);
        else
            campaigns =  campaignRepository.findByProfileId(profileId);

        return campaigns.stream().map(c -> {
            CampaignDetailsDTO dto = new CampaignDetailsDTO();
            dto.setId(c.getCampaignId());
            dto.setName(c.getName());
            dto.setType(c.getType());
            dto.setBudget(c.getBudget());
            dto.setStartDate(c.getStartDate());
            dto.setEndDate(c.getEndDate());
            dto.setRevenueGenerated(c.getRevenueGenerated());
            dto.setStatus(c.getStatus());
            dto.getLeads_generated();

            long totalLeads =
                    leadRepository.countByCampaignCampaignIdAndProfileId(
                            c.getCampaignId(),
                            TenantContext.getCurrentTenant()
                    );

            long convertedLeads =
                    leadRepository.countByCampaignCampaignIdAndStatusAndProfileId(
                            c.getCampaignId(),
                            LeadStatus.CONVERTED,
                            profileId
                    );

            double conversionRate =
                    totalLeads == 0 ? 0 :
                            (convertedLeads * 100.0) / totalLeads;

            dto.setLeads_generated(String.valueOf(totalLeads));
            dto.setConversionRate(conversionRate);

            ROIResponseDTO roiResponseDTO = new ROIResponseDTO();


            // Fetch ROI using campaignId column
            roiRepository.findTopByCampaignIdOrderByCreatedAtDesc(c.getCampaignId())
                    .ifPresent(roi -> {
                        roiResponseDTO.setCampaignId(roi.getCampaignId());
                        roiResponseDTO.setCampaignCost(roi.getCampaignCost());
                        roiResponseDTO.setRevenueGenerated(roi.getRevenueGenerated());
                        roiResponseDTO.setRoiPercentage(roi.getRoiPercentage());

                        dto.setRoiResponse(roiResponseDTO);
                    });
            return dto;
        }).toList();
    }

    @Override
    public CampaignDetailsDTO getCampaignDetails(Long id) {

        Campaign c = campaignRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Campaign not found"));

        CampaignDetailsDTO dto = new CampaignDetailsDTO();
        dto.setId(c.getCampaignId());
        dto.setName(c.getName());
        dto.setType(c.getType());
        dto.setStatus(c.getStatus());
        dto.setBudget(c.getBudget());
        dto.setStartDate(c.getStartDate());
        dto.setEndDate(c.getEndDate());
        dto.getLeads_generated();



        return dto;
    }

    @Override
    public CampaignResponseDTO updateCampaign(Long id, CampaignRequestDTO dto) {

        Campaign c = campaignRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Campaign not found"));

        if (dto.getName() != null) {
            c.setName(dto.getName());
        }

        if (dto.getType() != null) {
            c.setType(dto.getType());
        }

        if (dto.getBudget() != null) {
            c.setBudget(dto.getBudget());
        }

        if (dto.getStartDate() != null) {
            c.setStartDate(dto.getStartDate());
        }

        if (dto.getEndDate() != null) {
            c.setEndDate(dto.getEndDate());
        }

        if (dto.getStatus() != null) {
            try {
                c.setStatus(
                        CampaignStatus.valueOf(dto.getStatus().toUpperCase())
                );
            } catch (IllegalArgumentException e) {
                throw new RuntimeException("Invalid campaign status");
            }
        }

        if(dto.getRevenueGenerated()!=null)
        {
            c.setRevenueGenerated(dto.getRevenueGenerated());
        }
        Campaign saved = campaignRepository.save(c);

        Double revenue = dto.getRevenueGenerated() != null
                ? dto.getRevenueGenerated()
                : 0.0;

        ROIResponseDTO roiResponse =
                roi.calculateROI(saved.getCampaignId(), saved.getBudget(), revenue);

        return new CampaignResponseDTO(
                saved.getCampaignId(),
                saved.getName(),
                saved.getType(),
                saved.getStatus(),
                saved.getLeadsGenerated(), saved.getConversionRate(),
                roiResponse.getRoiPercentage()
        );
    }


    @Override
    public void deleteCampaign(Long id) {

        Campaign campaign = campaignRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Campaign not found"));

        // Step 1: delete child records
        emailLogRepository.deleteByCampaign_CampaignId(id);

        // Step 2: delete parent
        campaignRepository.delete(campaign);
    }


    @Override
    public void pauseCampaign(Long id) {

        Campaign c = campaignRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Campaign not found"));

        c.setStatus(CampaignStatus.PAUSED);
        campaignRepository.save(c);
    }


    @Override
    public CampaignSummaryDTO getCampaignSummary() {

        String profileId = TenantContext.getCurrentTenant();

        long totalCampaigns =
                campaignRepository.countByProfileId(profileId);

        long activeCampaigns =
                campaignRepository.countByProfileIdAndStatus(profileId, CampaignStatus.ACTIVE);

        long totalLeads =
                leadRepository.countByCampaignIsNotNullAndProfileId(profileId);

        long convertedLeads =
                leadRepository.countByCampaignIsNotNullAndStatusAndProfileId(
                        LeadStatus.CONVERTED,
                        profileId
                );
        double avgConversionRate = 0.0;

        if (totalLeads > 0) {
            avgConversionRate =
                    ((double) convertedLeads / totalLeads) * 100;
        }

        CampaignSummaryDTO dto = new CampaignSummaryDTO();
        dto.setTotalCampaigns(totalCampaigns);
        dto.setActiveCampaigns(activeCampaigns);
        dto.setTotalLeadsGenerated(totalLeads);
        dto.setAvgConversionRate(avgConversionRate);

        return dto;
    }



    // to find how many email opend , clicked like this
    @Override
    public CampaignEmailAnalyticsDTO getCampaignEmailAnalytics(Long campaignId) {

        long totalSent =
                emailLogRepository.countByCampaign_CampaignIdAndStatus(
                        campaignId, EmailStatus.SENT
                );

        long opened =
                emailLogRepository.countByCampaign_CampaignIdAndOpenedTrue(
                        campaignId
                );

        long clicked =
                emailLogRepository.countByCampaign_CampaignIdAndClickedTrue(
                        campaignId
                );

        double openRate =
                totalSent == 0 ? 0 : (opened * 100.0) / totalSent;

        double clickRate =
                totalSent == 0 ? 0 : (clicked * 100.0) / totalSent;

        CampaignEmailAnalyticsDTO dto = new CampaignEmailAnalyticsDTO();
        dto.setCampaignId(campaignId);
        dto.setTotalSent(totalSent);
        dto.setOpened(opened);
        dto.setClicked(clicked);
        dto.setOpenRate(openRate);
        dto.setClickRate(clickRate);

        return dto;
    }






}
