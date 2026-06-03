package com.example.demo.service.impl;

import com.example.demo.Configuration.TenantContext;
import com.example.demo.dto.ActivityPercentageDTO;
import com.example.demo.dto.ActivityRequestDTO;
import com.example.demo.dto.ActivityTimelineDTO;
import com.example.demo.dto.RelatedPersonDTO;
import com.example.demo.entity.Activity;
import com.example.demo.entity.ActivityStatus;
import com.example.demo.entity.Contact;
import com.example.demo.entity.Lead;
import com.example.demo.repository.ActivityRepository;
import com.example.demo.repository.ContactRepository;
import com.example.demo.repository.LeadRepository;
import com.example.demo.service.ActivityService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class ActivityServiceImpl implements ActivityService {

    private final ActivityRepository activityRepo;
    private final LeadRepository leadRepo;
    private final ContactRepository contactRepo;

    public ActivityServiceImpl(
            ActivityRepository activityRepo,
            LeadRepository leadRepo,
            ContactRepository contactRepo) {

        this.activityRepo = activityRepo;
        this.leadRepo = leadRepo;
        this.contactRepo = contactRepo;
    }


    // LOG NEW ACTIVITY
    @Override
    public void logActivity(ActivityRequestDTO dto) {

        Activity a = new Activity();
        a.setActivityType(dto.getActivityType());
        a.setActivityDate(dto.getDate());
        a.setActivityTime(dto.getTime());
        a.setDuration(dto.getDuration());
        a.setDescription(dto.getDescription());

        if (dto.getLeadId() != null) {
            a.setLead(
                    leadRepo.findById(dto.getLeadId()).orElseThrow()
            );
        }

        if (dto.getContactId() != null) {
            a.setContact(
                    contactRepo.findById(dto.getContactId()).orElseThrow()
            );
        }

        activityRepo.save(a);
    }

    // TIMELINE
    @Override
    public List<ActivityTimelineDTO> getTimeline() {


        String profileId = TenantContext.getCurrentTenant();

        return activityRepo.findTop10ByProfileIdOrderByCreatedAtDesc(profileId)
                .stream()
                .map(a -> new ActivityTimelineDTO(
                        a.getActivityType(),
                        a.getDescription(),

                        // PERSON NAME
                        a.getLead() != null
                                ? a.getLead().getContact().getFirstName()
                                : a.getContact().getFirstName(),

                        // COMPANY NAME
                        a.getLead() != null
                                ? a.getLead().getContact().getCompany()
                                : a.getContact().getCompany(),

                        a.getCreatedAt()
                ))
                .toList();
    }


    // RIGHT PANEL DETAILS
    @Override
    public RelatedPersonDTO getRelatedPerson(Long leadId) {

        Lead lead = leadRepo.findById(leadId).orElseThrow();

        String profileId = TenantContext.getCurrentTenant();
        if (!lead.getProfileId().equals(profileId)) {
            throw new RuntimeException("Unauthorized access");
        }
        Contact c = lead.getContact();

        return new RelatedPersonDTO(
                c.getFirstName()+" "+c.getLastName(),
                c.getEmail(),
                c.getPhone(),
                lead.getStatus().name()
        );
    }

    // ACTIVITY %
    @Override
    public ActivityPercentageDTO getActivityPercentage() {

        String profileId = TenantContext.getCurrentTenant();

        LocalDateTime now = LocalDateTime.now();

        List<Activity> activities = activityRepo.findByProfileId(profileId);

        for (Activity a : activities) {

            if (a.getActivityDate() != null && a.getActivityTime() != null) {

                LocalDateTime activityDateTime =
                        LocalDateTime.of(a.getActivityDate(), a.getActivityTime());

                if (activityDateTime.isBefore(now) &&
                        a.getStatus() != ActivityStatus.COMPLETED) {

                    a.setStatus(ActivityStatus.COMPLETED);
                }
            }
        }

        activityRepo.saveAll(activities);

        Long total = activityRepo.countByProfileId(profileId);

        Long completed = activityRepo.countByProfileIdAndStatus(
                profileId,
                ActivityStatus.COMPLETED
        );

        Double percent = total == 0 ? 0 :
                (double) Math.round((completed * 100.0) / total);

        return new ActivityPercentageDTO(total, completed, percent);
    }

    @Override
    public List<Activity> getAllActivities() {
        String profileId = TenantContext.getCurrentTenant();

        return activityRepo.findByProfileId(profileId);
    }



}
