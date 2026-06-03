package com.example.demo.repository;

import com.example.demo.entity.CampaignStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import com.example.demo.entity.Campaign;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
@Repository
public interface CampaignRepository extends JpaRepository<Campaign, Long> {

    List<Campaign> findByStatus(CampaignStatus status);

    List<Campaign> findByStatusAndType(CampaignStatus status, String type);

    long countByStatus(CampaignStatus status);


    List<Campaign> findByNameContainingIgnoreCase(String keyword);

    //  Aggregates
    @Query("SELECT COALESCE(SUM(c.leadsGenerated),0) FROM Campaign c")
    long sumLeads();

    @Query("SELECT AVG(c.conversionRate) FROM Campaign c")
    Double avgConversionRate();



    List<Campaign> findByProfileId(String profileId);

    List<Campaign> findByProfileIdAndStatus(String profileId, CampaignStatus status);

    List<Campaign> findByProfileIdAndStatusAndType(String profileId, CampaignStatus status, String type);

    long countByProfileIdAndStatus(String profileId, CampaignStatus status);

    long countByProfileId(String profileId);
}
