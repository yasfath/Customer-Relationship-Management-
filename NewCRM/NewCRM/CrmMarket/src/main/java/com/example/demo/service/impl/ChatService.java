package com.example.demo.service.impl;

import com.example.demo.Configuration.TenantContext;
import com.example.demo.Exceptions.ResourceNotFoundException;
import com.example.demo.dto.ChatMessageDTO;
import com.example.demo.dto.CreateChatRoomDTO;
import com.example.demo.entity.*;
import com.example.demo.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ChatService {

    private final ChatRoomRepository roomRepo;
    private final ChatRoomMemberRepository memberRepo;
    private final ChatMessageRepository messageRepo;
    private final StaffRepository staffRepository;
    private final UserRepository userRepository;

    public ChatRoom createRoom(CreateChatRoomDTO dto) {

        ChatRoom room = new ChatRoom();
        room.setRoomName(dto.getRoomName());
        room.setRoomCode(dto.getRoomCode());
        room.setGroupChat(dto.getGroupChat());
        room = roomRepo.save(room);

        for (Long memberId : dto.getMemberIds()) {

            ChatRoomMember member = new ChatRoomMember();
            member.setRoomId(room.getId());
            member.setStaffId(memberId);

            memberRepo.save(member);
        }

        return room;
    }


    public List<ChatRoom> getMyRooms() {

        String profileId = TenantContext.getCurrentTenant();
        Long staffId = TenantContext.getCurrentStaffId();
        System.out.println("ID----------------"+profileId);
        System.out.println("ST ID----------------"+staffId);
        return roomRepo.findRoomsForStaff(profileId, staffId);
    }


    public ChatMessage saveMessage(ChatMessageDTO dto) {

        Long staffId = TenantContext.getCurrentStaffId();

        boolean isMember = memberRepo.existsByRoomIdAndStaffId(dto.getRoomId(), staffId);

        // optional membership validation
//    if (!isMember) {
//        throw new RuntimeException("You are not a member of this chat room");
//    }

        Long senderId = dto.getSenderId();

        String senderName;
        String senderProfileImage;


        if (senderId >= 10000000) {

            Staff staff = staffRepository.findById(senderId)
                    .orElseThrow(() -> new RuntimeException("Staff not found"));

            senderName = staff.getName();
            senderProfileImage = staff.getProfileImage();

        } else {

            User user = userRepository.findById(senderId)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            senderName = user.getFullName();
            senderProfileImage = user.getProfileImage();
        }

        ChatRoom room = roomRepo.findById(dto.getRoomId())
                .orElseThrow(() -> new RuntimeException("Room not found"));

        ChatMessage message = new ChatMessage();
        message.setMessage(dto.getMessage());
        message.setSenderId(senderId);
        message.setSenderName(senderName);
        message.setSenderProfileImage(senderProfileImage);
        message.setRoom(room);
        message.setProfileId(dto.getProfileId());

        return messageRepo.save(message);
    }

    @Transactional
    public void deleteRoom(Long roomId) {

        ChatRoom room = roomRepo.findById(roomId)
                .orElseThrow(() -> new ResourceNotFoundException("Room not found"));

        // delete messages
        messageRepo.deleteByRoom_Id(roomId);

        // delete members
        memberRepo.deleteByRoomId(roomId);

        // delete room
        roomRepo.delete(room);
    }
}