package com.example.demo.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.demo.entity.Campaign;
import com.example.demo.entity.CampaignTarget;
import org.springframework.stereotype.Repository;

import java.util.List;
@Repository
public interface CampaignTargetRepository extends JpaRepository<CampaignTarget, Long> {

    List<CampaignTarget> findByCampaign(Campaign campaign);
}
