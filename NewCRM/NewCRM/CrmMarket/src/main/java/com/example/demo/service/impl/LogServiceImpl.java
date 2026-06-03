package com.example.demo.service.impl;

import com.example.demo.Configuration.TenantContext;
import com.example.demo.dto.LogRequestDTO;
import com.example.demo.dto.LogTableDTO;
import com.example.demo.entity.Contact;
import com.example.demo.entity.EmailLog;
import com.example.demo.entity.EmailLogDashboard;
import com.example.demo.entity.Lead;
import com.example.demo.repository.ContactRepository;
import com.example.demo.repository.EmailLogRepository;
import com.example.demo.repository.LeadRepository;
import com.example.demo.repository.LogRepository;
import com.example.demo.service.LogService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class LogServiceImpl implements LogService {

    private final LogRepository activityRepo;
    private final LeadRepository leadRepo;
    private final ContactRepository contactRepo;
    @Autowired
    private EmailLogRepository emailLogRepo;

    public LogServiceImpl(
            LogRepository activityRepo,
            LeadRepository leadRepo,
            ContactRepository contactRepo) {

        this.activityRepo = activityRepo;
        this.leadRepo = leadRepo;
        this.contactRepo = contactRepo;
    }

    // =====================================================
    // CREATE ACTIVITY LOG
    // =====================================================
    @Override
    public void logActivity(LogRequestDTO dto) {

        // ---------------- VALIDATION ----------------
        if (dto.getActivityType() == null) {
            throw new RuntimeException("Activity Type is required");
        }

        if (dto.getLeadId() == null) {
            throw new RuntimeException("Lead is required");
        }

        System.out.println(dto.getStatus());

        EmailLogDashboard activity = new EmailLogDashboard();

        // ---------------- COMMON FIELD MAPPING ----------------
        mapCommonFields(activity, dto);

        System.out.println(dto.getNextActionType());

//        // ---------------- CONTACT LOGIC ----------------
//        if (dto.getContactId() != null) {
//
//            Contact contact = contactRepo.findById(dto.getContactId())
//                    .orElseThrow(() -> new RuntimeException("Contact not found"));
//
//            activity.setContact(contact);
//
//            activity.setPersonName(
//                    contact.getFirstName() + " " + contact.getLastName()
//            );
//        }

        // ---------------- LEAD LOGIC ----------------
        if (dto.getLeadId() != null) {

            Lead lead = leadRepo.findById(dto.getLeadId())
                    .orElseThrow(() -> new RuntimeException("Lead not found"));

            activity.setLead(lead);

            if (activity.getPersonName() == null
                    && lead.getContact() != null) {

                activity.setPersonName(
                        lead.getContact().getFirstName() + " "
                                + lead.getContact().getLastName()
                );
                activityRepo.save(activity);
            }
        }

        // ---------------- FALLBACK PERSON NAME ----------------
        if (activity.getPersonName() == null) {
            activity.setPersonName("Unknown");
        }

        // ---------------- TIMESTAMP ----------------
        activity.setCreatedAt(LocalDateTime.now());

        // ---------------- SAVE ----------------
        activityRepo.save(activity);


        if (dto.getEmailLogId() != null) {

            EmailLog emailLog =
                    emailLogRepo.findById(dto.getEmailLogId())
                            .orElseThrow(() ->
                                    new RuntimeException("Email Log not found"));

            emailLog.setOutcome(dto.getOutcome());
            emailLog.setNextAction(dto.getNextActionType());

            emailLogRepo.save(emailLog);
        }
    }

    // =====================================================
    // DASHBOARD DATA
    // =====================================================
    @Override
    public List<LogTableDTO> getDashboardActivities() {
        String profileId = TenantContext.getCurrentTenant();
        return activityRepo.fetchDashboard(profileId);
    }

    // =====================================================
    // COMMON FIELD MAPPER (Clean Code)
    // =====================================================
    private void mapCommonFields(
            EmailLogDashboard activity,
            LogRequestDTO dto) {

        activity.setOutcome(dto.getOutcome());
        activity.setNotes(dto.getNotes());
        activity.setActivityType(dto.getActivityType());
        activity.setNextActionType(dto.getNextActionType());
        activity.setNextActionDate(dto.getNextActionDate());
        activity.setNextActionTime(dto.getNextActionTime());
        activity.setStatus(dto.getStatus());
    }

}