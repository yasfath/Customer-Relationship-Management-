package com.example.demo.entity;

import com.example.demo.Configuration.TenantContext;
import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
@Table(name = "chat_room_members")
public class ChatRoomMember {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long roomId;

    private Long staffId;

    @Enumerated(EnumType.STRING)
    private MemberType memberType;

    @Column(name = "profile_id", nullable = false)
    private String profileId;

    @PrePersist
    public void setTenant() {
        this.profileId = TenantContext.getCurrentTenant();
    }
}
