package com.example.demo.service.impl;

import com.example.demo.Configuration.BrevoEmailService;
import com.example.demo.Configuration.TenantContext;
import com.example.demo.dto.*;
import com.example.demo.entity.*;
import com.example.demo.repository.AutomationRuleRepository;
import com.example.demo.repository.CampaignRepository;
import com.example.demo.repository.EmailLogRepository;
import com.example.demo.repository.LeadRepository;
import com.example.demo.service.AutomationRuleService;
import com.example.demo.service.LeadService;
import com.example.demo.service.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class LeadServiceImpl implements LeadService {

    private final LeadRepository leadRepository;

    @Autowired
    private NotificationService notificationService;

    public LeadServiceImpl(LeadRepository leadRepository, TemplateService templateService) {
        this.leadRepository = leadRepository;
        this.templateService = templateService;

    }

    @Autowired
    private BrevoEmailService brevoEmailService;

    @Autowired
    private AutomationService automationService;

    @Autowired
    private AutomationRuleService automationRuleService;
    @Autowired
    private EmailLogRepository emailLogRepository;

    @Autowired
    private  TemplateService templateService;

    @Autowired
    private AutomationRuleRepository automationRuleRepository;

    @Autowired
    private CampaignRepository campaignRepository;


    @Override
    public LeadResponseDTO createLead(LeadRequestDTO request) {

        // Create Contact
        Contact contact = new Contact();
        contact.setFirstName(request.getFirstName());
        contact.setLastName(request.getLastName());
        contact.setEmail(request.getEmail());
        contact.setPhone(request.getPhone());
        contact.setSource(request.getSource());
        contact.setAssignedStaff(request.getAssignedStaff());


        //Create Lead
        Lead lead = new Lead();
        lead.setContact(contact);
        lead.setStatus(LeadStatus.NEW);
        lead.setAssignedTo("NURTURE");
        Campaign campaign = null;

        if (request.getCampaign_id() != null) {
            campaign = campaignRepository.findById(request.getCampaign_id())
                    .orElseThrow(() -> new RuntimeException("Campaign not found"));
        }

        lead.setCampaign(campaign); lead.setCampaign(campaign);

        // Future Scope 3 – scoring & segmentation
        calculateScoreAndSegment(lead);

        automationService.handleEvent("LEAD_CREATED", lead);


        // Save Lead
        Lead savedLead = leadRepository.save(lead);

        if(savedLead.getCampaign()!=null){
            updateCampaignAnalytics(
                    savedLead.getCampaign().getCampaignId()
            );
        }

        notificationService.createNotification("",
                "New Lead Added",
                "Lead " + savedLead.getContact().getFirstName() + " was added." ,   savedLead);

        // ✅ SEND EMAIL AFTER SAVE
//            brevoEmailService.sendWelcomeEmail(savedLead);

        System.out.println("savedlead id = " + savedLead.getLeadId());

        automationRuleService.handleEvent("LEAD", "CREATED", savedLead);
        //  Map to response
        return mapToResponse(savedLead);
    }

    @Override
    public void updateLeadStatus(Long leadId, String status) {

        Lead lead = leadRepository.findById(leadId)
                .orElseThrow(() -> new RuntimeException("Lead not found"));

        lead.setStatus(LeadStatus.valueOf(status));
        leadRepository.save(lead);
    }

    @Override
    public void addInteraction(Long leadId, LeadInteractionDTO dto) {

        Lead lead = leadRepository.findById(leadId)
                .orElseThrow(() -> new RuntimeException("Lead not found"));

        //  FUTURE SCOPE 1 – CHANNEL LOGIC
        if ("EMAIL".equalsIgnoreCase(dto.getChannel())) {
            // future: SMTP / SES integration
            dto.setDeliveryStatus("SENT");
        }

        if ("SMS".equalsIgnoreCase(dto.getChannel())) {
            // future: Twilio / SMS gateway
            dto.setDeliveryStatus("SENT");
        }

        // interaction is treated as an activity log
        // (can be stored later or just audited)
    }

    @Override
    public LeadStatsDTO getLeadStats() {

        String profileId = TenantContext.getCurrentTenant();

        LeadStatsDTO stats = new LeadStatsDTO();

        stats.setTotalLeads(
                leadRepository.countByProfileId(profileId)
        );

        stats.setNewLeads(
                leadRepository.countByStatusAndProfileId(LeadStatus.NEW, profileId)
        );

        stats.setConvertedLeads(
                leadRepository.countByStatusAndProfileId(LeadStatus.CONVERTED, profileId)
        );

        stats.setLostLeads(
                leadRepository.countByStatusAndProfileId(LeadStatus.LOST, profileId)
        );

        stats.setSalesAssignedLeads(
                leadRepository.countByAssignedToAndProfileId("SALES_TEAM", profileId)
        );

        stats.setNurtureAssignedLeads(
                leadRepository.countByAssignedToAndProfileId("NURTURE", profileId)
        );

        return stats;
    }

    @Override
    public List<LeadTableDTO> getAllLeads() {

        String profileId = TenantContext.getCurrentTenant();

        return leadRepository.fetchAllLeads(profileId);
    }

    @Override
    public List<LeadTableDTO> filterLeads(String status, String assignedTo, String search) {

        String profileId = TenantContext.getCurrentTenant();

        LeadStatus leadStatus = null;

        if (status != null && !status.isEmpty()) {
            leadStatus = LeadStatus.valueOf(status);
        }

        return leadRepository.filterLeads(
                profileId,
                leadStatus,
                assignedTo,
                search
        );
    }

    @Override
    public void autoSegmentLead(Long leadId) {

        Lead lead = leadRepository.findById(leadId)
                .orElseThrow(() -> new RuntimeException("Lead not found"));

        calculateScoreAndSegment(lead);
        leadRepository.save(lead);
    }

    // =========================
    // 🔮 FUTURE SCOPE 3 LOGIC
    // =========================
    private void calculateScoreAndSegment(Lead lead) {

        int score = 0;

        if (lead.getContact() != null) {

            if (lead.getContact().getEmail() != null &&
                    !lead.getContact().getEmail().isEmpty()) {
                score += 20;
            }

            if (lead.getContact().getPhone() != null &&
                    !lead.getContact().getPhone().isEmpty()) {
                score += 20;
            }

            if ("WEBSITE".equalsIgnoreCase(lead.getContact().getSource())) {
                score += 30;
            }

            if ("REFERRAL".equalsIgnoreCase(lead.getContact().getSource())) {
                score += 20;
            }
        }

        lead.setLeadScore(score);

        if (score >= 70) {
            lead.setSegment("HOT");
            lead.setAssignedTo("SALES_TEAM");

            automationService.handleEvent("LEAD_HOT", lead);


        } else if (score >= 40) {
            lead.setSegment("WARM");
            lead.setAssignedTo("NURTURE");
        } else {
            lead.setSegment("COLD");
            lead.setAssignedTo("NURTURE");
        }

        lead.setAutomationEnabled(Boolean.TRUE);
    }

    // =========================
    // DTO MAPPER
    // =========================
    private LeadResponseDTO mapToResponse(Lead lead) {

        LeadResponseDTO response = new LeadResponseDTO();
        response.setLeadId(lead.getLeadId());

        if (lead.getContact() != null) {
            response.setFullName(
                    lead.getContact().getFirstName() + " " +
                            lead.getContact().getLastName()
            );
            response.setEmail(lead.getContact().getEmail());
        }

        response.setStatus(lead.getStatus());
        response.setAssignedTo(lead.getAssignedTo());

        // 🔮 Future Scope 3
        response.setLeadScore(lead.getLeadScore());
        response.setSegment(lead.getSegment());

        return response;
    }


    // bulk message
    @Override
    public void sendBulkCampaign(BulkCampaignRequestDTO dto) {

        if (dto.getTarget() == null || dto.getTarget().isBlank()) {
            throw new RuntimeException("Target is required (SALES_TEAM / NURTURE / NEW)");
        }

        if (dto.getChannel() == null || dto.getChannel().isBlank()) {
            throw new RuntimeException("Channel is required (EMAIL / SMS)");
        }

        List<Lead> leads;

        switch (dto.getTarget()) {
            case "SALES_TEAM" -> leads = leadRepository.findByAssignedTo("SALES_TEAM");
            case "NURTURE" -> leads = leadRepository.findByAssignedTo("NURTURE");
            case "NEW" -> leads = leadRepository.findByStatus(LeadStatus.NEW);
            default -> throw new RuntimeException("Invalid target: " + dto.getTarget());
        }

        String template = dto.getMessage(); // DIRECT MESSAGE FLOW

        for (Lead lead : leads) {

            String message = applyPlaceholders(template, lead);

            if ("EMAIL".equalsIgnoreCase(dto.getChannel())) {

                System.out.println(
                        "EMAIL sent to " + lead.getContact().getEmail() +
                                " with message: " + message
                );

                EmailLog log = new EmailLog();
                log.setContact(lead.getContact());
                log.setStatus(EmailStatus.SENT);
                log.setChannel("EMAIL");
                log.setMessage(message);
                log.setSentAt(LocalDateTime.now());

                emailLogRepository.save(log);
            }
        }
    }



    // =========================
// TEMPLATE PLACEHOLDER LOGIC
// =========================
    private String applyPlaceholders(String template, Lead lead) {

        if (template == null || lead == null || lead.getContact() == null) {
            return template;
        }

        String result = template;

        // {{name}}
        String fullName =
                lead.getContact().getFirstName() + " " +
                        lead.getContact().getLastName();

        result = result.replace("{{name}}", fullName);

        // {{email}}
        if (lead.getContact().getEmail() != null) {
            result = result.replace("{{email}}", lead.getContact().getEmail());
        }

        // {{phone}}
        if (lead.getContact().getPhone() != null) {
            result = result.replace("{{phone}}", lead.getContact().getPhone());
        }

        return result;
    }




    public void updateCampaignAnalytics(Long campaignId) {

        Campaign campaign = campaignRepository.findById(campaignId)
                .orElseThrow(() -> new RuntimeException("Campaign not found"));

        // TOTAL LEADS
        long totalLeads =
                leadRepository.countByCampaignCampaignId(campaignId);

        // CONVERTED LEADS
        long convertedLeads =
                leadRepository.countByCampaignCampaignIdAndStatus(
                        campaignId,
                        LeadStatus.CONVERTED
                );

        // SET LEADS GENERATED
        campaign.setLeadsGenerated((int) totalLeads);

        // CALCULATE CONVERSION RATE
        double conversionRate = 0.0;

        if (totalLeads > 0) {
            conversionRate =
                    (convertedLeads * 100.0) / totalLeads;
        }

        campaign.setConversionRate(conversionRate);

        campaignRepository.save(campaign);
    }

    @Override
    public LeadResponseDTO updateLead(Long id, LeadRequestDTO request) {

        Lead lead = leadRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Lead not found"));

        // Update Contact
        Contact contact = lead.getContact();

        contact.setFirstName(request.getFirstName());
        contact.setLastName(request.getLastName());
        contact.setEmail(request.getEmail());
        contact.setPhone(request.getPhone());
        contact.setSource(request.getSource());
        contact.setAssignedStaff(request.getAssignedStaff());

        // Update Status (Make sure enum matches frontend)
        if (request.getStatus() != null) {
            lead.setStatus(LeadStatus.valueOf(request.getStatus()));
        }

        // Update Campaign
        if (request.getCampaign_id() != null) {
            Campaign campaign = campaignRepository
                    .findById(request.getCampaign_id())
                    .orElseThrow(() -> new RuntimeException("Campaign not found"));
            lead.setCampaign(campaign);
        } else {
            lead.setCampaign(null);
        }

        // Save
        Lead updatedLead = leadRepository.save(lead);

        return mapToResponse(updatedLead);
    }
    @Override
    public void deleteLead(Long id) {

        Lead lead = leadRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Lead not found"));

        leadRepository.delete(lead);
    }

}
