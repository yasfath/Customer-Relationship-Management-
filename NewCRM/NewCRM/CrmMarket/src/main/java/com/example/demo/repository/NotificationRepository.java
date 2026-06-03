package com.example.demo.repository;

import com.example.demo.entity.Notification;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {

    List<Notification> findByIsReadFalseOrderByCreatedAtDesc();

    List<Notification> findAllByOrderByCreatedAtDesc();

    long countByIsReadFalse();

    long countByIsReadTrue();

    @Modifying
    @Query("UPDATE Notification n SET n.isRead = true WHERE n.id = :id")
    void markAsRead(@Param("id") Long id);

    @Modifying
    @Query("""
UPDATE Notification n 
SET n.isRead = true 
WHERE n.id = :id 
AND n.profileId = :profileId
""")
    void markAsRead(Long id, String profileId);

    List<Notification> findByProfileIdOrderByCreatedAtDesc(String profileId);

    List<Notification> findByProfileIdAndIsReadFalseOrderByCreatedAtDesc(String profileId);

    long countByProfileIdAndIsReadFalse(String profileId);

    long countByProfileIdAndIsReadTrue(String profileId);

    void deleteByProfileId(String profileId);
}