package com.example.demo.dto;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class ChatMessageDTO {
    private Long id;
    private Long roomId;
    private Long senderId;
    private String senderName;
    private String senderProfileImage;
    private String message;
    private LocalDateTime createdAt;

    private String profileId;


}