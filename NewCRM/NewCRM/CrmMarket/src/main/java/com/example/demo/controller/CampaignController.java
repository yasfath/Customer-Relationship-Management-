package com.example.demo.controller;

import com.example.demo.dto.*;
import com.example.demo.entity.Campaign;
import com.example.demo.entity.CampaignStatus;
import com.example.demo.repository.CampaignRepository;
import com.example.demo.service.CampaignService;
import com.example.demo.service.LeadService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/campaigns")
public class CampaignController {

    private final CampaignService campaignService;
    private final LeadService leadService;

    public CampaignController(
            CampaignService campaignService,
            LeadService leadService
    ) {
        this.campaignService = campaignService;
        this.leadService = leadService;
    }
    @Autowired
    private CampaignRepository campaignRepository;


    // =========================
    // CREATE CAMPAIGN
    // =========================
    @PostMapping("/create")
    public ResponseEntity<CampaignResponseDTO> createCampaign(
            @RequestBody CampaignRequestDTO request) {

        return ResponseEntity.ok(
                campaignService.createCampaign(request)
        );
    }

    // =========================
    // BULK EMAIL / SMS SEND-
    // =========================
    @PostMapping("/bulk-send")
    public ResponseEntity<String> sendBulkCampaign(
            @RequestBody BulkCampaignRequestDTO dto) {

        leadService.sendBulkCampaign(dto);
        return ResponseEntity.ok("Bulk campaign executed successfully");
    }

    // =========================
    // ADD SEGMENT TO CAMPAIGN
    // =========================
    @PostMapping("/{campaignId}/segments")
    public ResponseEntity<String> addSegment(
            @PathVariable Long campaignId,
            @RequestBody CampaignTargetDTO dto) {

        campaignService.addSegmentToCampaign(
                campaignId,
                dto.getSegmentId()
        );
        return ResponseEntity.ok("Segment added to campaign");
    }

    // =========================
    // LAUNCH CAMPAIGN
    // =========================
    @PostMapping("/{campaignId}/launch")
    public ResponseEntity<String> launchCampaign(
            @PathVariable Long campaignId) {

        campaignService.launchCampaign(campaignId);
        return ResponseEntity.ok("Campaign launched successfully");
    }

    // =========================
    // GET ALL CAMPAIGNS
    // =========================
    @GetMapping("/getallcampaigns")
    public ResponseEntity<List<CampaignDetailsDTO>> getAllCampaigns(
            @RequestParam(required = false) CampaignStatus status,
            @RequestParam(required = false) String type) {

        return ResponseEntity.ok(
                campaignService.getAllCampaigns(status, type)
        );
    }

    // =========================
    // GET CAMPAIGN BY ID
    // =========================
    @GetMapping("/{id}")
    public ResponseEntity<CampaignDetailsDTO> getCampaignById(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                campaignService.getCampaignDetails(id)
        );
    }

    // =========================
    // UPDATE CAMPAIGN
    // =========================
    @PutMapping("/{id}")
    public ResponseEntity<CampaignResponseDTO> updateCampaign(
            @PathVariable Long id,
            @RequestBody CampaignRequestDTO dto) {

        return ResponseEntity.ok(
                campaignService.updateCampaign(id, dto)
        );
    }
    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> deleteCampaign(@PathVariable Long id) {

        Campaign campaign = campaignRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Campaign not found"));

        campaignRepository.delete(campaign);

        Map<String, String> response = new HashMap<>();
        response.put("message", "Campaign deleted successfully");

        return ResponseEntity.ok(response);
    }



    // =========================
    // PAUSE CAMPAIGN
    // =========================
    @PutMapping("/{id}/pause")
    public ResponseEntity<String> pauseCampaign(
            @PathVariable Long id) {

        campaignService.pauseCampaign(id);
        return ResponseEntity.ok("Campaign paused");
    }

    // =========================
    // CAMPAIGN ANALYTICS
    // =========================
    @GetMapping("/analytics/summary")
    public ResponseEntity<CampaignSummaryDTO> getSummary() {

        return ResponseEntity.ok(
                campaignService.getCampaignSummary()
        );
    }

    // to identify how  many opended mail out of 100 like this
    @GetMapping("/{campaignId}/email-analytics")
    public ResponseEntity<CampaignEmailAnalyticsDTO> getEmailAnalytics(
            @PathVariable Long campaignId) {

        return ResponseEntity.ok(
                campaignService.getCampaignEmailAnalytics(campaignId)
        );
    }


}
