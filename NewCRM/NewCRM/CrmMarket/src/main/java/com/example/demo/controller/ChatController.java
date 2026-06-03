package com.example.demo.controller;

import com.example.demo.dto.CreateChatRoomDTO;
import com.example.demo.entity.ChatRoom;
import com.example.demo.service.impl.ChatService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/chat")
@RequiredArgsConstructor
public class ChatController {

    private final ChatService service;

    @PostMapping("/room")
    public ResponseEntity<?> createRoom(
            @RequestBody CreateChatRoomDTO dto) {

        return ResponseEntity.ok(service.createRoom(dto));
    }


    @GetMapping("/my-rooms")
    public ResponseEntity<?> getMyRooms() {

        List<ChatRoom> rooms = service.getMyRooms();

        if (rooms.isEmpty()) {

            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "You are not a member of any chat rooms");

            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        }

        return ResponseEntity.ok(rooms);
    }

}