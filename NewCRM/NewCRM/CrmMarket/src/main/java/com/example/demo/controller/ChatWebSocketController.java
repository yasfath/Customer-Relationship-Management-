package com.example.demo.controller;

import com.example.demo.Configuration.TenantContext;
import com.example.demo.dto.ChatMessageDTO;
import com.example.demo.entity.ChatMessage;
import com.example.demo.repository.ChatMessageRepository;
import com.example.demo.repository.ChatRoomMemberRepository;
import com.example.demo.service.impl.ChatService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/api")
@RequiredArgsConstructor
public class ChatWebSocketController {

    private final ChatMessageRepository messageRepository;

    private final ChatService chatService;
    private final SimpMessagingTemplate messagingTemplate;
    private final ChatRoomMemberRepository memberRepository;


    @GetMapping("/room/{roomId}/messages")
    public ResponseEntity<?> getMessages(@PathVariable Long roomId) {

        Long staffId = TenantContext.getCurrentStaffId(); // or from session

        boolean isMember = memberRepository.existsByRoomIdAndStaffId(roomId, staffId);

        if (!isMember) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body("You are not part of this chat room");
        }

        return ResponseEntity.ok(
                messageRepository.findByRoomIdOrderByCreatedAtAsc(roomId)
        );
    }

    @MessageMapping("/chat/{roomId}")
    public void sendMessage(
            @DestinationVariable Long roomId,
            ChatMessageDTO dto) {

        long start = System.currentTimeMillis();


        System.out.println("Processing time: " + (System.currentTimeMillis() - start));


        ChatMessage saved = chatService.saveMessage(dto);
        System.out.println("Send message called"+dto);
        messagingTemplate.convertAndSend(
                "/topic/room/" + roomId,
                saved
        );
    }

    @DeleteMapping("/room/{roomId}")
    public ResponseEntity<?> deleteRoom(@PathVariable Long roomId) {

        chatService.deleteRoom(roomId);

        return ResponseEntity.ok("Chat room deleted successfully");
    }
}