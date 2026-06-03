//package com.example.demo.Configuration;
//
//import io.jsonwebtoken.Claims;
//import lombok.RequiredArgsConstructor;
//import org.springframework.messaging.Message;
//import org.springframework.messaging.MessageChannel;
//import org.springframework.messaging.simp.stomp.StompCommand;
//import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
//import org.springframework.messaging.support.ChannelInterceptor;
//import org.springframework.stereotype.Component;
//@Component
//@RequiredArgsConstructor
//public class WebSocketTenantInterceptor implements ChannelInterceptor {
//
//    private final JwtUtil jwtUtil;
//
//    @Override
//    public Message<?> preSend(Message<?> message, MessageChannel channel) {
//
//        StompHeaderAccessor accessor = StompHeaderAccessor.wrap(message);
//
//        if (StompCommand.CONNECT.equals(accessor.getCommand())) {
//
//            String authHeader = accessor.getFirstNativeHeader("Authorization");
//
//            if (authHeader != null && authHeader.startsWith("Bearer ")) {
//
//                String token = authHeader.substring(7);
//
//                Claims claims = jwtUtil.extractAllClaims(token);
//
//                String profileId = claims.get("profileId", String.class);
//                Long staffId = claims.get("staffId", Long.class);
//
//                accessor.getSessionAttributes().put("profileId", profileId);
//                accessor.getSessionAttributes().put("staffId", staffId);
//            }
//        }
//
//        if (StompCommand.SEND.equals(accessor.getCommand())) {
//
//            Object profileId = accessor.getSessionAttributes().get("profileId");
//            Object staffId = accessor.getSessionAttributes().get("staffId");
//
//            TenantContext.setCurrentTenant((String) profileId);
//            TenantContext.setCurrentStaffId((Long) staffId);
//        }
//
//        return message;
//    }
//}