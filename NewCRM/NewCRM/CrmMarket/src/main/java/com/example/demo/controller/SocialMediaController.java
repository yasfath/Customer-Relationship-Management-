package com.example.demo.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.dto.SocialEngagementDTO;
import com.example.demo.dto.SocialPostRequestDTO;
import com.example.demo.dto.SocialPostResponseDTO;
import com.example.demo.service.SocialMediaService;

@RestController
@RequestMapping("/api/social")
public class SocialMediaController {

    private final SocialMediaService socialMediaService;

    public SocialMediaController(SocialMediaService socialMediaService) {
        this.socialMediaService = socialMediaService;
    }

    // 🔹 Schedule Social Post
    @PostMapping("/posts")
    public ResponseEntity<SocialPostResponseDTO> schedulePost(
            @RequestBody SocialPostRequestDTO dto) {

        return ResponseEntity.ok(socialMediaService.schedulePost(dto));
    }

    // 🔹 Publish Post
    @PostMapping("/posts/{postId}/publish")
    public ResponseEntity<String> publishPost(
            @PathVariable Long postId) {

        socialMediaService.publishPost(postId);
        return ResponseEntity.ok("Post published");
    }

    // 🔹 Record Engagement
    @PostMapping("/engagements")
    public ResponseEntity<String> recordEngagement(
            @RequestBody SocialEngagementDTO dto) {

        socialMediaService.recordEngagement(dto);
        return ResponseEntity.ok("Engagement recorded");
    }

    // 🔹 Get All Posts
    @GetMapping("/posts")
    public ResponseEntity<List<SocialPostResponseDTO>> getPosts() {

        return ResponseEntity.ok(socialMediaService.getAllPosts());
    }
}
