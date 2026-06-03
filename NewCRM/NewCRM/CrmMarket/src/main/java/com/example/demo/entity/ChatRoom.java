package com.example.demo.entity;

import com.example.demo.Configuration.TenantContext;
import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Data
@Table(name = "chat_rooms")
public class ChatRoom {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String roomName;

    private String roomCode;

    private Boolean groupChat = true;

    private Boolean active = true;

    @Column(name = "profile_id")
    private String profileId;

    private LocalDateTime createdAt = LocalDateTime.now();

    @PrePersist
    public void setTenant() {
        this.profileId = TenantContext.getCurrentTenant();
    }

}