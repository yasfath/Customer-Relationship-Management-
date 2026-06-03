package com.example.demo.controller;

import com.example.demo.dto.ActivityPercentageDTO;
import com.example.demo.dto.ActivityRequestDTO;
import com.example.demo.dto.ActivityTimelineDTO;
import com.example.demo.dto.RelatedPersonDTO;
import com.example.demo.entity.Activity;
import com.example.demo.service.ActivityService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/activities")
@CrossOrigin
public class ActivityController {

    private final ActivityService service;

    public ActivityController(ActivityService service) {
        this.service = service;
    }

    // LOG NEW ACTIVITY
    @PostMapping("/logactivity")
    public ResponseEntity<?> logActivity(
            @RequestBody ActivityRequestDTO dto) {

        try {
            service.logActivity(dto);
            return ResponseEntity
                    .status(HttpStatus.CREATED)
                    .body("Activity logged successfully");

        } catch (Exception e) {
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body("Failed to log activity: " + e.getMessage());
        }
    }

    // ACTIVITY TIMELINE
    @GetMapping("/timeline")
    public ResponseEntity<?> timeline() {

        try {
            List<ActivityTimelineDTO> list = service.getTimeline();
            return ResponseEntity.ok(list);

        } catch (Exception e) {
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Unable to fetch timeline");
        }
    }

    // RIGHT PANEL DETAILS
    @GetMapping("/related/{leadId}")
    public ResponseEntity<?> related(
            @PathVariable Long leadId) {

        try {
            RelatedPersonDTO dto = service.getRelatedPerson(leadId);
            return ResponseEntity.ok(dto);

        } catch (Exception e) {
            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body("Lead not found");
        }
    }

    // ACTIVITY PERCENTAGE
    @GetMapping("/percentage")
    public ResponseEntity<?> percentage() {

        try {
            ActivityPercentageDTO dto = service.getActivityPercentage();
            return ResponseEntity.ok(dto);

        } catch (Exception e) {
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Unable to calculate activity percentage");
        }
    }

    @GetMapping("/all")
    public List<Activity> getAllActivities() {
        return service.getAllActivities();
    }
}
