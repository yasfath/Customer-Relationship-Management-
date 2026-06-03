package com.example.demo.repository;

import com.example.demo.dto.LeadAnalyticsDTO;
import com.example.demo.dto.LeadTableDTO;
import com.example.demo.entity.LeadStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import com.example.demo.entity.Lead;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
@Repository
public interface LeadRepository extends JpaRepository<Lead,Long> {

    long countByStatus(LeadStatus status);

    @Query("""
SELECT new com.example.demo.dto.LeadTableDTO(
    l.leadId,
    CONCAT(c.firstName,' ',c.lastName),
    c.email,
    c.phone,
    c.source,
    l.status,
    l.assignedTo,
    c.assignedStaff,
    l.leadScore,
    l.segment,
    l.automationEnabled,
    l.createdAt,
    cam.campaignId,
    cam.name
)
FROM Lead l
JOIN l.contact c
LEFT JOIN l.campaign cam
WHERE l.profileId = :profileId
""")
    List<LeadTableDTO> fetchAllLeads(String profileId);

    @Query("""
SELECT new com.example.demo.dto.LeadTableDTO(
    l.leadId,
    CONCAT(c.firstName,' ',c.lastName),
    c.email,
    c.phone,
    c.source,
    l.status,
    l.assignedTo
)
FROM Lead l
JOIN l.contact c
WHERE l.profileId = :profileId
AND (:status IS NULL OR l.status = :status)
AND (:assignedTo IS NULL OR l.assignedTo = :assignedTo)
AND (:search IS NULL OR 
     LOWER(c.firstName) LIKE LOWER(CONCAT('%',:search,'%')) OR
     LOWER(c.email) LIKE LOWER(CONCAT('%',:search,'%')))
""")
    List<LeadTableDTO> filterLeads(
            String profileId,
            LeadStatus status,
            String assignedTo,
            String search
    );

    long countByAssignedTo(String salesTeam);

    List<Lead> findByAssignedTo(String salesTeam);

    List<Lead> findByStatus(LeadStatus leadStatus);

    long countByCampaignCampaignId(Long campaignId);

    long countByCampaignCampaignIdAndStatus(
            Long campaignId,
            LeadStatus status);

    long countByCampaignIsNotNull();

    long countByCampaignIsNotNullAndStatus(LeadStatus status);

    @Query("""
    SELECT new com.example.demo.dto.LeadAnalyticsDTO(
        CAST(l.createdAt AS date),
        SUM(CASE WHEN c.source = 'EMAIL' THEN 1 ELSE 0 END),
        SUM(CASE WHEN c.source = 'SOCIAL_MEDIA' THEN 1 ELSE 0 END),
        SUM(CASE WHEN c.source = 'ORGANIC' THEN 1 ELSE 0 END)
    )
    FROM Lead l
    JOIN l.contact c
    WHERE l.createdAt >= :startDate
    GROUP BY CAST(l.createdAt AS date)
    ORDER BY CAST(l.createdAt AS date)
""")
    List<LeadAnalyticsDTO> getLeadsAnalytics(
            @Param("startDate") LocalDateTime startDate);

    @Query("""
SELECT new com.example.demo.dto.LeadAnalyticsDTO(
    CAST(l.createdAt AS date),
    SUM(CASE WHEN c.source = 'EMAIL' THEN 1 ELSE 0 END),
    SUM(CASE WHEN c.source = 'SOCIAL_MEDIA' THEN 1 ELSE 0 END),
    SUM(CASE WHEN c.source = 'ORGANIC' THEN 1 ELSE 0 END)
)
FROM Lead l
JOIN l.contact c
WHERE l.createdAt >= :startDate
AND l.profileId = :profileId
GROUP BY CAST(l.createdAt AS date)
ORDER BY CAST(l.createdAt AS date)
""")
    List<LeadAnalyticsDTO> getLeadsAnalytics(
            LocalDateTime startDate,
            String profileId
    );

    long countByCampaignCampaignIdAndStatusAndProfileId(
            Long campaignId,
            LeadStatus status,
            String profileId
    );

    long countByCampaignIsNotNullAndProfileId(String profileId);

    long countByCampaignIsNotNullAndStatusAndProfileId(
            LeadStatus status,
            String profileId
    );
    long countByCampaignCampaignIdAndProfileId(Long campaignId, String profileId);

    long countByStatusAndProfileId(LeadStatus status, String profileId);

    long countByAssignedToAndProfileId(String assignedTo, String profileId);

    long countByProfileId(String profileId);

}
