package com.example.demo.controller;

import com.example.demo.dto.ProfileStatsDTO;
import com.example.demo.service.impl.ProfileStatsService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/profile")
public class ProfileStatsController {

    private final ProfileStatsService profileStatsService;

    public ProfileStatsController(ProfileStatsService profileStatsService) {
        this.profileStatsService = profileStatsService;
    }

    @GetMapping("/stats")
    public ProfileStatsDTO getProfileStats() {

        return profileStatsService.getStats();
    }
}