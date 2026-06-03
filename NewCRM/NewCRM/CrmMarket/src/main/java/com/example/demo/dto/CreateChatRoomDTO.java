package com.example.demo.dto;

import lombok.Data;
import java.util.List;

@Data
public class CreateChatRoomDTO {

    private String roomName;
    private String roomCode;
    private Boolean groupChat;
    private List<Long> memberIds;

}