package com.example.demo.service;

import com.example.demo.entity.Lead;
import com.example.demo.entity.Notification;

import java.util.List;

public interface NotificationService {

    void createNotification(String title, String message,
                            Lead lead);

    void createNotification(String type,
                            String title,
                            String message,
                            Lead lead);

    List<Notification> getAllNotifications();

    List<Notification> getUnreadNotifications();

    void markAsRead(Long id);

    void deleteNotification(Long id);

    void clearAll();

    long getUnreadCount();

    long getReadCount();

}
