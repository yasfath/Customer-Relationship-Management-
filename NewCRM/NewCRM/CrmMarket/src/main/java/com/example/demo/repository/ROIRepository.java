package com.example.demo.repository;

import com.example.demo.entity.ROIReport;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ROIRepository
        extends JpaRepository<ROIReport, Long> {

    Optional<ROIReport> findByCampaignId(Long campaignId);
    Optional<ROIReport> findTopByCampaignIdOrderByCreatedAtDesc(Long campaignId);

}
