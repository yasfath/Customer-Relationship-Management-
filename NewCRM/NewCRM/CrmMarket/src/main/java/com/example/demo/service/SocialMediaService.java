package com.example.demo.service;

import java.util.List;

import com.example.demo.dto.SocialEngagementDTO;
import com.example.demo.dto.SocialPostRequestDTO;
import com.example.demo.dto.SocialPostResponseDTO;

public interface SocialMediaService {

    SocialPostResponseDTO schedulePost(SocialPostRequestDTO dto);

    void publishPost(Long postId);

    void recordEngagement(SocialEngagementDTO dto);

    List<SocialPostResponseDTO> getAllPosts();
}
