package com.example.demo.controller;

import com.example.demo.entity.Notification;
import com.example.demo.service.NotificationService;
import org.springframework.web.bind.annotation.*;
import java.util.List;
@RestController
@RequestMapping("/api/notifications")
@CrossOrigin
public class NotificationController {

    private final NotificationService notificationService;

    public NotificationController(NotificationService notificationService) {
        this.notificationService = notificationService;
    }

    // Get all
    @GetMapping("/getall")
    public List<Notification> getAll() {
        return notificationService.getAllNotifications();
    }

    // Get unread only
    @GetMapping("/unread")
    public List<Notification> getUnreadNotifications() {
        return notificationService.getUnreadNotifications();
    }

    // Mark single as read
    @PutMapping("/read/{id}")
    public String markAsRead(@PathVariable Long id) {
        notificationService.markAsRead(id);
        return "Notification marked as read";
    }

    // Delete single
    @DeleteMapping("/{id}")
    public String deleteNotification(@PathVariable Long id) {
        notificationService.deleteNotification(id);
        return "Notification deleted";
    }

    // Clear all
    @DeleteMapping("/clear")
    public String clearAll() {
        notificationService.clearAll();
        return "All notifications cleared";
    }

    // Count unread
    @GetMapping("/count/unread")
    public long getUnreadCount() {
        return notificationService.getUnreadCount();
    }

    // Count read
    @GetMapping("/count/read")
    public long getReadCount() {
        return notificationService.getReadCount();
    }
}