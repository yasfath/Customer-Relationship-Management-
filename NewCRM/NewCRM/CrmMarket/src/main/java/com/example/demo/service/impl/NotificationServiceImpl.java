package com.example.demo.service.impl;

import com.example.demo.Configuration.TenantContext;
import com.example.demo.entity.Lead;
import com.example.demo.entity.Notification;
import com.example.demo.repository.NotificationRepository;
import com.example.demo.service.NotificationService;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class NotificationServiceImpl implements NotificationService {

    private final NotificationRepository notificationRepository;

    public NotificationServiceImpl(NotificationRepository notificationRepository) {
        this.notificationRepository = notificationRepository;
    }

    @Override
    public void createNotification(String title, String message, Lead lead) {

    }

    @Override
    public void createNotification(String type,
                                   String title,
                                   String message,
                                   Lead lead) {

        Notification notification = new Notification();
        notification.setType(type);
        notification.setTitle(title);
        notification.setMessage(message);
        notification.setLead(lead);
        notification.setRead(false);
        notification.setCreatedAt(LocalDateTime.now());

        notificationRepository.save(notification);
    }

    @Override
    public List<Notification> getAllNotifications() {
        String profileId = TenantContext.getCurrentTenant();

        return notificationRepository
                .findByProfileIdOrderByCreatedAtDesc(profileId);
    }

    @Override
    public List<Notification> getUnreadNotifications() {
        String profileId = TenantContext.getCurrentTenant();

        return notificationRepository
                .findByProfileIdOrderByCreatedAtDesc(profileId);
    }

    @Override
    @Transactional
    public void markAsRead(Long notificationId) {
        notificationRepository.markAsRead(notificationId);
    }

    @Override
    public void deleteNotification(Long id) {

        Notification notification = notificationRepository
                .findById(id)
                .orElseThrow(() -> new RuntimeException("Notification not found"));

        if (!notification.getProfileId()
                .equals(TenantContext.getCurrentTenant())) {

            throw new RuntimeException("Unauthorized access");
        }

        notificationRepository.delete(notification);
    }

    @Override
    public void clearAll() {

        String profileId = TenantContext.getCurrentTenant();

        notificationRepository.deleteByProfileId(profileId);
    }

    @Override
    public long getUnreadCount() {

        String profileId = TenantContext.getCurrentTenant();

        return notificationRepository
                .countByProfileIdAndIsReadFalse(profileId);
    }

    @Override
    public long getReadCount() {

        String profileId = TenantContext.getCurrentTenant();

        return notificationRepository
                .countByProfileIdAndIsReadTrue(profileId);
    }
}