package com.example.demo.repository;

import com.example.demo.entity.EmailLog;
import com.example.demo.entity.EmailStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
@Repository
public interface EmailLogRepository extends JpaRepository<EmailLog, Long> {

    long countByStatus(EmailStatus status);

    @Query("""
        SELECT e.status, COUNT(e)
        FROM EmailLog e
        WHERE e.campaign.campaignId = :campaignId
        GROUP BY e.status
    """)
    List<Object[]> getCampaignEmailStats(Long campaignId);

    @Query("SELECT COUNT(e) FROM EmailLog e WHERE e.status = 'SENT'")
    long totalSentEmails();

    List<EmailLog> findByStatus(EmailStatus emailStatus);

    long countByCampaign_CampaignIdAndClickedTrue(Long campaignId);

    long countByCampaign_CampaignIdAndStatus(Long campaignId, EmailStatus emailStatus);

    long countByCampaign_CampaignIdAndOpenedTrue(Long campaignId);

    void deleteByCampaign_CampaignId(Long id);
}
