package com.example.demo.service.impl;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.dto.SocialEngagementDTO;
import com.example.demo.dto.SocialPostRequestDTO;
import com.example.demo.dto.SocialPostResponseDTO;
import com.example.demo.entity.Contact;
import com.example.demo.entity.SocialEngagement;
import com.example.demo.entity.SocialEngagementType;
import com.example.demo.entity.SocialPlatform;
import com.example.demo.entity.SocialPost;
import com.example.demo.repository.ContactRepository;
import com.example.demo.repository.SocialEngagementRepository;
import com.example.demo.repository.SocialPostRepository;
import com.example.demo.service.SocialMediaService;

@Service
public class SocialMediaServiceImpl implements SocialMediaService {

	@Autowired
    private  SocialPostRepository postRepository;
	@Autowired
    private  SocialEngagementRepository engagementRepository;
	@Autowired
    private  ContactRepository contactRepository;

    @Override
    public SocialPostResponseDTO schedulePost(SocialPostRequestDTO dto) {

        SocialPost post = new SocialPost();
        post.setPlatform(SocialPlatform.valueOf(dto.getPlatform()));
        post.setContent(dto.getContent());
        post.setScheduledAt(LocalDateTime.parse(dto.getScheduledAt()));

        SocialPost saved = postRepository.save(post);

        SocialPostResponseDTO response = new SocialPostResponseDTO();
        response.setPostId(saved.getPostId());
        response.setPlatform(saved.getPlatform().name());
        response.setPublished(saved.getPublished());

        return response;
    }

    @Override
    public void publishPost(Long postId) {

        SocialPost post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));

        post.setPublished(true);
        postRepository.save(post);
    }

    @Override
    public void recordEngagement(SocialEngagementDTO dto) {

        SocialPost post = postRepository.findById(dto.getPostId())
                .orElseThrow(() -> new RuntimeException("Post not found"));

        Contact contact = contactRepository.findById(dto.getContactId())
                .orElseThrow(() -> new RuntimeException("Contact not found"));

        SocialEngagement engagement = new SocialEngagement();
        engagement.setPost(post);
        engagement.setContact(contact);
        engagement.setEngagementType(
                SocialEngagementType.valueOf(dto.getEngagementType()));

        engagementRepository.save(engagement);
    }

    @Override
    public List<SocialPostResponseDTO> getAllPosts() {

        return postRepository.findAll()
                .stream()
                .map(post -> {
                    SocialPostResponseDTO dto = new SocialPostResponseDTO();
                    dto.setPostId(post.getPostId());
                    dto.setPlatform(post.getPlatform().name());
                    dto.setPublished(post.getPublished());
                    return dto;
                })
                .collect(Collectors.toList());
    }
}
