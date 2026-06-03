package com.example.demo.service;

import com.example.demo.dto.ActivityPercentageDTO;
import com.example.demo.dto.ActivityRequestDTO;
import com.example.demo.dto.ActivityTimelineDTO;
import com.example.demo.dto.RelatedPersonDTO;
import com.example.demo.entity.Activity;

import java.util.List;

public interface ActivityService {

    void logActivity(ActivityRequestDTO dto);

    List<ActivityTimelineDTO> getTimeline();

    RelatedPersonDTO getRelatedPerson(Long leadId);

    ActivityPercentageDTO getActivityPercentage();

    List<Activity> getAllActivities();

}
