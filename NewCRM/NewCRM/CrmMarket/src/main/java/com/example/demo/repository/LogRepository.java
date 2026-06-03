package com.example.demo.repository;

import com.example.demo.dto.LogTableDTO;
import com.example.demo.entity.EmailLogDashboard;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LogRepository extends JpaRepository<EmailLogDashboard, Long> {

    @Query("""
    SELECT new com.example.demo.dto.LogTableDTO(
        a.logId,
        a.createdAt,
        a.outcome,
        a.notes,
        COALESCE(
            CONCAT(c.firstName, ' ', c.lastName),
            a.personName
        ),
        a.nextAction,
        a.activityType,
        a.nextActionType,
        a.nextActionDate,
        a.nextActionTime,
        a.status
    )
    FROM EmailLogDashboard a
    LEFT JOIN a.contact c
    LEFT JOIN a.lead l
    WHERE a.profileId = :profileId
    ORDER BY a.createdAt DESC
""")
    List<LogTableDTO> fetchDashboard(String profileId);
}
